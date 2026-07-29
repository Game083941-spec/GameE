"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function TestAccountForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md bg-[#f8f9fa] p-6 space-y-5">
      <div className="space-y-2">
        <label className="text-[14px] text-gray-800">
          Add test account username/email
        </label>
        <input
          type="text"
          placeholder="Add username/email"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[14px] text-gray-800">
          Add test account password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Add password"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-center">
        <button
          type="button"
          className="px-8 py-2.5 bg-[#4a362a] hover:bg-[#3a2a20] text-white text-[15px] font-medium rounded-lg shadow-sm transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
