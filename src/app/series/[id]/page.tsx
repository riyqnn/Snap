"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, ExternalLink, Users, Database } from "lucide-react";
import { useAccount } from "wagmi";
import useProductSeriesNFT from "@/hooks/useProductSeriesNFT";
import { supabase } from "../../../../lib/supabaseClient";

interface Collector {
  address: string;
  network: string;
  time: string;
  mints: number;
}

interface ClaimCode {
  id: string;
  claim_code: string;
  is_claimed: boolean;
  claimed_by?: string | null;
  claimed_at?: string | null;
  created_at: string;
  serial_number: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const { readSeries, getSeriesClaimers, generateClaimLinks, loading } =
    useProductSeriesNFT();

  const [series, setSeries] = useState<any>(null);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [allCodes, setAllCodes] = useState<ClaimCode[]>([]); // <-- semua kode dari database

  // 🔹 Fetch data series + claimers + claim codes
  useEffect(() => {
    if (!id) return;

    const fetchSeriesData = async () => {
      try {
        const result = await readSeries(Number(id));
        if (result.success && result.data) {
          setSeries(result.data);
          if (
            address &&
            result.data.brandOwner.toLowerCase() === address.toLowerCase()
          ) {
            setIsOwner(true);
          }
        }

        const claimers = await getSeriesClaimers(Number(id));
        if (claimers.success && claimers.data) {
          setCollectors(
            claimers.data.map((addr) => ({
              address: addr,
              network: "Base",
              time: "Just now",
              mints: 1,
            }))
          );
        }

        // 🔹 Fetch claim codes dari database
        const { data: codesData, error } = await supabase
          .from("claim_links")
          .select("*")
          .eq("series_id", Number(id))
          .order("created_at", { ascending: false });

        if (!error && codesData) {
          setAllCodes(codesData as ClaimCode[]);
        }
      } catch (err) {
        console.error("Error fetching series data:", err);
      }
    };

    fetchSeriesData();
  }, [id, address]);

  // 🔹 Generate random claim codes
  const handleGenerateCodes = async () => {
    if (!isOwner || !series) return;

    const numCodes = 1; // contoh: generate 1 claim codes
    const newCodes = Array.from({ length: numCodes }, () => crypto.randomUUID());

    try {
      const tx = await generateClaimLinks(Number(id), newCodes);

      if (tx.success) {
        // 🔹 Simpan ke Supabase
        const insertData = newCodes.map((code, index) => ({
          series_id: Number(id),
          serial_number: allCodes.length + index + 1, // teruskan numbering
          claim_code: code,
        }));

        const { error } = await supabase.from("claim_links").insert(insertData);
        if (error) throw error;

        setGeneratedCodes(newCodes);

        // Refresh list dari database biar muncul langsung
        const { data: updatedCodes } = await supabase
          .from("claim_links")
          .select("*")
          .eq("series_id", Number(id))
          .order("created_at", { ascending: false });

        setAllCodes(updatedCodes || []);

        alert("Claim codes generated & saved successfully!");
      } else {
        alert("Failed to generate claim codes: " + tx.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating claim codes");
    }
  };

  // 🔹 Loading / no series
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-primary">
        Loading series data...
      </div>
    );

  if (!series)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Series not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Product Detail Card */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img
                  src={series.imageURI}
                  alt={series.seriesName}
                  className="w-44 h-44 object-cover rounded-full"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-grow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-2">
                    Series ID #{id}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-3">
                    {series.seriesName}
                  </h1>
                </div>
                {isOwner && (
                  <button
                    onClick={handleGenerateCodes}
                    className="px-4 py-2 bg-blue-primary text-white rounded-full hover:bg-blue-600 text-sm font-medium"
                  >
                    Generate Claim Codes
                  </button>
                )}
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  Created at:{" "}
                  {new Date(Number(series.createdAt) * 1000).toLocaleString()}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{series.description}</p>

              <a
                href={series.imageURI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-primary hover:underline"
              >
                View on IPFS
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* 🔹 Section: Generated Claim Codes (dari Supabase) */}
          {isOwner && (
            <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-3 gap-2">
                <Database className="w-5 h-5 text-blue-primary" />
                <h3 className="font-semibold text-gray-800">
                  All Generated Claim Codes
                </h3>
              </div>

              {allCodes.length > 0 ? (
                <table className="w-full text-sm border-t border-gray-100">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Claim Code</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Claimed By</th>
                      <th className="py-2 px-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCodes.map((code, i) => (
                      <tr
                        key={code.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2 px-3">{code.serial_number}</td>
                        <td className="py-2 px-3 font-mono text-gray-700">
                          {code.claim_code}
                        </td>
                        <td className="py-2 px-3">
                          {code.is_claimed ? (
                            <span className="text-green-600 font-medium">
                              ✅ Claimed
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-gray-700">
                          {code.claimed_by
                            ? `${code.claimed_by.slice(0, 6)}...${code.claimed_by.slice(-4)}`
                            : "-"}
                        </td>
                        <td className="py-2 px-3 text-gray-500">
                          {new Date(code.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No claim codes generated yet.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Collectors Section */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white-secondary bg-opacity-10 rounded-full">
                <Users className="w-5 h-5 text-blue-primary" />
                <span className="font-semibold text-gray-800">
                  {collectors.length} Collectors
                </span>
              </div>
            </div>
          </div>

          {/* Collectors Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Collector
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Network
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Power
                  </th>
                </tr>
              </thead>
              <tbody>
                {collectors.map((collector, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white-secondary bg-opacity-20 rounded-full flex items-center justify-center">
                          <span className="text-xs text-blue-primary">⟠</span>
                        </div>
                        <span className="text-sm text-gray-800 font-mono">
                          {collector.address.length > 20
                            ? `${collector.address.slice(
                                0,
                                10
                              )}...${collector.address.slice(-8)}`
                            : collector.address}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white-secondary bg-opacity-10 text-blue-primary text-xs font-medium">
                        ⊙ {collector.network}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {collector.time}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-800">
                        ⚡ {collector.mints}
                      </span>
                    </td>
                  </tr>
                ))}

                {collectors.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-gray-500 italic"
                    >
                      No collectors yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
