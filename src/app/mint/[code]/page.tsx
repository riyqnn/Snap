"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { supabase } from "../../../../lib/supabaseClient";
import useProductSeriesNFT from "@/hooks/useProductSeriesNFT";

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
  const [loadingClaim, setLoadingClaim] = useState(false);

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
          return;
        }

        // 🔹 Check on-chain claim link
        console.log("🔍 Checking on-chain claim link...");
        const claimCheck = await checkClaimLink(code as string);
        console.log("🧱 On-chain claim link check:", claimCheck);

        if (!claimCheck.success) {
          console.error("❌ Error checking claim link on-chain:", claimCheck.error);
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
        router.push("/series/${series.id}");
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
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
        This claim code has already been used.
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-primary">
        Loading series data...
      </div>
    );

  if (!series)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 font-medium">
        Invalid or expired claim link.
      </div>
    );

  // 🔹 Main UI
  return (
    <div className="pt-20">
      <section className="w-full min-h-screen relative">
        <img
          src="/output-background.png"
          alt="city background"
          className="absolute inset-0 w-full object-cover z-0"
        />

        <section className="relative z-20">
          <div className="p-6 rounded-lg text-center pt-20">
            <h1 className="text-3xl font-bold text-[#0052FF] mb-2">
              HI THERE YOU GOT A SNAP
            </h1>
          </div>

          <div className="px-6 md:px-56">
            {/* ===================== CLAIM CARD ===================== */}
            <div className="min-h-screen flex flex-col md:flex-row gap-10 bg-white p-8 rounded-2xl shadow-2xl">
              {/* Left: NFT Preview */}
              <section className="flex-1 shadow-lg rounded-2xl p-6 flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <img
                    src={series.imageURI || "/placeholder-nft.png"}
                    alt={series.seriesName}
                    className="h-40 w-40 rounded-xl object-cover bg-gray-100"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-blue-primary">
                    {series.seriesName}
                  </h1>
                  <p className="text-gray-500 mt-1">Series ID #{series.id}</p>
                  <p className="text-gray-600 mt-2">
                    Created:{" "}
                    {series.createdAt
                      ? new Date(series.createdAt * 1000).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <p className="mt-3 text-gray-700">{series.description}</p>
                </div>
              </section>

              {/* Right: Claim Button */}
              <section className="shadow-lg rounded-2xl p-6 w-full md:w-96">
                <h2 className="text-lg font-semibold mb-2">
                  Collect this Series
                </h2>
                <button
                  onClick={handleClaim}
                  disabled={loadingClaim}
                  className={`mt-3 w-full p-2 rounded-md text-white font-medium ${
                    loadingClaim
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-primary hover:bg-blue-600 transition-all"
                  }`}
                >
                  {loadingClaim ? "Claiming..." : "Claim now"}
                </button>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Mint for free on <span className="font-semibold">Base</span>
                </p>
              </section>
            </div>
            {/* =================== END CLAIM CARD =================== */}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Mint;
