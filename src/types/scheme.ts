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

export interface UserProfile {
  // Identity & KYC
  name: string;
  aadhaar_number: string;
  pan_number: string;
  is_identity_verified: boolean;

  // Demographics
  dob: string;
  age: number | null;
  gender: "Male" | "Female" | "Other" | "";
  marital_status: "Single" | "Married" | "Widowed" | "Divorced";
  caste_category: "General" | "OBC" | "SC" | "ST" | "EWS";

  // Socio-Economic & Family
  annual_income: number | null;
  family_member_count: number;
  bpl_card_holder: boolean;

  // Education & Occupation
  education_level: "Below 10th" | "10th Pass" | "12th Pass" | "Graduate" | "Post-Graduate";
  is_student: boolean;
  occupation: "Farmer" | "Student" | "Self Employed" | "Unemployed" | "Salaried";

  // Property & Assets
  owns_agricultural_land: boolean;
  land_area_acres: number;
  house_type: "Kutcha" | "Semi-Pucca" | "Pucca" | "Homeless";

  // Location & Existing Benefits
  state: string;
  pincode: string;
  existing_benefits: string[];
  uploaded_documents: string[];
}

export interface SchemeDocumentRequirement {
  id: string;
  name: string;
  resolution_guide: string;
}

export interface Scheme {
  id: string;
  name: string;
  category: SchemeCategory;
  shortSummary: string;
  benefits: string;
  minAge?: number;
  maxAge?: number;
  gender?: "Male" | "Female" | "All";
  maxIncome?: number;
  casteEligible?: Array<"General" | "OBC" | "SC" | "ST" | "EWS">;
  allowedOccupations?: string[];
  requiresStudent?: boolean;
  requiresLand?: boolean;
  requiredDocuments: SchemeDocumentRequirement[];
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
  submittedDocs: SchemeDocumentRequirement[];
  missingDocs: SchemeDocumentRequirement[];
  explanation: string;
}