"use client";

import React, { useState } from "react";

interface DocumentUploadProps {
  onDocumentVerified: (docId: string, extractedDetails?: any) => void;
  uploadedDocs: string[];
}

export default function DocumentUpload({
  onDocumentVerified,
  uploadedDocs,
}: DocumentUploadProps) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMsg("Analyzing document using Gemini AI...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze-doc", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze");
      }

      if (json.data && json.data.documentType !== "unknown") {
        setStatusMsg(`✓ Identified as ${json.data.documentName}`);
        onDocumentVerified(json.data.documentType, json.data.extractedDetails);
      } else {
        setStatusMsg("Could not clearly classify document. Please select manually.");
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg("AI analysis failed. Please check file format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-1">
        AI Document Scanner & Pre-Flight Check
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Upload Aadhaar, Caste Certificate, Marksheet, or Land records. Gemini AI will auto-detect the document and auto-fill your eligibility.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 bg-indigo-50 border-2 border-dashed border-indigo-300 hover:border-indigo-500 text-indigo-700 px-5 py-3 rounded-lg text-sm font-medium transition">
          <span>{loading ? "Scanning with AI..." : "Upload Document (Image/PDF)"}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>

        {statusMsg && (
          <span className="text-xs font-semibold text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-md border border-indigo-200">
            {statusMsg}
          </span>
        )}
      </div>

      {uploadedDocs.length > 0 && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs font-bold text-gray-700 mb-2">Verified Documents in Vault:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedDocs.map((id) => (
              <span
                key={id}
                className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium"
              >
                ✓ {id.replace("doc_", "").replace("_", " ").toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}