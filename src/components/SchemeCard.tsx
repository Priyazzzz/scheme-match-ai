"use client";

import React from "react";
import { SchemeMatchResult } from "@/types/scheme";

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
    ineligibilityReasons,
    documentMatchPercentage,
    submittedDocs,
    missingDocs,
    explanation,
  } = result;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {category}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isEligible
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {isEligible ? "✓ Eligible" : "✗ Not Eligible"}
          </span>
        </div>

        {/* Title & Benefits */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{schemeName}</h3>
        <p className="text-sm text-gray-600 mb-3">{shortSummary}</p>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-2.5 mb-4 rounded-r">
          <p className="text-xs text-amber-900 font-medium">
            <span className="font-bold">Key Benefit:</span> {benefits}
          </p>
        </div>

        {/* AI Explanation / Reasoning Box */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs mb-4 text-gray-700 border">
          <span className="font-semibold text-gray-900">AI Assessment: </span>
          {explanation}
        </div>

        {/* Document Readiness Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1 text-xs font-medium">
            <span className="text-gray-700">Document Readiness</span>
            <span
              className={`font-bold ${
                documentMatchPercentage === 100
                  ? "text-green-600"
                  : documentMatchPercentage >= 50
                  ? "text-blue-600"
                  : "text-amber-600"
              }`}
            >
              {documentMatchPercentage}% Matched
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                documentMatchPercentage === 100
                  ? "bg-green-500"
                  : documentMatchPercentage >= 50
                  ? "bg-blue-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${documentMatchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Document Checklists */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          {/* Submitted Docs */}
          {submittedDocs.length > 0 && (
            <div>
              <p className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1">
                ✓ Available Documents ({submittedDocs.length})
              </p>
              <ul className="text-xs space-y-1 text-gray-600">
                {submittedDocs.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-1.5">
                    <span className="text-green-500 font-bold">✓</span> {doc.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Docs */}
          {missingDocs.length > 0 && (
            <div>
              <p className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                ⚠ Missing Documents ({missingDocs.length})
              </p>
              <ul className="text-xs space-y-2">
                {missingDocs.map((doc) => (
                  <li
                    key={doc.id}
                    className="bg-amber-50/70 p-2 rounded border border-amber-200 text-gray-700"
                  >
                    <div className="font-semibold text-amber-900">• {doc.name}</div>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      <span className="font-medium text-gray-700">How to get:</span>{" "}
                      {doc.resolution_guide}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
        <button
          disabled={!isEligible}
          className={`text-xs px-4 py-2 font-medium rounded-lg transition ${
            isEligible
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isEligible ? "Proceed to Apply →" : "Ineligible"}
        </button>
      </div>
    </div>
  );
}