"use client";

import React from "react";
import { SchemeMatchResult } from "@/types/scheme";
import { CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

interface SchemeCardProps {
  result: SchemeMatchResult;
}

export default function SchemeCard({ result }: SchemeCardProps) {
  const {
    schemeName,
    category,
    shortSummary,
    benefits,
    isEligible,
    documentMatchPercentage,
    submittedDocs,
    missingDocs,
    explanation,
  } = result;

  const isComplete = documentMatchPercentage === 100;

  return (
    <div className="group relative bg-[#0E1338]/90 rounded-3xl border border-white/10 hover:border-pink-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 text-pink-300 border border-white/10">
            {category}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${
              isEligible
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-300 border-rose-500/30"
            }`}
          >
            {isEligible ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" /> Ineligible
              </>
            )}
          </span>
        </div>

        {/* Scheme Name & Description */}
        <h3 className="text-base font-black text-white group-hover:text-pink-300 transition-colors line-clamp-1 mb-1.5">
          {schemeName}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {shortSummary}
        </p>

        {/* Key Entitlement Highlight */}
        <div className="rounded-2xl p-3 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 border border-white/10 mb-4">
          <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider mb-0.5">
            Key Entitlement
          </div>
          <p className="text-xs font-semibold text-white">{benefits}</p>
        </div>

        {/* AI Insight */}
        <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-xs mb-4">
          <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> AI Rationale
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{explanation}</p>
        </div>

        {/* Document Readiness Progress Bar */}
        <div className="mb-4 bg-white/[0.03] p-3 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" /> Readiness Score
            </span>
            <span className="font-black text-pink-300 font-mono">
              {documentMatchPercentage}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete
                  ? "bg-emerald-400"
                  : documentMatchPercentage >= 50
                  ? "bg-gradient-to-r from-pink-500 to-indigo-500"
                  : "bg-amber-400"
              }`}
              style={{ width: `${documentMatchPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklists */}
        <div className="space-y-3 text-xs">
          {submittedDocs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                ✓ Ready in Vault ({submittedDocs.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {submittedDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-medium"
                  >
                    ✓ {doc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingDocs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                ⚠ Deficit Documents ({missingDocs.length})
              </span>
              <div className="space-y-1.5">
                {missingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs"
                  >
                    <div className="font-semibold text-white">• {doc.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Source: {doc.resolution_guide}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">Govt Gateway</span>
        {isEligible ? (
          <a
            href={
              schemeName.toLowerCase().includes("scholarship")
                ? "https://scholarships.gov.in"
                : schemeName.toLowerCase().includes("kisan")
                ? "https://pmkisan.gov.in"
                : schemeName.toLowerCase().includes("mudra")
                ? "https://www.mudra.org.in"
                : schemeName.toLowerCase().includes("ayushman") || schemeName.toLowerCase().includes("health")
                ? "https://beneficiary.nha.gov.in"
                : "https://www.myscheme.gov.in"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 to-indigo-500 hover:opacity-95 text-white shadow-md shadow-pink-500/20 active:scale-95 transition"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-white/10 text-slate-500 cursor-not-allowed"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
      