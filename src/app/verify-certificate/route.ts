import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Koi file upload nahi hui" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

    const prompt = `
      You are an expert Indian Government Document Verification auditor.
      Extract information from this identity proof (Aadhaar / PAN / Voter ID).
      Return ONLY a pure JSON object:
      {
        "documentType": "Aadhaar" | "PAN" | "Other",
        "documentName": "Aadhaar Card" | "PAN Card" | "Other Document",
        "extractedDetails": {
          "name": string or null,
          "dob": "YYYY-MM-DD" or null,
          "age": number or null,
          "gender": "Male" | "Female" | "Other" or null,
          "caste_category": "General" | "OBC" | "SC" | "ST" | "EWS" or null,
          "annual_income": number or null
        }
      }
    `;

    // Yahan "-latest" lagana zaroori hai v1beta 404 error rokne ke liye
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type || "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const parsed = JSON.parse(result.response.text() || "{}");

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("AI upload scan error:", error);
    return NextResponse.json(
      { error: error?.message || "Document analyze nahi ho saka" },
      { status: 500 }
    );
  }
}