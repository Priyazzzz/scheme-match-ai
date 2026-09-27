import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface ExtractedDocumentData {
  documentType:
    | "doc_aadhaar"
    | "doc_pan"
    | "doc_income_cert"
    | "doc_caste_cert"
    | "doc_land_record"
    | "doc_bank_passbook"
    | "doc_fee_receipt"
    | "doc_ration_card"
    | "doc_mcp_card"
    | "unknown";
  documentName: string;
  extractedDetails: {
    name?: string;
    dob?: string;
    age?: number;
    gender?: "Male" | "Female" | "Other";
    caste_category?: "General" | "OBC" | "SC" | "ST" | "EWS";
    annual_income?: number;
  };
  confidence: number;
}

export async function analyzeUploadedDocument(
  base64Image: string,
  mimeType: string
): Promise<ExtractedDocumentData> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          documentType: {
            type: SchemaType.STRING,
            description:
              "One of: doc_aadhaar, doc_pan, doc_income_cert, doc_caste_cert, doc_land_record, doc_bank_passbook, doc_fee_receipt, doc_ration_card, doc_mcp_card, unknown",
          },
          documentName: {
            type: SchemaType.STRING,
            description: "Human readable title, e.g. 'Aadhaar Card'",
          },
          extractedDetails: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              dob: { type: SchemaType.STRING },
              age: { type: SchemaType.NUMBER },
              gender: { type: SchemaType.STRING },
              caste_category: { type: SchemaType.STRING },
              annual_income: { type: SchemaType.NUMBER },
            },
          },
          confidence: {
            type: SchemaType.NUMBER,
            description: "Score from 0.0 to 1.0",
          },
        },
        required: ["documentType", "documentName", "confidence"],
      },
      temperature: 0.1,
    },
  });

  const prompt = `
Analyze this Indian government welfare or identity document.
Determine its exact type:
- doc_aadhaar (Aadhaar Card)
- doc_pan (PAN Card)
- doc_income_cert (Income Certificate)
- doc_caste_cert (Caste/Category Certificate)
- doc_land_record (Land Record, Khatauni, RoR)
- doc_bank_passbook (Bank Passbook)
- doc_fee_receipt (College/School Fee Receipt)
- doc_ration_card (Ration Card)
- doc_mcp_card (Mother Child Protection Card)
- unknown (If none of the above)

Extract verifiable demographic details if present.
`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    },
  ]);

  const text = result.response.text();
  if (!text) {
    throw new Error("No response received from Gemini model.");
  }

  return JSON.parse(text) as ExtractedDocumentData;
}