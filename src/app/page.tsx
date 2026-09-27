"use client";

import React, { useState, useMemo } from "react";
import { UserProfile, SchemeCategory } from "@/types/scheme";
import { runSchemeMatching } from "@/lib/matchingEngine";
import { SCHEMES_DATABASE } from "@/data/schemesDatabase";
import ProfileForm from "@/components/ProfileForm";
import DocumentUpload from "@/components/DocumentUpload";
import SchemeCard from "@/components/SchemeCard";

const ALL_18_CATEGORIES: SchemeCategory[] = [
  "Agriculture, Rural & Environment",
  "Education & Learning",
  "Banking, Financial Services & Insurance",
  "Business & Entrepreneurship",
  "Women and Child Development",
  "Health & Wellness",
  "Housing & Shelter",
  "Skills, Employment & Livelihood",
  "Social Welfare & Empowerment",
  "Persons with Disabilities",
  "Sports & Culture",
  "Science, IT & Communications",
  "Transport & Infrastructure",
  "Travel & Tourism",
  "Utility, Sanitation & Clean Energy",
  "Public Safety, Law & Justice",
  "Senior Citizens & Pensions",
  "Youth & Defense Welfare",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"matched" | "explore">("matched");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Priya Sharma",
    age: 20,
    gender: "Female",
    annual_income: 180000,
    occupation: "Student",
    caste_category: "OBC",
    is_student: true,
    owns_agricultural_land: false,
    uploaded_documents: ["doc_aadhaar"],
  });

  const handleDocumentVerified = (docId: string, extractedDetails?: any) => {
    setUserProfile((prev) => {
      const updatedDocs = prev.uploaded_documents.includes(docId)
        ? prev.uploaded_documents
        : [...prev.uploaded_documents, docId];

      return {
        ...prev,
        uploaded_documents: updatedDocs,
        age: extractedDetails?.age || prev.age,
        gender: extractedDetails?.gender || prev.gender,
        caste_category: extractedDetails?.caste_category || prev.caste_category,
      };
    });
  };

  const schemeResults = useMemo(() => {
    return runSchemeMatching(userProfile, SCHEMES_DATABASE);
  }, [userProfile]);

  const filteredSchemes = useMemo(() => {
    if (selectedCategory === "All") return schemeResults;
    return schemeResults.filter((s) => s.category === selectedCategory);
  }, [schemeResults, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      {/* Navbar Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <div>
              <h1 className="text-lg font-black tracking-tight text-blue-900">
                WelfareAI Copilot
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">
                Public-Benefit Navigation & Application Readiness Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("matched")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === "matched"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recommended Schemes ({schemeResults.filter((s) => s.isEligible).length})
            </button>
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                activeTab === "explore"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Explore 18 Categories
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === "matched" ? (
          <div>
            {/* Top Row: Profile Input and AI Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProfileForm user={userProfile} onChange={setUserProfile} />
              </div>
              <div className="lg:col-span-1">
                <DocumentUpload
                  uploadedDocs={userProfile.uploaded_documents}
                  onDocumentVerified={handleDocumentVerified}
                />
              </div>
            </div>

            {/* Scheme Recommendations Section */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Scheme Eligibility & Readiness Evaluation
                  </h2>
                  <p className="text-xs text-gray-500">
                    Sorted by eligibility status and document completeness percentage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500">Filter Category:</span>
                  <select
                    className="text-xs border rounded-lg px-2.5 py-1.5 bg-white text-gray-800"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {ALL_18_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map((result) => (
                  <SchemeCard key={result.schemeId} result={result} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 18 Categories Explorer Hub */
          <div className="bg-white rounded-xl border p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Explore Government Welfare Categories
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Browse government opportunities across all 18 standard national ministries and departments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_18_CATEGORIES.map((cat, idx) => {
                const count = SCHEMES_DATABASE.filter((s) => s.category === cat).length;
                return (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveTab("matched");
                    }}
                    className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-blue-600 mb-1 block">
                        Category {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition">
                        {cat}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {count} {count === 1 ? "Scheme" : "Schemes"} Indexed
                      </p>
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-500 text-lg font-bold">
                      →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}