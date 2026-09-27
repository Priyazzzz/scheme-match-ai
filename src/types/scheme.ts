export type SchemeCategory =
  | "Agriculture, Rural & Environment"
  | "Education & Learning"
  | "Banking, Financial Services & Insurance"
  | "Business & Entrepreneurship"
  | "Women and Child Development"
  | "Health & Wellness"
  | "Housing & Shelter"
  | "Skills, Employment & Livelihood"
  | "Social Welfare & Empowerment"
  | "Persons with Disabilities"
  | "Sports & Culture"
  | "Science, IT & Communications"
  | "Transport & Infrastructure"
  | "Travel & Tourism"
  | "Utility, Sanitation & Clean Energy"
  | "Public Safety, Law & Justice"
  | "Senior Citizens & Pensions"
  | "Youth & Defense Welfare";

export interface EligibilityRules {
  min_age: number;
  max_age: number;
  gender: ("Male" | "Female" | "Other" | "All")[];
  occupations: string[]; // e.g. ["Farmer", "Student", "Self-Employed", "All"]
  max_annual_income: number | null; // null if no ceiling
  caste_category: ("General" | "OBC" | "SC" | "ST" | "EWS" | "All")[];
  requires_landholding?: boolean;
  is_student?: boolean;
}

export interface SchemeDocument {
  id: string; // e.g., "doc_aadhaar"
  name: string;
  mandatory: boolean;
  resolution_guide: string; // Explains where/how to get it if missing
}

export interface Scheme {
  scheme_id: string;
  scheme_name: string;
  category: SchemeCategory;
  short_summary: string;
  benefits: string;
  eligibility_rules: EligibilityRules;
  required_documents: SchemeDocument[];
}

export interface UserProfile {
  name: string;
  age: number | null;
  gender: "Male" | "Female" | "Other" | "";
  annual_income: number | null;
  occupation: string;
  caste_category: "General" | "OBC" | "SC" | "ST" | "EWS" | "";
  is_student: boolean;
  owns_agricultural_land: boolean;
  uploaded_documents: string[]; // List of document IDs the user has
}

export interface SchemeMatchResult {
  schemeId: string;
  schemeName: string;
  category: SchemeCategory;
  shortSummary: string;
  benefits: string;
  isEligible: boolean;
  ineligibilityReasons: string[];
  documentMatchPercentage: number;
  submittedDocs: SchemeDocument[];
  missingDocs: SchemeDocument[];
  explanation: string;
}