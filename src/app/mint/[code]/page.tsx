"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { supabase } from "../../../../lib/supabaseClient";
import useProductSeriesNFT from "@/hooks/useProductSeriesNFT";
import Navbar from "@/components/Navbar";
import Footer from "@/components/atom/Footer";

interface SeriesData {
  id: number;
  seriesName: string;
  description: string;
  imageURI: string;
  createdAt: number;
}

const Mint: React.FC = () => {
  const { code } = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { readSeries, claimNFT, checkClaimLink, loading } = useProductSeriesNFT();

  const [series, setSeries] = useState<SeriesData | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(true);

  // 🔹 Fetch claim link info + series detail
  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      try {

        console.log("🔍 Fetching claim link from Supabase for code:", code);

        const { data: claim, error } = await supabase
          .from("claim_links")
          .select("*")
          .eq("claim_code", code)
          .single();

        console.log("📦 Supabase claim result:", { claim, error });

        if (error || !claim) {
          console.error("❌ Invalid or missing claim link:", error);
          setLoadingClaim(false)
          return;
        }

        // 🔹 Check on-chain claim link
        console.log("🔍 Checking on-chain claim link...");
        const claimCheck = await checkClaimLink(code as string);
        console.log("🧱 On-chain claim link check:", claimCheck);

        if (!claimCheck.success) {
          console.error("❌ Error checking claim link on-chain:", claimCheck.error);
          setLoadingClaim(false)
          return;
        }

        if (claimCheck.data?.isClaimed || claim.is_claimed) {
          console.warn("⚠️ Claim link already used (on-chain or DB)");
          setIsClaimed(true);
          return;
        }

        // 🔹 Fetch series info
        console.log("📖 Fetching series info for ID:", claim.series_id);
        const result = await readSeries(Number(claim.series_id));
        console.log("🧩 readSeries result:", result);

        if (result.success && result.data) {
          const data = result.data;
          setSeries({
            id: Number(claim.series_id),
            seriesName: data.seriesName,
            description: data.description,
            imageURI: data.imageURI,
            createdAt: Number(data.createdAt),
          });
          console.log("✅ Series data loaded:", data);
          setLoadingClaim(false)
        } else {
          console.error("❌ Failed to load series:", result.error);
        }
      } catch (err) {
        console.error("💥 Error fetching data:", err);
      }
    };

    fetchData();
  }, [code]);

  // 🔹 Claim NFT handler
  const handleClaim = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      console.warn("⚠️ Wallet not connected");
      return;
    }

    if (!series) {
      console.error("❌ Series data missing before claim");
      return;
    }

    try {
      setLoadingClaim(true);
      console.log("🚀 Starting on-chain claim for code:", code);

      const tx = await claimNFT(code as string);
      console.log("🧾 claimNFT result:", tx);

      if (tx.success) {
        console.log("✅ Claim successful! Updating Supabase...");

        await supabase
          .from("claim_links")
          .update({
            is_claimed: true,
            claimed_by: address,
            claimed_at: new Date().toISOString(),
          })
          .eq("claim_code", code);

        alert("🎉 NFT claimed successfully!");
        router.push(`/series/${series.id}`);
      } else {
        console.error("❌ Claim failed:", tx.error);
        alert("Claim failed: " + tx.error);
      }
    } catch (err) {
      console.error("💥 Claim error:", err);
      alert("An error occurred during claim.");
    } finally {
      setLoadingClaim(false);
    }
  };

  // 🔹 UI states
  if (isClaimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Already Claimed</h2>
          <p className="text-gray-600">This claim code has already been used.</p>
        </div>
      </div>
    );
  }

  if (!loadingClaim && !series)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Link</h2>
          <p className="text-gray-600">Invalid or expired claim link.</p>
        </div>
      </div>
    );

  if (loadingClaim)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-blue-600 font-medium">Loading series data...</p>
        </div>
      </div>
    );

  // 🔹 Main UI
  return (
    <>
    <Navbar className="!static" />
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
            YOU GOT A <span className="text-blue-600">SNAP</span>
          </h2>
        </div>

        {/* Main Cards Container */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
          {/* Left Card - NFT Details */}
          <div className="flex-1 bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
              {/* NFT Image with Blue Circle */}
              <div className="relative mb-6">
                <div className="w-48 h-48 rounded-full bg-black-secondary flex items-center justify-center p-1">
                  <img
                    src={series?.imageURI || "/placeholder-nft.png"}
                    alt={series?.seriesName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Brand Logo Icon */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{series?.seriesName}</h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-2">{series?.description}</p>
              
              {/* Batch Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>📦</span>
                <span>Batch {series?.id}</span>
              </div>

              {/* Series ID */}
              <p className="text-sm text-gray-400 mb-1">
                Series ID: #{series?.id}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📅</span>
                <span>
                  {series?.createdAt
                    ? new Date(series?.createdAt * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Card - Claim Section */}
          <div className="w-full md:w-80 bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Claim this SNAP
            </h2>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              Connect your wallet to collect this digital certificate.
              Proof of ownership, secured on-chain.
            </p>

            {/* Claim Button */}
            <button
              onClick={handleClaim}
              disabled={loadingClaim || !isConnected}
              className={`w-full py-3 px-6 rounded-full text-white font-semibold text-lg transition-all ${
                loadingClaim || !isConnected
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {loadingClaim ? "Minting..." : isConnected ? "Mint Now" : "Connect Wallet"}
            </button>

            {/* Footer Text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By minting this SNAP, you accept SNAPs{" "}
              <span className="text-blue-600 underline cursor-pointer">Terms of Service</span>
              {" "}and{" "}
              <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </p>

            <div className="mt-auto pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Mint for free on <span className="font-bold text-blue-600">Base</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Mint;