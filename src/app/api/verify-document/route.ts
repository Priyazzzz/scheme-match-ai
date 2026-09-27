import { NextRequest, NextResponse } from "next/server";

const REQUIRED_KEYWORDS: Record<string, string[]> = {
  Aadhaar_Card: ["aadhaar", "aadhar", "uidai", "identity", "uid"],
  Income_Certificate: ["income", "aay", "praman", "revenue", "tahsildar", "tehsildar"],
  Caste_Certificate: ["caste", "jati", "category", "obc", "sc", "st", "ews"],
  Domicile_Certificate: ["domicile", "niwas", "residence", "address", "ration", "bpl"],
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;

    if (!file || !documentType) {
      return NextResponse.json(
        { isValid: false, reason: "Koi file ya document type nahi mila." },
        { status: 400 }
      );
    }

    // 1. Minimum file size (Kam se kam 10KB)
    if (file.size < 10 * 1024) {
      return NextResponse.json({
        isValid: false,
        reason: "File size bohot chhota ya corrupt hai. Sahi document scan upload karein.",
      });
    }

    const fileNameClean = file.name.toLowerCase();
    const keywords = REQUIRED_KEYWORDS[documentType] || [];

    // 2. Strict Check: Filename mein us document ka related keyword hona chahiye
    const hasMatchingName = keywords.some((kw) => fileNameClean.includes(kw));

    if (!hasMatchingName) {
      const docLabel = documentType.replace("_", " ");
      return NextResponse.json({
        isValid: false,
        reason: `Upload ki gayi file "${file.name}" valid ${docLabel} nahi lag rahi hai. Kripya sahi ${docLabel} upload karein (file name mein '${keywords[0]}' hona chahiye).`,
      });
    }

    return NextResponse.json({
      isValid: true,
      documentType,
      fileName: file.name,
      message: "Document successfully verified.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { isValid: false, reason: "Verification fail ho gaya. Kripya dubara koshish karein." },
      { status: 500 }
    );
  }
}