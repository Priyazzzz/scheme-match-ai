import { UserProfile, Scheme, EvaluationResult } from "@/types/scheme";

export function evaluateSchemeEligibility(
  profile: UserProfile,
  scheme: Scheme
): EvaluationResult {
  const criteria = scheme.criteria;
  const failureReasons: string[] = [];
  const satisfiedReasons: string[] = [];

  // 1. Age Verification
  if (profile.age !== null && profile.age !== undefined) {
    if (criteria.minAge !== undefined && profile.age < criteria.minAge) {
      failureReasons.push(`Age (${profile.age}) is below minimum requirement (${criteria.minAge} years).`);
    } else if (criteria.maxAge !== undefined && profile.age > criteria.maxAge) {
      failureReasons.push(`Age (${profile.age}) exceeds statutory limit (${criteria.maxAge} years).`);
    } else {
      satisfiedReasons.push(`Age criterion verified (${profile.age} years).`);
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
  if (profile.annual_income !== null && profile.annual_income !== undefined) {
    if (criteria.maxAnnualIncome !== undefined && profile.annual_income > criteria.maxAnnualIncome) {
      failureReasons.push(`Family annual income (₹${profile.annual_income.toLocaleString("en-IN")}) exceeds ceiling of ₹${criteria.maxAnnualIncome.toLocaleString("en-IN")}.`);
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
  if (criteria.requiresAgriculturalLand && !profile.owns_agricultural_land) {
    failureReasons.push("Applicant must own registered agricultural land holdings.");
  }

  if (criteria.maxLandAcres !== undefined && profile.land_area_acres > criteria.maxLandAcres) {
    failureReasons.push(`Agricultural land area (${profile.land_area_acres} acres) exceeds upper threshold of ${criteria.maxLandAcres} acres.`);
  }

  // 8. Location / State
  if (criteria.allowedStates && criteria.allowedStates.length > 0) {
    if (profile.state && !criteria.allowedStates.includes(profile.state)) {
      failureReasons.push(`Restricted to residents of ${criteria.allowedStates.join(", ")}.`);
    }
  }

  const isEligible = failureReasons.length === 0;

  // Document Readiness & Gap Analysis
  const requiredDocs = scheme.requiredDocuments || [];
  const uploaded = profile.uploaded_documents || [];

  const readyDocuments = requiredDocs.filter((doc) =>
    uploaded.some((u) => u.toLowerCase().includes(doc.name.toLowerCase()) || doc.name.toLowerCase().includes(u.toLowerCase()))
  );

  const missingDocuments = requiredDocs.filter(
    (doc) => !readyDocuments.some((r) => r.id === doc.id)
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
    matchingScore: isEligible ? (readinessScore > 70 ? 95 : 80) : 20,
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