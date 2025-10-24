"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ethers, Contract } from "ethers";
import useProductSeriesNFT from "@/hooks/useProductSeriesNFT";
import ProductSeriesNFTAbi from "@/contracts/ProductSeriesNFT.json";
import Footer from "@/components/atom/Footer";
import Navbar from "@/components/Navbar";

const CONTRACT_ADDRESS = "0xc438befff53f1a49c4a078842258ac80f93ea90c";
const READ_RPC = "https://sepolia.base.org";

interface NFTCard {
  tokenId: number;
  seriesId: number;
  name: string;
  description: string;
  image: string;
}

type SortOption = "mint-date" | "series-id" | "token-id";
type ViewMode = "grid" | "list";

export default function CollectionPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    getTotalNFTsMinted,
    ownerOf,
    getTokenURI,
    loading: hookLoading,
  } = useProductSeriesNFT();

  const [nfts, setNfts] = useState<NFTCard[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFTCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("mint-date");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    if (!isConnected || !address) {
      setNfts([]);
      setFilteredNfts([]);
      return;
    }
    fetchCollection();
  }, [isConnected, address]);

  useEffect(() => {
    filterAndSortNFTs();
  }, [nfts, searchQuery, sortBy, selectedMonth]);

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    setNfts([]);

    try {
      const totalResult = await getTotalNFTsMinted();
      if (!totalResult.success || !totalResult.data) {
        throw new Error(totalResult.error || "Failed to fetch total NFTs");
      }
      const totalMinted = parseInt(totalResult.data, 10);
      if (totalMinted <= 0) {
        setNfts([]);
        setLoading(false);
        return;
      }

      const provider = new ethers.JsonRpcProvider(READ_RPC);
      const readContract = new Contract(
        CONTRACT_ADDRESS,
        ProductSeriesNFTAbi.abi || ProductSeriesNFTAbi,
        provider
      );

      const collected: NFTCard[] = [];

      for (let tokenId = 0; tokenId < totalMinted; tokenId++) {
        const ownerRes = await ownerOf(tokenId);
        if (!ownerRes.success || !ownerRes.data) continue;
        if (ownerRes.data.toLowerCase() !== address?.toLowerCase()) continue;

        let seriesIdNum: number | undefined;
        try {
          const seriesIdBn = await readContract.tokenToSeries(tokenId);
          seriesIdNum = Number(seriesIdBn);
        } catch (err) {
          console.warn(`Failed to read tokenToSeries for token ${tokenId}:`, err);
        }

        const uriRes = await getTokenURI(tokenId);
        let metadataName = `Token #${tokenId}`;
        let metadataDesc = "";
        let metadataImage = "/placeholder-nft.png";

        if (uriRes.success && uriRes.data) {
          try {
            const parsed = JSON.parse(uriRes.data);
            if (parsed) {
              metadataName = parsed.name || metadataName;
              metadataDesc = parsed.description || "";
              metadataImage = parsed.image || metadataImage;
            }
          } catch (parseErr) {
            console.warn(`Failed to parse tokenURI for ${tokenId}`, parseErr);
          }
        }

        collected.push({
          tokenId,
          seriesId: seriesIdNum ?? -1,
          name: metadataName,
          description: metadataDesc,
          image: metadataImage,
        });
      }

      setNfts(collected);
    } catch (err: any) {
      console.error("Error fetching collection:", err);
      setError(err?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortNFTs = () => {
    let result = [...nfts];

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (nft) =>
          nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nft.tokenId.toString().includes(searchQuery)
      );
    }

    // Filter by month (if needed)
    if (selectedMonth) {
      // This would need timestamp data from blockchain
      // For now, just showing the UI
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "token-id":
          return a.tokenId - b.tokenId;
        case "series-id":
          return a.seriesId - b.seriesId;
        case "mint-date":
        default:
          return b.tokenId - a.tokenId; // Latest first
      }
    });

    setFilteredNfts(result);
  };

  if (!isConnected) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            🔌 Connect your wallet to see your collection
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
        <Navbar className="!static bg-white-secondary" />
      {/* Header with Address */}
      <div className="bg-blue-primary py-20 mb-7 px-6 bg-[url('/collection-background.png')] bg-cover">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white text-3xl md:text-lg font-semibold">
            {address}
          </p>
          <p className="text-blue-100 text-sm mt-2">
            {nfts.length} SNAPs • Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search for SNAPs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">order by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="mint-date">Mint Date</option>
                <option value="token-id">Token ID</option>
                <option value="series-id">Series ID</option>
              </select>
            </div>

            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border-l border-gray-300 ${
                  viewMode === "list"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-white text-gray-500"
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Title with Line */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
            MY COLLECTION
          </h2>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* NFT Grid/List */}
        {hookLoading || loading ? (
          <div className="py-20 text-center text-gray-600">
            Loading your NFTs...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-600">Error: {error}</div>
        ) : filteredNfts.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            {searchQuery
              ? "No NFTs found matching your search."
              : "You haven't claimed any NFTs yet."}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-15 gap-6"
                : "space-y-4 py-7"
            }
          >
            {filteredNfts.map((nft) =>
              viewMode === "grid" ? (
                <div
                  key={nft.tokenId}
                  onClick={() =>
                    nft.seriesId >= 0
                      ? router.push(`/series/${nft.seriesId}`)
                      : alert("Series ID not available for this token.")
                  }
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">
                      #{nft.tokenId.toString().padStart(6, "0")}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {nft.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Series {nft.seriesId >= 0 ? nft.seriesId : "—"}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={nft.tokenId}
                  onClick={() =>
                    nft.seriesId >= 0
                      ? router.push(`/series/${nft.seriesId}`)
                      : alert("Series ID not available for this token.")
                  }
                  className="cursor-pointer flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">
                      #{nft.tokenId.toString().padStart(6, "0")}
                    </p>
                    <h3 className="text-base font-semibold text-gray-800 mb-1">
                      {nft.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {nft.description}
                    </p>
                    <div className="mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        Series: {nft.seriesId >= 0 ? nft.seriesId : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}