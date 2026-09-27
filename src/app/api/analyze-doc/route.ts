import { NextRequest, NextResponse } from "next/server";
import { analyzeUploadedDocument } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const extracted = await analyzeUploadedDocument(base64Image, mimeType);

    return NextResponse.json({ success: true, data: extracted });
  } catch (error: any) {
    console.error("Document analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze document" },
      { status: 500 }
    );
  }
}