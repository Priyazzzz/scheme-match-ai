"use client";

import React, { useState, useMemo } from "react";
import { UserProfile, SchemeCategory } from "@/types/scheme";
import { runSchemeMatching } from "@/lib/matchingEngine";
import { SCHEMES_DATABASE } from "@/data/schemesDatabase";
import ConsolidatedRegistrationForm from "@/components/ConsolidatedRegistrationForm";
import SchemeCard from "@/components/SchemeCard";
import {
  ShieldCheck,
  Search,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  FileText,
  SlidersHorizontal,
  Building2,
  LogOut,
  Cpu,
  Award,
  Wallet,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Layers,
  Star,
  Users,
  CheckCircle,
} from "lucide-react";

const ALL_18_CATEGORIES: { name: SchemeCategory; desc: string }[] = [
  { name: "Agriculture, Rural & Environment", desc: "Kisan subsidies, crop insurance & direct farm aid" },
  { name: "Education & Learning", desc: "Higher study grants, tuition waivers & scholarships" },
  { name: "Banking, Financial Services & Insurance", desc: "Social security pensions, micro-deposits & life cover" },
  { name: "Business & Entrepreneurship", desc: "Collateral-free Mudra credit & startup subsidies" },
  { name: "Women and Child Development", desc: "Maternity incentives, nutritional support & safety" },
  { name: "Health & Wellness", desc: "Cashless secondary & tertiary hospital covers" },
  { name: "Housing & Shelter", desc: "Affordable pucca housing assistance & interest subsidies" },
  { name: "Skills, Employment & Livelihood", desc: "Vocational skill training & apprenticeship stipends" },
  { name: "Social Welfare & Empowerment", desc: "Affirmative action, senior pensions & safety nets" },
  { name: "Persons with Disabilities", desc: "Assistive devices, accessibility grants & equal rights" },
  { name: "Sports & Culture", desc: "Talent development grants, athlete stipends & heritage" },
  { name: "Science, IT & Communications", desc: "R&D fellowships, digital innovation & tech incubators" },
  { name: "Transport & Infrastructure", desc: "Subsidized transport passes & logistic concessions" },
  { name: "Travel & Tourism", desc: "Eco-tourism support & cultural pilgrimage passes" },
  { name: "Utility, Sanitation & Clean Energy", desc: "Clean cooking gas, solar rooftop subsidies & water" },
  { name: "Public Safety, Law & Justice", desc: "Free legal aid assistance & victim rehabilitation" },
  { name: "Senior Citizens & Pensions", desc: "Guaranteed monthly pensions & healthcare concessions" },
  { name: "Youth & Defense Welfare", desc: "Agniveer rehabilitation, defense family pensions" },
];

