"use client";

import React from "react";
import { UserProfile } from "@/types/scheme";
import { User, DollarSign, Briefcase, Users, Calendar, CheckSquare } from "lucide-react";

interface ProfileFormProps {
  user: UserProfile;
  onChange: (updated: UserProfile) => void;
}

export default function ProfileForm({ user, onChange }: ProfileFormProps) {
  const handleChange = (field: keyof UserProfile, value: any) => {
    onChange({
      ...user,
      [field]: value,
    });
  };

  return (
    <div className="bg-[#0E1338]/90 rounded-3xl border border-white/10 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
          <User className="w-4 h-4 text-pink-300" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Citizen Demographic Profile
          </h3>
          <p className="text-xs text-slate-400">
            Real-time parameters for deterministic welfare qualification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
        {/* Full Name */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 transition"
            value={user.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Ramesh Kumar"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Age (Years)
          </label>
          <input
            type="number"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 transition"
            value={user.age ?? ""}
            onChange={(e) =>
              handleChange("age", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="e.g. 21"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Gender
          </label>
          <select
            className="w-full bg-[#0E1338] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400 transition"
            value={user.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Annual Family Income (₹)
          </label>
          <input
            type="number"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 transition"
            value={user.annual_income ?? ""}
            onChange={(e) =>
              handleChange(
                "annual_income",
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder="e.g. 180000"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Primary Occupation
          </label>
          <select
            className="w-full bg-[#0E1338] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400 transition"
            value={user.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
          >
            <option value="Student">Student</option>
            <option value="Farmer">Farmer / Agriculture</option>
            <option value="Self Employed">Self Employed / Micro-enterprise</option>
            <option value="Unemployed">Unemployed</option>
            <option value="Salaried">Salaried</option>
          </select>
        </div>

        {/* Caste Category */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">
            Social Category / Reservation
          </label>
          <select
            className="w-full bg-[#0E1338] border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-pink-400 transition"
            value={user.caste_category}
            onChange={(e) => handleChange("caste_category", e.target.value)}
          >
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>

        {/* Checkboxes */}
        <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
          <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white transition">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-white/5 border-white/20 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
              checked={user.is_student}
              onChange={(e) => handleChange("is_student", e.target.checked)}
            />
            <span className="font-medium">Currently an Enrolled Student</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white transition">
            <input
              type="checkbox"
              className="w-4 h-4 rounded bg-white/5 border-white/20 text-pink-500 focus:ring-pink-500 focus:ring-offset-0 cursor-pointer"
              checked={user.owns_agricultural_land}
              onChange={(e) => handleChange("owns_agricultural_land", e.target.checked)}
            />
            <span className="font-medium">Owns Cultivable Agricultural Land</span>
          </label>
        </div>
      </div>
    </div>
  );
}