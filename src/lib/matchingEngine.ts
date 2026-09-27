import { UserProfile, Scheme, EvaluationResult } from "@/types/scheme";

// Helper function to normalize strings for robust comparison
const normalizeDocName = (str: string) =>
  (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Smart fuzzy matcher for checking whether a required document is fulfilled
const isDocumentSatisfied = (
  requiredDocName: string,
  uploadedDocs: string[] = [],
  profile: UserProfile
): boolean => {
  const reqNorm = normalizeDocName(requiredDocName);

  // 1. Identity / Aadhaar Check
  if (
    reqNorm.includes("aadhaar") ||
    reqNorm.includes("identity") ||
    reqNorm.includes("uid") ||
    reqNorm.includes("idproof")
  ) {
    const hasAadhaarNumber =
      typeof profile?.aadhaar_number === "string" &&
      profile.aadhaar_number.replace(/\D/g, "").length >= 12;

    const hasAadhaarUpload = uploadedDocs.some((doc) => {
      const u = normalizeDocName(doc);
      return u.includes("aadhaar") || u.includes("identity") || u.includes("uid");
    });

    if ((profile as any)?.aadhaar_linked || hasAadhaarNumber || hasAadhaarUpload)  {
      return true;
    }
  }

  // 2. Income Certificate Check
  if (reqNorm.includes("income") || reqNorm.includes("aay")) {
    const hasIncomeDoc = uploadedDocs.some((doc) => {
      const u = normalizeDocName(doc);
      return u.includes("income") || u.includes("aay");
    });
    if (hasIncomeDoc) return true;
  }

  // 3. Caste / Category Certificate Check
  if (reqNorm.includes("caste") || reqNorm.includes("category") || reqNorm.includes("jati")) {
    const hasCasteDoc = uploadedDocs.some((doc) => {
      const u = normalizeDocName(doc);
      return u.includes("caste") || u.includes("jati") || u.includes("category");
    });
    if (hasCasteDoc) return true;
  }

  // 4. BPL / Ration Card Check
  if (reqNorm.includes("bpl") || reqNorm.includes("ration")) {
    if (profile?.bpl_card_holder) return true;
    const hasRationDoc = uploadedDocs.some((doc) => {
      const u = normalizeDocName(doc);
      return u.includes("bpl") || u.includes("ration");
    });
    if (hasRationDoc) return true;
  }

  // 5. Generic substring & fuzzy match against any uploaded file
  return uploadedDocs.some((uploaded) => {
    const upNorm = normalizeDocName(uploaded);
    return upNorm.includes(reqNorm) || reqNorm.includes(upNorm);
  });
};

export function evaluateSchemeEligibility(
  profile: UserProfile,
  scheme: Scheme
): EvaluationResult {
  const criteria = scheme.criteria;
  const failureReasons: string[] = [];
  const satisfiedReasons: string[] = [];

  // 1. Age Verification
  if (profile.age !== null && profile.age !== undefined && (profile.age as any) !== "") {
    const citizenAge = Number(profile.age);
    if (criteria.minAge !== undefined && citizenAge < criteria.minAge) {
      failureReasons.push(`Age (${citizenAge}) is below minimum requirement (${criteria.minAge} years).`);
    } else if (criteria.maxAge !== undefined && citizenAge > criteria.maxAge) {
      failureReasons.push(`Age (${citizenAge}) exceeds statutory limit (${criteria.maxAge} years).`);
    } else {
      satisfiedReasons.push(`Age criterion verified (${citizenAge} years).`);
    }
  }

  // 2. Gender Verification
  if (criteria.allowedGenders && criteria.allowedGenders.length > 0) {
    if (profile.gender && !criteria.allowedGenders.includes(profile.gender)) {
      failureReasons.push(`Restricted to ${criteria.allowedGenders.join(", ")} applicants.`);
    } else if (profile.gender) {
      satisfiedReasons.push(`Gender requirement satisfied (${profile.gender}).`);
    }
  }

  // 3. Social Category / Caste
  if (criteria.allowedCategories && criteria.allowedCategories.length > 0) {
    if (!criteria.allowedCategories.includes(profile.caste_category)) {
      failureReasons.push(`Restricted to ${criteria.allowedCategories.join(", ")} categories.`);
    } else {
      satisfiedReasons.push(`Social category eligible (${profile.caste_category}).`);
    }
  }

  // 4. Annual Income Verification
  if (profile.annual_income !== null && profile.annual_income !== undefined && (profile.annual_income as any) !== "") {
    const income = Number(profile.annual_income);
    if (criteria.maxAnnualIncome !== undefined && income > criteria.maxAnnualIncome) {
      failureReasons.push(
        `Family annual income (₹${income.toLocaleString("en-IN")}) exceeds ceiling of ₹${criteria.maxAnnualIncome.toLocaleString("en-IN")}.`
      );
    } else {
      satisfiedReasons.push(`Income under allowable limit.`);
    }
  }

  // 5. BPL Card Check
  if (criteria.requiresBplCard && !profile.bpl_card_holder) {
    failureReasons.push("Requires an active BPL or Antyodaya Ration Card.");
  }

  // 6. Student Status Check
  if (criteria.requiresStudent && !profile.is_student) {
    failureReasons.push("Must be an enrolled full-time student.");
  }

  // 7. Land Ownership Check
  if (criteria.requiresAgriculturalLand && !(profile as any).owns_agricultural_land && !(profile as any).is_farmer) {
    failureReasons.push("Applicant must own registered agricultural land holdings.");
  }

  const landArea = Number((profile as any).land_area_acres || (profile as any).land_holding_acres || 0);
  if (criteria.maxLandAcres !== undefined && landArea > criteria.maxLandAcres) {
    failureReasons.push(`Agricultural land area (${landArea} acres) exceeds upper threshold of ${criteria.maxLandAcres} acres.`);
  }

  // 8. Location / State
  if (criteria.allowedStates && criteria.allowedStates.length > 0) {
    if (profile.state && !criteria.allowedStates.includes(profile.state)) {
      failureReasons.push(`Restricted to residents of ${criteria.allowedStates.join(", ")}.`);
    }
  }

  const isEligible = failureReasons.length === 0;

  // --- Smart Document Readiness & Gap Analysis ---
  const requiredDocs = scheme.requiredDocuments || [];
  const uploaded = profile.uploaded_documents || [];

  // Filter into ready vs missing using isDocumentSatisfied
  const readyDocuments = requiredDocs.filter((doc) =>
    isDocumentSatisfied(doc.name, uploaded, profile)
  );

  const missingDocuments = requiredDocs.filter(
    (doc) => !isDocumentSatisfied(doc.name, uploaded, profile)
  );

  const readinessScore =
    requiredDocs.length > 0
      ? Math.round((readyDocuments.length / requiredDocs.length) * 100)
      : 100;

  // Synthesized AI Rationale
  let rationale = "";
  if (isEligible) {
    rationale = `Eligible citizen profile. ${satisfiedReasons.slice(0, 3).join(" ")}`;
  } else {
    rationale = `Ineligible due to: ${failureReasons.join(" ")}`;
  }

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    category: scheme.category,
    shortSummary: scheme.shortSummary,
    officialPortalUrl: scheme.officialPortalUrl,
    isEligible,
    matchingScore: isEligible ? (readinessScore >= 80 ? 95 : 80) : 20,
    rationale,
    readinessScore,
    readyDocuments,
    missingDocuments,
  };
}

export function runSchemeMatching(
  profile: UserProfile,
  schemes: Scheme[]
): EvaluationResult[] {
  return schemes.map((s) => evaluateSchemeEligibility(profile, s));
}