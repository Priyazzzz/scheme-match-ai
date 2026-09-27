"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileCheck, Loader2 } from "lucide-react";

interface DocumentUploadProps {
  onDocumentVerified: (docId: string, extractedDetails?: any) => void;
  uploadedDocs: string[];
}

export default function DocumentUpload({
  onDocumentVerified,
  uploadedDocs,
}: DocumentUploadProps) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMsg({ type: "info", text: "Scanning document via Gemini Vision AI..." });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/analyze-doc", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Analysis failed");
      }

      if (json.data && json.data.documentType !== "unknown") {
        setStatusMsg({
          type: "success",
          text: `Verified: ${json.data.documentName}`,
        });
        onDocumentVerified(json.data.documentType, json.data.extractedDetails);
      } else {
        setStatusMsg({
          type: "error",
          text: "Unrecognized document format. Try a clearer scan.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        type: "error",
        text: "AI Scan failed. Please check network/key.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0E1338]/90 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <UploadCloud className="w-4 h-4 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Document Vault Scanner
            </h3>
            <p className="text-[11px] text-slate-400">
              Gemini Vision pre-flight inspection
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Upload Aadhaar, Caste Certificate, or Land records. AI extracts parameters and auto-fills verified checklist tokens.
        </p>

        {/* Upload Button Box */}
        <label className="group relative w-full cursor-pointer flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-white/15 hover:border-pink-400/60 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-pink-300">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-semibold">Running Vision AI Audit...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck className="w-5 h-5 text-pink-300" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                Upload Document (Image / PDF)
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, or PDF up to 5MB</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>

        {/* Notification Status */}
        {statusMsg && (
          <div
            className={`mt-4 p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
              statusMsg.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : statusMsg.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-blue-500/10 border-blue-500/30 text-blue-300"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span className="text-[11px] font-medium">{statusMsg.text}</span>
          </div>
        )}
      </div>

      {/* Verified Badges Section */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Verified Vault Tokens ({uploadedDocs.length})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {uploadedDocs.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 px-2.5 py-1 rounded-full font-bold"
            >
              ✓ {id.replace("doc_", "").replace("_", " ").toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}