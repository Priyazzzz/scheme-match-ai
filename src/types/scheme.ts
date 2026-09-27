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
  name: string;
  aadhaar_number?: string;
  pan_number?: string;
  is_identity_verified?: boolean;
  dob?: string;
  age: number | null;
  gender: string;
  marital_status: string;
  caste_category: string;
  annual_income: number | null;
  family_member_count: number;
  bpl_card_holder: boolean;
  education_level: string;
  is_student: boolean;
  occupation: string;
  owns_agricultural_land: boolean;
  land_area_acres: number;
  house_type: string;
  state: string;
  pincode: string;
  existing_benefits: string[];
  uploaded_documents: string[];
}

export interface SchemeDocument {
  id: string;
  name: string;
  mandatory: boolean;
  issuingAuthority?: string;
  resolutionGuide?: string;
}

export interface EligibilityCriteria {
  minAge?: number;
  maxAge?: number;
  allowedGenders?: string[];
  allowedCategories?: string[];
  maxAnnualIncome?: number;
  requiresBplCard?: boolean;
  requiresStudent?: boolean;
  requiresAgriculturalLand?: boolean;
  maxLandAcres?: number;
  allowedStates?: string[];
  requiredOccupations?: string[];
}

export interface Scheme {
  id: string;
  name: string;
  category: SchemeCategory;
  shortSummary: string;
  description?: string;
  officialPortalUrl: string;
  criteria: EligibilityCriteria;
  requiredDocuments: SchemeDocument[];
}

export interface EvaluationResult {
  schemeId: string;
  schemeName: string;
  category: SchemeCategory;
  shortSummary: string;
  officialPortalUrl: string;
  isEligible: boolean;
  matchingScore: number;
  rationale: string;
  readinessScore: number;
  readyDocuments: SchemeDocument[];
  missingDocuments: SchemeDocument[];
}