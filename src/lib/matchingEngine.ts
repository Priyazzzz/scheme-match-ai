import { Scheme, UserProfile, SchemeMatchResult, SchemeDocument } from "../types/scheme";
import { SCHEMES_DATABASE } from "../data/schemesDatabase";

/**
 * Evaluates a single scheme against a user profile
 */
export function evaluateSchemeForUser(user: UserProfile, scheme: Scheme): SchemeMatchResult {
  const rules = scheme.eligibility_rules;
  const ineligibilityReasons: string[] = [];

  // 1. Age Verification
  if (user.age !== null && user.age !== undefined) {
    if (user.age < rules.min_age || user.age > rules.max_age) {
      ineligibilityReasons.push(
        `Age requirement not met (Eligible: ${rules.min_age}–${rules.max_age} years, Provided: ${user.age}).`
      );
    }
  }

  // 2. Annual Income Ceiling
  if (rules.max_annual_income !== null && user.annual_income !== null) {
    if (user.annual_income > rules.max_annual_income) {
      const difference = user.annual_income - rules.max_annual_income;
      ineligibilityReasons.push(
        `Annual income exceeds the ₹${rules.max_annual_income.toLocaleString("en-IN")} ceiling by ₹${difference.toLocaleString("en-IN")}.`
      );
    }
  }

  // 3. Gender Verification
  if (user.gender && !rules.gender.includes("All")) {
    if (!rules.gender.includes(user.gender)) {
      ineligibilityReasons.push(
        `Scheme is restricted to: ${rules.gender.join(", ")} applicants.`
      );
    }
  }

  // 4. Caste Category
  if (user.caste_category && !rules.caste_category.includes("All")) {
    if (!rules.caste_category.includes(user.caste_category)) {
      ineligibilityReasons.push(
        `Scheme is designated for ${rules.caste_category.join(", ")} categories.`
      );
    }
  }

  // 5. Occupation Verification
  if (user.occupation && !rules.occupations.includes("All")) {
    if (!rules.occupations.includes(user.occupation)) {
      ineligibilityReasons.push(
        `Applicable for occupations: ${rules.occupations.join(", ")}.`
      );
    }
  }

  // 6. Student Status
  if (rules.is_student !== undefined) {
    if (user.is_student !== rules.is_student) {
      ineligibilityReasons.push(
        rules.is_student ? "Requires active enrollment as a student." : "Not applicable to enrolled students."
      );
    }
  }

  // 7. Landholding Requirement
  if (rules.requires_landholding && !user.owns_agricultural_land) {
    ineligibilityReasons.push("Requires cultivable agricultural land title.");
  }

  // Determine Eligibility Verdict
  const isEligible = ineligibilityReasons.length === 0;

  // --- Document Verification & Readiness Calculation ---
  const userDocsSet = new Set(user.uploaded_documents || []);
  const submittedDocs: SchemeDocument[] = [];
  const missingDocs: SchemeDocument[] = [];

  scheme.required_documents.forEach((doc) => {
    if (userDocsSet.has(doc.id)) {
      submittedDocs.push(doc);
    } else {
      missingDocs.push(doc);
    }
  });

  const totalRequired = scheme.required_documents.length;
  const matchPercentage =
    totalRequired > 0 ? Math.round((submittedDocs.length / totalRequired) * 100) : 100;

  // Generate plain-language explainability rationale
  let explanation = "";
  if (isEligible) {
    if (matchPercentage === 100) {
      explanation = `Fully eligible and all ${totalRequired} mandatory documents are verified. You are ready to submit.`;
    } else {
      explanation = `Demographically eligible! However, you need ${missingDocs.length} more document(s) to reach 100% readiness.`;
    }
  } else {
    explanation = `Currently ineligible: ${ineligibilityReasons.join(" ")}`;
  }

  return {
    schemeId: scheme.scheme_id,
    schemeName: scheme.scheme_name,
    category: scheme.category,
    shortSummary: scheme.short_summary,
    benefits: scheme.benefits,
    isEligible,
    ineligibilityReasons,
    documentMatchPercentage: matchPercentage,
    submittedDocs,
    missingDocs,
    explanation,
  };
}

/**
 * Runs evaluation across all available schemes in the database
 */
export function runSchemeMatching(
  user: UserProfile,
  customSchemes: Scheme[] = SCHEMES_DATABASE
): SchemeMatchResult[] {
  const results = customSchemes.map((scheme) => evaluateSchemeForUser(user, scheme));

  // Sort: Eligible first, then descending by document match %
  return results.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return b.documentMatchPercentage - a.documentMatchPercentage;
  });
}