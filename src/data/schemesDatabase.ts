import { Scheme } from "@/types/scheme";

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-Kisan Samman Nidhi",
    category: "Agriculture, Rural & Environment",
    shortSummary: "Direct financial benefit of ₹6,000 per year in 3 equal installments for farmer families.",
    officialPortalUrl: "https://pmkisan.gov.in",
    criteria: {
      requiresAgriculturalLand: true,
      maxLandAcres: 5,
    },
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", mandatory: true, issuingAuthority: "UIDAI" },
      { id: "land_record", name: "Land Record / Khatauni", mandatory: true, issuingAuthority: "State Revenue Dept" },
      { id: "bank_passbook", name: "Bank Passbook", mandatory: true, issuingAuthority: "Registered Bank" },
    ],
  },
  {
    id: "post-matric-scholarship",
    name: "Post-Matric Scholarship for Students",
    category: "Education & Learning",
    shortSummary: "Financial assistance for students from disadvantaged categories studying at post-matriculation stage.",
    officialPortalUrl: "https://scholarships.gov.in",
    criteria: {
      requiresStudent: true,
      maxAnnualIncome: 250000,
    },
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", mandatory: true, issuingAuthority: "UIDAI" },
      { id: "income_cert", name: "Income Certificate", mandatory: true, issuingAuthority: "Tehsildar / District Administration" },
      { id: "caste_cert", name: "Caste Certificate", mandatory: true, issuingAuthority: "Revenue Dept" },
      { id: "fees_receipt", name: "Institute Fee Receipt", mandatory: true, issuingAuthority: "College / University" },
    ],
  },
  {
    id: "pmjay-ayushman",
    name: "Ayushman Bharat PM-JAY",
    category: "Health & Wellness",
    shortSummary: "Health cover of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    officialPortalUrl: "https://pmjay.gov.in",
    criteria: {
      requiresBplCard: true,
    },
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", mandatory: true, issuingAuthority: "UIDAI" },
      { id: "ration_card", name: "Ration Card (BPL)", mandatory: true, issuingAuthority: "Food & Civil Supplies" },
    ],
  },
  {
    id: "pm-mudra",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    category: "Business & Entrepreneurship",
    shortSummary: "Loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises without collateral.",
    officialPortalUrl: "https://www.mudra.org.in",
    criteria: {
      minAge: 18,
    },
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", mandatory: true, issuingAuthority: "UIDAI" },
      { id: "pan", name: "PAN Card", mandatory: true, issuingAuthority: "Income Tax Dept" },
      { id: "bank_passbook", name: "Bank Statement", mandatory: true, issuingAuthority: "Bank" },
    ],
  },
  {
    id: "pm-awas-gramin",
    name: "Pradhan Mantri Awaas Yojana (Gramin)",
    category: "Housing & Shelter",
    shortSummary: "Financial assistance to rural BPL families for the construction of pucca houses.",
    officialPortalUrl: "https://pmayg.nic.in",
    criteria: {
      requiresBplCard: true,
      maxAnnualIncome: 120000,
    },
    requiredDocuments: [
      { id: "aadhaar", name: "Aadhaar Card", mandatory: true, issuingAuthority: "UIDAI" },
      { id: "ration_card", name: "BPL Ration Card", mandatory: true, issuingAuthority: "Panchayat / Food Supplies" },
      { id: "bank_passbook", name: "Bank Passbook", mandatory: true, issuingAuthority: "Bank" },
    ],
  },
];