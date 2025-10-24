"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ClaimCodePage: React.FC = () => {
  const router = useRouter();
  const [claimCode, setClaimCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate claim code
    if (!claimCode.trim()) {
      setError("Please enter a claim code");
      return;
    }

    // Reset error and navigate to mint page
    setError("");
    router.push(`/mint/${claimCode.trim()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Sketch Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src="/output-background.png"
          alt="city background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            HI THERE
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold">
            REDEEM YOUR <span className="text-blue-600">SNAP</span>
          </h2>
        </div>

        {/* Claim Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-blue-600 p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
            Claim this SNAP
          </h2>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            Enter your claim code to collect this digital certificate.
            Proof of ownership, secured on-chain.
          </p>

          {/* Claim Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="claimCode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Claim Code
              </label>
              <input
                id="claimCode"
                type="text"
                value={claimCode}
                onChange={(e) => {
                  setClaimCode(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your claim code"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-all hover:shadow-lg"
            >
              Redeem Now
            </button>
          </form>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By redeeming this SNAP, you accept SNAPs{" "}
            <span className="text-blue-600 underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Mint for free on <span className="font-bold text-blue-600">Base</span>
            </p>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-600 mt-6 text-center max-w-md">
          Dont have a claim code?{" "}
          <span className="text-blue-600 font-semibold underline cursor-pointer">
            Contact the brand
          </span>
        </p>
      </div>
    </div>
  );
};

export default ClaimCodePage;