"use client";

import React from "react";
import { SchemeMatchResult } from "@/types/scheme";
import { CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

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
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Accent Line */}
      <div
        className={`h-1.5 w-full ${
          isEligible
            ? isComplete
              ? "bg-emerald-500"
              : "bg-indigo-600"
            : "bg-rose-400"
        }`}
      />

      <div className="p-6">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {category}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
              isEligible
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
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

        {/* Scheme Name & Summary */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
          {schemeName}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {shortSummary}
        </p>

        {/* Benefits Highlight */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/60 rounded-xl p-3 mb-4">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">
            Key Entitlement
          </div>
          <p className="text-xs font-semibold text-amber-950">{benefits}</p>
        </div>

        {/* AI Insight Box */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs mb-5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Reasoning Verdict
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">{explanation}</p>
        </div>

        {/* Document Readiness Progress */}
        <div className="mb-5 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-500" /> Document Readiness
            </span>
            <span
              className={`font-black tracking-tight ${
                isComplete
                  ? "text-emerald-600"
                  : documentMatchPercentage >= 50
                  ? "text-indigo-600"
                  : "text-amber-600"
              }`}
            >
              {documentMatchPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                isComplete
                  ? "bg-emerald-500"
                  : documentMatchPercentage >= 50
                  ? "bg-indigo-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${documentMatchPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklists */}
        <div className="space-y-3">
          {submittedDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                ✓ Ready In Vault ({submittedDocs.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {submittedDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="inline-flex items-center gap-1 text-[11px] bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium"
                  >
                    ✓ {doc.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingDocs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                ⚠ Deficit Checklist ({missingDocs.length})
              </div>
              <div className="space-y-1.5">
                {missingDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-amber-50/50 border border-amber-200/70 p-2.5 rounded-lg text-xs"
                  >
                    <div className="font-semibold text-slate-900">• {doc.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-start gap-1">
                      <span className="font-semibold text-amber-900">How to get:</span>
                      <span>{doc.resolution_guide}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Official Govt Gateway
        </span>
        <button
          disabled={!isEligible}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm ${
            isEligible
              ? "bg-slate-900 hover:bg-indigo-600 text-white cursor-pointer active:scale-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>{isEligible ? "Proceed to Apply" : "Ineligible"}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}