"use client";

import React, { useState } from "react";
import {
  User,
  MapPin,
  Briefcase,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  AlertCircle,
} from "lucide-react";

export interface CitizenProfile {
  full_name: string;
  dob: string;
  age: number | "";
  gender: string;
  caste_category: string;
  state: string;
  district: string;
  area_type: string;
  marital_status: string;
  annual_income: number | "";
  employment_type: string;
  is_student: boolean;
  education_level: string;
  is_farmer: boolean;
  land_holding_acres: number | "";
  is_differently_abled: boolean;
  disability_percentage: number | "";
  has_girl_child: boolean;
  bpl_card_holder: boolean;
  aadhaar_linked: boolean;
  aadhaar_number: string;
  pan_number: string;
  uploaded_documents: string[];
}

interface Props {
  initialProfile?: any;
  onSubmit?: (profile: any) => void;
  onSubmitProfile?: (profile: any) => void;
}

export default function ConsolidatedRegistrationForm({
  initialProfile,
  onSubmit,
  onSubmitProfile,
}: Props) {
  const [profile, setProfile] = useState<CitizenProfile>({
    full_name: initialProfile?.full_name || "",
    dob: initialProfile?.dob || "",
    age: initialProfile?.age || "",
    gender: initialProfile?.gender || "Male",
    caste_category: initialProfile?.caste_category || "General",
    state: initialProfile?.state || "Uttar Pradesh",
    district: initialProfile?.district || "",
    area_type: initialProfile?.area_type || "Urban",
    marital_status: initialProfile?.marital_status || "Single",
    annual_income: initialProfile?.annual_income || "",
    employment_type: initialProfile?.employment_type || "Unemployed",
    is_student: initialProfile?.is_student || false,
    education_level: initialProfile?.education_level || "Undergraduate",
    is_farmer: initialProfile?.is_farmer || false,
    land_holding_acres: initialProfile?.land_holding_acres || "",
    is_differently_abled: initialProfile?.is_differently_abled || false,
    disability_percentage: initialProfile?.disability_percentage || "",
    has_girl_child: initialProfile?.has_girl_child || false,
    bpl_card_holder: initialProfile?.bpl_card_holder || false,
    aadhaar_linked: initialProfile?.aadhaar_linked || true,
    aadhaar_number: initialProfile?.aadhaar_number || "",
    pan_number: initialProfile?.pan_number || "",
    uploaded_documents: initialProfile?.uploaded_documents || [],
  });

  const [uploadedFileNames, setUploadedFileNames] = useState<{ [key: string]: string }>({});
  const [verifyingDoc, setVerifyingDoc] = useState<string | null>(null);
  const [docErrors, setDocErrors] = useState<{ [key: string]: string }>({});

  const handleFieldChange = (field: keyof CitizenProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docTag: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVerifyingDoc(docTag);
    setDocErrors((prev) => ({ ...prev, [docTag]: "" }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", docTag);

      const res = await fetch("/api/verify-document", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!result.isValid) {
        setDocErrors((prev) => ({
          ...prev,
          [docTag]: result.reason || "Document reject ho gaya, sahi document upload karein.",
        }));
        setProfile((prev) => ({
          ...prev,
          uploaded_documents: prev.uploaded_documents.filter((d) => !d.includes(docTag)),
        }));
        return;
      }

      // Valid hone par hi save hoga:
      setUploadedFileNames((prev) => ({ ...prev, [docTag]: file.name }));

      if (docTag === "Aadhaar_Card") {
        const updatedDocs = Array.from(
          new Set([
            ...profile.uploaded_documents,
            "Aadhaar_Card",
            "Aadhaar",
            "aadhaar",
            "Aadhaar Card",
          ])
        );
        setProfile((prev) => ({
          ...prev,
          uploaded_documents: updatedDocs,
          aadhaar_linked: true,
        }));
      } else {
        setProfile((prev) => ({
          ...prev,
          uploaded_documents: Array.from(new Set([...prev.uploaded_documents, docTag])),
        }));
      }
    } catch (err) {
      setDocErrors((prev) => ({
        ...prev,
        [docTag]: "Verification server error. Please retry.",
      }));
    } finally {
      setVerifyingDoc(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitCallback = onSubmit || onSubmitProfile;
    if (typeof submitCallback === "function") {
      submitCallback(profile);
    } else {
      console.log("Citizen Profile Data Submitted:", profile);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 pb-20">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-pink-300 mb-3 border border-white/10">
            Citizen Registration & Eligibility Verification
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Citizen Registration Form
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Fill in your profile details and attach supporting documents to determine eligibility for welfare schemes.
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* SECTION 1: PERSONAL & DEMOGRAPHIC IDENTITY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Personal & Identity Details</h3>
              <p className="text-xs text-slate-500">Government ID details ke mutabiq enter karein.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* FULL NAME WITH DISCLAIMER */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block font-bold text-slate-700 mb-1">Full Name (Pura Naam) *</label>
              <input
                type="text"
                required
                placeholder="Ramesh Kumar"
                value={profile.full_name}
                onChange={(e) => handleFieldChange("full_name", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <p className="text-[11px] font-medium text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Write name exactly as printed on your Aadhaar card; otherwise, application may get rejected.</span>
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Date of Birth (DOB) *</label>
              <input
                type="date"
                required
                value={profile.dob}
                onChange={(e) => {
                  handleFieldChange("dob", e.target.value);
                  if (e.target.value) {
                    const birthYear = new Date(e.target.value).getFullYear();
                    const currentYear = new Date().getFullYear();
                    handleFieldChange("age", Math.max(0, currentYear - birthYear));
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Age (Umar)</label>
              <input
                type="number"
                placeholder="Auto or enter"
                value={profile.age}
                onChange={(e) => handleFieldChange("age", e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Gender (Ling) *</label>
              <select
                value={profile.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Social Category (Varg) *</label>
              <select
                value={profile.caste_category}
                onChange={(e) => handleFieldChange("caste_category", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Marital Status</label>
              <select
                value={profile.marital_status}
                onChange={(e) => handleFieldChange("marital_status", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Aadhaar Card Number (12 Digits) *</label>
              <input
                type="text"
                required
                maxLength={14}
                placeholder="XXXX XXXX XXXX"
                value={profile.aadhaar_number}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "").slice(0, 12);
                  const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                  handleFieldChange("aadhaar_number", formatted);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-wider"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PAN Card Number (Optional)</label>
              <input
                type="text"
                maxLength={10}
                placeholder="ABCDE1234F"
                value={profile.pan_number}
                onChange={(e) => handleFieldChange("pan_number", e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium tracking-wider"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: RESIDENCE & LOCATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Residence & Regional Domicile</h3>
              <p className="text-xs text-slate-500">State aur district specific welfare eligibility ke liye.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">State (Rajya) *</label>
              <select
                value={profile.state}
                onChange={(e) => handleFieldChange("state", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">District (Zila) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kanpur Nagar"
                value={profile.district}
                onChange={(e) => handleFieldChange("district", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Area Type *</label>
              <select
                value={profile.area_type}
                onChange={(e) => handleFieldChange("area_type", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Rural">Rural (Gramin)</option>
                <option value="Urban">Urban (Shahari)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL & OCCUPATIONAL PROFILE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Financial & Occupation Profile</h3>
              <p className="text-xs text-slate-500">Income criteria aur employment category.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Annual Family Income (Varshik Aay) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 180000"
                value={profile.annual_income}
                onChange={(e) => handleFieldChange("annual_income", e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Employment Type *</label>
              <select
                value={profile.employment_type}
                onChange={(e) => handleFieldChange("employment_type", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Salaried">Salaried (Private/Govt)</option>
                <option value="Self-Employed">Self-Employed / Business</option>
                <option value="Daily Wage Laborer">Daily Wage Laborer / Shramik</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Education Level</label>
              <select
                value={profile.education_level}
                onChange={(e) => handleFieldChange("education_level", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Below 10th">Below 10th</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, BA, etc.)</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          {/* CHECKBOXES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={profile.bpl_card_holder}
                onChange={(e) => handleFieldChange("bpl_card_holder", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="font-semibold text-slate-700">BPL / Ration Card Holder</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={profile.is_student}
                onChange={(e) => handleFieldChange("is_student", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="font-semibold text-slate-700">Currently Enrolled Student</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={profile.is_farmer}
                onChange={(e) => handleFieldChange("is_farmer", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="font-semibold text-slate-700">Farmer (Kisan)</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={profile.is_differently_abled}
                onChange={(e) => handleFieldChange("is_differently_abled", e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="font-semibold text-slate-700">Differently Abled (Divyang)</span>
            </label>
          </div>
        </div>

        {/* SECTION 4: DOCUMENT ATTACHMENT VAULT (ALL 4 DOCUMENTS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mandatory Welfare Documents (4 Required)</h3>
              <p className="text-xs text-slate-500">
                Scheme matching aur verification ke liye apne saare 4 zaroori documents attach karein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Aadhaar Card */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">1. Identity Proof (Aadhaar Card) *</span>
                  {profile.uploaded_documents.includes("Aadhaar_Card") ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified & Attached
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {uploadedFileNames["Aadhaar_Card"]
                    ? `Selected: ${uploadedFileNames["Aadhaar_Card"]}`
                    : "Aadhaar Card ka front/back scan attach karein."}
                </p>
              </div>

              <div>
                <label className="mt-4 cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/40 text-indigo-600 text-xs font-semibold transition">
                  <UploadCloud className="w-4 h-4" />
                  <span>{profile.uploaded_documents.includes("Aadhaar_Card") ? "Change File" : "Choose Aadhaar File"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentSelect(e, "Aadhaar_Card")}
                  />
                </label>
                {verifyingDoc === "Aadhaar_Card" && (
                  <p className="text-[11px] text-indigo-600 mt-2 font-semibold animate-pulse">Auditing document authenticity...</p>
                )}
                {docErrors["Aadhaar_Card"] && (
                  <p className="text-[11px] text-rose-600 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors["Aadhaar_Card"]}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 2. Income Certificate */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">2. Income Certificate (Aay Praman) *</span>
                  {profile.uploaded_documents.includes("Income_Certificate") ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified & Attached
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {uploadedFileNames["Income_Certificate"]
                    ? `Selected: ${uploadedFileNames["Income_Certificate"]}`
                    : "Tehsil dwara jari aay praman patra attach karein."}
                </p>
              </div>

              <div>
                <label className="mt-4 cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/40 text-indigo-600 text-xs font-semibold transition">
                  <UploadCloud className="w-4 h-4" />
                  <span>{profile.uploaded_documents.includes("Income_Certificate") ? "Change File" : "Choose Income Proof"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentSelect(e, "Income_Certificate")}
                  />
                </label>
                {verifyingDoc === "Income_Certificate" && (
                  <p className="text-[11px] text-indigo-600 mt-2 font-semibold animate-pulse">Auditing document authenticity...</p>
                )}
                {docErrors["Income_Certificate"] && (
                  <p className="text-[11px] text-rose-600 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors["Income_Certificate"]}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 3. Caste / Category Certificate */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">3. Caste Certificate (Jati Praman) *</span>
                  {profile.uploaded_documents.includes("Caste_Certificate") ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified & Attached
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {uploadedFileNames["Caste_Certificate"]
                    ? `Selected: ${uploadedFileNames["Caste_Certificate"]}`
                    : "SC / ST / OBC / EWS jati praman patra upload karein."}
                </p>
              </div>

              <div>
                <label className="mt-4 cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/40 text-indigo-600 text-xs font-semibold transition">
                  <UploadCloud className="w-4 h-4" />
                  <span>{profile.uploaded_documents.includes("Caste_Certificate") ? "Change File" : "Choose Caste Certificate"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentSelect(e, "Caste_Certificate")}
                  />
                </label>
                {verifyingDoc === "Caste_Certificate" && (
                  <p className="text-[11px] text-indigo-600 mt-2 font-semibold animate-pulse">Auditing document authenticity...</p>
                )}
                {docErrors["Caste_Certificate"] && (
                  <p className="text-[11px] text-rose-600 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors["Caste_Certificate"]}</span>
                  </p>
                )}
              </div>
            </div>

            {/* 4. Domicile / Residence Proof */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">4. Domicile / Residence Proof (Niwas) *</span>
                  {profile.uploaded_documents.includes("Domicile_Certificate") ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified & Attached
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {uploadedFileNames["Domicile_Certificate"]
                    ? `Selected: ${uploadedFileNames["Domicile_Certificate"]}`
                    : "Niwas Praman Patra / Ration Card attach karein."}
                </p>
              </div>

              <div>
                <label className="mt-4 cursor-pointer flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 hover:border-indigo-500 bg-white hover:bg-indigo-50/40 text-indigo-600 text-xs font-semibold transition">
                  <UploadCloud className="w-4 h-4" />
                  <span>{profile.uploaded_documents.includes("Domicile_Certificate") ? "Change File" : "Choose Domicile Proof"}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentSelect(e, "Domicile_Certificate")}
                  />
                </label>
                {verifyingDoc === "Domicile_Certificate" && (
                  <p className="text-[11px] text-indigo-600 mt-2 font-semibold animate-pulse">Auditing document authenticity...</p>
                )}
                {docErrors["Domicile_Certificate"] && (
                  <p className="text-[11px] text-rose-600 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{docErrors["Domicile_Certificate"]}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
 </div>
  );
}