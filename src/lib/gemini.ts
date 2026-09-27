import { GoogleGenerativeAI } from "@google/generative-ai";

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
  mimeType: string,
  fileName?: string
): Promise<ExtractedDocumentData> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env.local file.");
  }

  // Google API recommended active model
  const candidateModels = ["gemini-3.8-flash", "gemini-2.5-flash"];

  const prompt = `
You are a precision OCR engine for Indian Identity Documents.
Read the actual text printed on this document image.

Extract:
1. "name": The exact citizen full name printed on the card.
2. "dob": Date of birth in YYYY-MM-DD format (if only year is printed, use YYYY-01-01).
3. "age": Citizen age as a number (2026 - birth year).
4. "gender": "Male", "Female", or "Other".
5. "documentType": "doc_aadhaar" for Aadhaar/UIDAI, "doc_pan" for PAN, "doc_income_cert" for Income, "doc_caste_cert" for Caste.
6. "documentName": Name of the document (e.g. "Aadhaar Card").

Respond ONLY with valid JSON. Do not include markdown backticks or extra text:
{"documentType":"doc_aadhaar","documentName":"Aadhaar Card","extractedDetails":{"name":"PRINTED_NAME","dob":"YYYY-MM-DD","age":20,"gender":"Female","caste_category":null,"annual_income":null},"confidence":0.95}
`;

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: mimeType || "image/jpeg",
          },
        },
      ]);

      let text = result.response.text();
      if (!text) continue;

      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(text);
      if (parsed && parsed.extractedDetails) {
        return parsed as ExtractedDocumentData;
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} attempt error:`, err?.message || err);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "Failed to parse document text with Gemini Vision AI");
}