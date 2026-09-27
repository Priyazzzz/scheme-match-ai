"use client";

import React, { useState } from "react";
import { EvaluationResult } from "@/types/scheme";
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  FileQuestion,
  Sparkles,
} from "lucide-react";

interface SchemeCardProps {
  result: EvaluationResult;
}

export default function SchemeCard({ result }: SchemeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between ${
        result.isEligible
          ? "bg-white border-slate-200 shadow-md hover:shadow-lg"
          : "bg-slate-50 border-slate-200/60 opacity-80"
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {result.category}
          </span>

          {result.isEligible ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Eligible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Not Eligible
            </span>
          )}
        </div>

        {/* Scheme Title & Summary */}
        <h4 className="text-base font-black text-slate-900 tracking-tight mb-2">
          {result.schemeName}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {result.shortSummary}
        </p>

        {/* Readiness Meter */}
        {result.isEligible && (
          <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-center text-xs font-bold mb-1.5">
              <span className="text-slate-600">Document Readiness</span>
              <span
                className={
                  result.readinessScore >= 80
                    ? "text-emerald-600"
                    : result.readinessScore >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
                }
              >
                {result.readinessScore}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  result.readinessScore >= 80
                    ? "bg-emerald-500"
                    : result.readinessScore >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${result.readinessScore}%` }}
              />
            </div>
          </div>
        )}

        {/* AI Rationale */}
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 mb-4 text-xs text-purple-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-purple-900 block mb-0.5">AI Audit Rationale:</span>
            <p className="text-[11px] text-purple-900/90 leading-normal">{result.rationale}</p>
          </div>
        </div>

        {/* Expandable Document Gap Analysis */}
        {result.isEligible && (
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 transition"
            >
              {isExpanded ? (
                <>
                  <span>Hide Document Audit</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>View Required Documents ({result.readyDocuments.length}/{result.readyDocuments.length + result.missingDocuments.length})</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-2 text-xs pt-2 border-t border-slate-100">
                {result.readyDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-100 text-[11px]"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium">{doc.name} (Ready in Vault)</span>
                  </div>
                ))}

                {result.missingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-100 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <FileQuestion className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="font-bold">{doc.name} (Missing)</span>
                    </div>
                    {doc.issuingAuthority && (
                      <p className="text-[10px] text-rose-700 mt-1 pl-5">
                        Issuing Authority: {doc.issuingAuthority}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Gateway */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <a
          href={result.officialPortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-pink-600 transition"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {result.isEligible && (
          <a
            href={result.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full shadow-sm shadow-pink-500/20 transition active:scale-95"
          >
            <span>Apply Now</span>
          </a>
        )}
      </div>
    </div>
  );
}