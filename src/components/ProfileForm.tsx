"use client";

import React from "react";
import { UserProfile } from "@/types/scheme";

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
    <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        Citizen Demographic Profile
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-500 text-gray-900"
            value={user.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Ramesh Kumar"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-500 text-gray-900"
            value={user.age ?? ""}
            onChange={(e) =>
              handleChange("age", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="e.g. 21"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-500 text-gray-900"
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
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Annual Family Income (₹)
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-500 text-gray-900"
            value={user.annual_income ?? ""}
            onChange={(e) =>
              handleChange(
                "annual_income",
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder="e.g. 150000"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Occupation</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-500 text-gray-900"
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
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Social Category / Caste
          </label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-blue-500 text-gray-900"
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
        <div className="flex items-center gap-6 sm:col-span-2 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded"
              checked={user.is_student}
              onChange={(e) => handleChange("is_student", e.target.checked)}
            />
            Currently a Student
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded"
              checked={user.owns_agricultural_land}
              onChange={(e) => handleChange("owns_agricultural_land", e.target.checked)}
            />
            Owns Agricultural Land
          </label>
        </div>
      </div>
    </div>
  );
}