"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/scheme";
import {
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  User,
  GraduationCap,
  Home,
  IndianRupee,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ConsolidatedRegistrationProps {
  initialProfile: UserProfile;
  onSubmitProfile: (profile: UserProfile) => void;
}

export default function ConsolidatedRegistrationForm({
  initialProfile,
  onSubmitProfile,
}: ConsolidatedRegistrationProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAIScanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanStatus({
      type: "info",
      text: "Gemini Vision AI auditing document & extracting real printed details...",
    });

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

      if (json.data && json.data.extractedDetails) {
        const details = json.data.extractedDetails;

        setProfile((prev) => ({
          ...prev,
          name: details.name || prev.name,
          dob: details.dob || prev.dob,
          age: typeof details.age === "number" ? details.age : prev.age,
          gender: details.gender || prev.gender,
          caste_category: details.caste_category || prev.caste_category,
          annual_income: typeof details.annual_income === "number" ? details.annual_income : prev.annual_income,
          is_identity_verified: true,
          uploaded_documents: prev.uploaded_documents.includes(json.data.documentType)
            ? prev.uploaded_documents
            : [...prev.uploaded_documents, json.data.documentType],
        }));

        setScanStatus({
          type: "success",
          text: `Verified ${json.data.documentName}. Fields auto-filled below.`,
        });
      }
    } catch (err: any) {
      console.error("AI upload scan error:", err);
      setScanStatus({
        type: "error",
        text: `Error: ${err?.message || "AI scanning failed"}. Please enter details manually.`,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitProfile(profile);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 mb-12 text-slate-800">
      {/* Top AI Scan Banner (Light Purple/Pink Gradient) */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-purple-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-pink-100 text-pink-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                AI Auto-Extraction & Verification
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Scan Identity Proof to Pre-Fill Profile
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Upload your document. Gemini Vision extracts your name, DOB, age, and demographic markers directly from the image.
            </p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold px-6 py-3.5 rounded-full shadow-lg shadow-pink-500/20 transition shrink-0 active:scale-95">
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Document...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload Proof (Image/PDF)</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleAIScanUpload}
              disabled={isScanning}
            />
          </label>
        </div>

        {scanStatus && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              scanStatus.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : scanStatus.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            {scanStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span className="font-semibold">{scanStatus.text}</span>
          </div>
        )}
      </div>

      {/* Form Fields in Clean Light Theme */}
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Section 1: Demographics */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <User className="w-4 h-4 text-pink-600" />
            <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Identity & Demographic Attributes
            </h5>
            {profile.is_identity_verified && (
              <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> AI Verified
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Citizen Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                value={profile.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Aadhaar ID (Last 4 Digits)</label>
              <input
                type="text"
                placeholder="e.g. 1234"
                maxLength={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                value={profile.aadhaar_number}
                onChange={(e) => handleFieldChange("aadhaar_number", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">PAN Card Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition uppercase"
                value={profile.pan_number}
                onChange={(e) => handleFieldChange("pan_number", e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                value={profile.dob}
                onChange={(e) => handleFieldChange("dob", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Age</label>
              <input
                type="number"
                placeholder="e.g. 21"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                value={profile.age ?? ""}
                onChange={(e) => handleFieldChange("age", e.target.value ? Number(e.target.value) : null)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Gender</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.gender}
                onChange={(e) => handleFieldChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Marital Status</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.marital_status}
                onChange={(e) => handleFieldChange("marital_status", e.target.value)}
              >
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Social Category</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.caste_category}
                onChange={(e) => handleFieldChange("caste_category", e.target.value)}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Education & Occupation */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Education & Occupation
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Highest Education Level</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.education_level}
                onChange={(e) => handleFieldChange("education_level", e.target.value)}
              >
                <option value="Below 10th">Below 10th Standard</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduate">Graduate (Degree/Diploma)</option>
                <option value="Post-Graduate">Post-Graduate & Above</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Occupation</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.occupation}
                onChange={(e) => handleFieldChange("occupation", e.target.value)}
              >
                <option value="Student">Student</option>
                <option value="Farmer">Farmer / Cultivator</option>
                <option value="Self Employed">Self Employed / Artisan</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Salaried">Salaried Employee</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-pink-600 border-slate-300 focus:ring-pink-500 cursor-pointer"
                  checked={profile.is_student}
                  onChange={(e) => handleFieldChange("is_student", e.target.checked)}
                />
                <span className="font-semibold">Currently an Enrolled Student</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Household Financials */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Household Financials & Existing Subsidies
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.annual_income ?? ""}
                onChange={(e) => handleFieldChange("annual_income", e.target.value ? Number(e.target.value) : null)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Family Members Count</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.family_member_count}
                onChange={(e) => handleFieldChange("family_member_count", Number(e.target.value))}
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-800">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-pink-600 border-slate-300 focus:ring-pink-500 cursor-pointer"
                  checked={profile.bpl_card_holder}
                  onChange={(e) => handleFieldChange("bpl_card_holder", e.target.checked)}
                />
                <span className="font-semibold">BPL / Antyodaya Ration Card Holder</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Property & Location */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <Home className="w-4 h-4 text-sky-600" />
            <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Property, Housing & Location
            </h5>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Housing Type</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.house_type}
                onChange={(e) => handleFieldChange("house_type", e.target.value)}
              >
                <option value="Kutcha">Kutcha (Mud/Thatch)</option>
                <option value="Semi-Pucca">Semi-Pucca</option>
                <option value="Pucca">Pucca (Concrete)</option>
                <option value="Homeless">Homeless / Temporary</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">State of Residence</label>
              <input
                type="text"
                placeholder="e.g. Uttar Pradesh"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.state}
                onChange={(e) => handleFieldChange("state", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pincode</label>
              <input
                type="text"
                placeholder="e.g. 208002"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.pincode}
                onChange={(e) => handleFieldChange("pincode", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Agricultural Land Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-pink-500 transition"
                value={profile.land_area_acres}
                onChange={(e) => {
                  const acres = Number(e.target.value);
                  setProfile((prev) => ({
                    ...prev,
                    land_area_acres: acres,
                    owns_agricultural_land: acres > 0,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Submit karne par sabhi 18 sectors ke rules evaluate honge.
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold px-8 py-3.5 rounded-full shadow-lg shadow-pink-500/25 transition active:scale-95 cursor-pointer"
          >
            <span>Register & Audit My Benefits →</span>
          </button>
        </div>
      </form>
    </div>
  );
}