const EMPTY_CITIZEN_PROFILE: UserProfile = {
  name: "",
  aadhaar_number: "",
  pan_number: "",
  is_identity_verified: false,
  dob: "",
  age: null,
  gender: "",
  marital_status: "Single",
  caste_category: "General",
  annual_income: null,
  family_member_count: 1,
  bpl_card_holder: false,
  education_level: "10th Pass",
  is_student: false,
  occupation: "Unemployed",
  owns_agricultural_land: false,
  land_area_acres: 0,
  house_type: "Pucca",
  state: "",
  pincode: "",
  existing_benefits: [],
  uploaded_documents: [],
};

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "workspace">("landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [workspaceSearch, setWorkspaceSearch] = useState("");

  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_CITIZEN_PROFILE);

  const schemeResults = useMemo(() => {
    if (!isSubmitted && !userProfile.name && userProfile.uploaded_documents.length === 0) {
      return [];
    }
    return runSchemeMatching(userProfile, SCHEMES_DATABASE);
  }, [userProfile, isSubmitted]);

  const filteredSchemes = useMemo(() => {
    return schemeResults.filter((s) => {
      const matchesCategory =
        selectedCategory === "All" || s.category === selectedCategory;
      const matchesSearch =
        s.schemeName.toLowerCase().includes(workspaceSearch.toLowerCase()) ||
        s.shortSummary.toLowerCase().includes(workspaceSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [schemeResults, selectedCategory, workspaceSearch]);

  const eligibleCount = schemeResults.filter((s) => s.isEligible).length;

  // Schemes to display: filtered by category/search if available, otherwise all evaluated results
  const displayedSchemes = filteredSchemes.length > 0 ? filteredSchemes : schemeResults;

  const filteredCategories = useMemo(() => {
    return ALL_18_CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.desc.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categorySearch]);

const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    setCurrentView("workspace");

    if (authMode === "login") {
      // Existing citizen logs in:
      // If no name is set yet, populate a default returning citizen state
      if (!userProfile.name) {
        setUserProfile((prev) => ({
          ...prev,
          name: prev.name || "Verified Citizen",
        }));
      }
      setIsSubmitted(true);
      setSelectedCategory("All");
    } else {
      // New citizen registering:
      // Keep form clean and unsubmitted so they can enter their complete profile
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B24] text-white selection:bg-pink-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[550px] h-[550px] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#070B24]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Sevasetu
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI Welfare Navigation & Document Audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentView === "landing" ? (
              <>
                <a
                  href="#categories"
                  className="hidden md:inline-flex text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Explore 18 Sectors
                </a>

                {isLoggedIn ? (
                  <button
                    onClick={() => setCurrentView("workspace")}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-pink-500/25 hover:opacity-95 transition"
                  >
                    <span>Citizen Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setIsAuthModalOpen(true);
                      }}
                      className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setIsAuthModalOpen(true);
                      }}
                      className="text-xs font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 hover:opacity-95 text-white px-5 py-2.5 rounded-full shadow-md shadow-pink-500/20 transition active:scale-95"
                    >
                      Get Started Now
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("landing")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-white/5 border border-white/10 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Directory</span>
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsSubmitted(false);
                    setUserProfile(EMPTY_CITIZEN_PROFILE);
                    setCurrentView("landing");
                  }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* VIEW 1: LANDING PAGE */}
      {currentView === "landing" && (
        <main>
          {/* Hero Banner */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 pt-8">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
              <img
                src="/welfare-banner.png"
                alt="Diverse Indian Citizens Welfare Empowerment"
                className="w-full h-auto object-contain block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B24] via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-10">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-pink-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  Universal Inclusion
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white mt-1 drop-shadow-md">
                  Empowering Every Citizen Across Every Demography
                </h3>
              </div>
            </div>
          </section>

          {/* Hero Info */}
          <section className="relative pt-4 pb-24 lg:pt-8 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-pink-300">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  All-in-one welfare discovery for every citizen
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
                  Digital Welfare <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-indigo-300">
                    for Smart Citizens
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  Upload your documents or fill your citizen details to discover guaranteed benefits, audit readiness, and eliminate missing paperwork.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        setCurrentView("workspace");
                      } else {
                        setAuthMode("register");
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-sky-400 hover:opacity-95 text-white px-8 py-3.5 rounded-full shadow-lg shadow-pink-500/25 transition active:scale-95 cursor-pointer"
                  >
                    <span>Get Started Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#categories"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-full border border-white/15 transition"
                  >
                    Explore 18 Sectors
                  </a>
                </div>
              </div>

              {/* Right Side Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-[50px] blur-2xl opacity-40 -z-10" />
                  <div className="relative bg-[#0E1338] border-[6px] border-slate-700/80 rounded-[46px] p-5 shadow-2xl">
                    <div className="w-28 h-5 bg-black rounded-full mx-auto mb-4" />
                    <div className="space-y-3.5 text-left">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div>
                          <div className="text-[10px] text-slate-400">Citizen Status</div>
                          <div className="text-xs font-bold text-white">Live AI Verification</div>
                        </div>
                        <span className="text-[10px] bg-pink-500/20 text-pink-300 font-bold px-2 py-0.5 rounded-full">
                          Ready to Audit
                        </span>
                      </div>
                      <div className="rounded-2xl p-4 bg-gradient-to-br from-rose-400 via-pink-500 to-indigo-600 text-white shadow-lg">
                        <div className="text-xs font-semibold text-white/80">Single Registration</div>
                        <div className="text-xl font-black mt-1">18 Sectors</div>
                        <div className="text-[11px] text-white/80 mt-1">One-Click Multi-Scheme Audit</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 18 Categories Section */}
          <section id="categories" className="py-20 bg-[#0B1033] border-y border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400">
                  Core Taxonomy
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2 mb-3">
                  Remembered Your Need
                </h2>
                <p className="text-sm text-slate-300">
                  Select any category to inspect schemes or proceed to citizen registration.
                </p>

                <div className="relative max-w-md mx-auto mt-6">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search any sector..."
                    className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/15 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-400"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCategories.map((cat) => {
                  const count = SCHEMES_DATABASE.filter((s) => s.category === cat.name).length;
                  return (
                    <div
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        if (isLoggedIn) {
                          setCurrentView("workspace");
                        } else {
                          setIsAuthModalOpen(true);
                        }
                      }}
                      className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-400/50 transition cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-base font-bold text-white mb-2">{cat.name}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-6">{cat.desc}</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-pink-300">
                        <span>{count} Schemes</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: CITIZEN WORKSPACE */}
      {currentView === "workspace" && (
        <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {/* SevaSetu Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md mb-8 bg-white">
              <img
                src="/SevaSetu.png"
                alt="SevaSetu Portal Banner"
                className="w-full h-auto object-contain block mx-auto"
              />
            </div>

            {/* Quick Metrics Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Registration State
                </span>
                <div className="text-base font-bold text-slate-900">
                  {userProfile.name ? userProfile.name : "New Registration"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  Eligible Schemes:{" "}
                  <span className="text-sm font-extrabold text-emerald-600 ml-1">
                    {eligibleCount}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-800">
                  Vault Documents:{" "}
                  <span className="text-sm font-extrabold text-purple-600 ml-1">
                    {userProfile.uploaded_documents.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Consolidated Registration Form */}
            <ConsolidatedRegistrationForm
              initialProfile={userProfile as any}
               onSubmit={(submittedData:any) => {
                console.log("Parent received submitted profile:", submittedData);
                setUserProfile(submittedData);
                setIsSubmitted(true);
                // Reset category filter on submission so citizen sees all eligible matches
                setSelectedCategory("All");

                setTimeout(() => {
                  document.getElementById("scheme-results-view")?.scrollIntoView({ behavior: "smooth" });
                }, 200);
              }}
            />

            {/* Evaluated Scheme Results */}
            {displayedSchemes.length > 0 && (
              <section id="scheme-results-view" className="mt-12 pt-8 border-t border-slate-200 scroll-mt-24">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Recommended Schemes & Audit Results
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Showing matching schemes tailored to your verified profile ({displayedSchemes.length} schemes evaluated).
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    {displayedSchemes.filter((s: any) => s.isEligible).length} Eligible Schemes Qualified
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedSchemes.map((scheme: any) => (
                    <SchemeCard key={scheme.schemeId} result={scheme} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-[#0E1338] border border-white/15 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>
            {/* Modal Header & Auth Mode Toggle */}
            <div className="mb-6">
              <div className="flex border-b border-white/10 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`w-1/2 pb-2.5 transition ${
                    authMode === "login"
                      ? "text-pink-400 border-b-2 border-pink-500 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sign In (Existing Citizen)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className={`w-1/2 pb-2.5 transition ${
                    authMode === "register"
                      ? "text-pink-400 border-b-2 border-pink-500 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  New Registration
                </button>
              </div>

              <h3 className="text-xl font-bold text-white">
                {authMode === "login" ? "Welcome Back" : "Create Citizen Account"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === "login"
                  ? "Sign in to access your pre-audited schemes and benefit vault."
                  : "Register your basic profile to start your live welfare entitlement audit."}
              </p>
            </div>
            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Citizen Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Email / Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 hover:opacity-95 text-white font-bold py-3 rounded-full transition text-xs shadow-lg shadow-pink-500/25 active:scale-95"
                >
                  {authMode === "login" ? "Enter Workspace" : "Create Account & Start"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}