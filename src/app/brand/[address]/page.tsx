'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Package, CheckCircle, XCircle } from 'lucide-react';
import { useBrandRegistry } from '../../../hooks/useBrandRegistry';
import { useProductSeriesNFT } from '../../../hooks/useProductSeriesNFT';
import { useAccount } from 'wagmi'; 
import Navbar from '@/components/Navbar';
import Footer from '@/components/atom/Footer';
import MintSeriesModal from '@/components/atom/modalMintSeries';


interface BrandDetail {
  brandName: string;
  logoURI: string;
  description: string;
  registeredAt: bigint;
  isVerified: boolean;
}

interface SeriesDetail {
  seriesId: string;
  seriesName: string;
  imageURI: string;
  description: string;
  maxSupply: string;
  minted: string;
  claimed: string;
  createdAt: string;
  isActive: boolean;
}

type SortOption = "newest" | "oldest" | "most-minted";
type ViewMode = "grid" | "list";

const BrandPage = () => {
  const params = useParams();
  // param address
  const paramAddress = Array.isArray(params?.address) ? params.address[0] : params?.address;
  const router = useRouter();
  const { address, isConnected } = useAccount();


  const { readBrand } = useBrandRegistry();
  const { getBrandSeries, readSeries } = useProductSeriesNFT();
  const { mintSeries, loading, error } = useProductSeriesNFT();

  const [brand, setBrand] = useState<BrandDetail | null>(null);
  const [seriesList, setSeriesList] = useState<SeriesDetail[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<SeriesDetail[]>([]);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [errorPage, setErrorPage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isOwner, setIsOwner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch brand detail
  useEffect(() => {
    if (!paramAddress) return;

    const fetchBrand = async () => {
      try {
        const data = await readBrand(paramAddress);
        if (!data) throw new Error('Brand not found');
        setBrand(data); 
        console.log(paramAddress,address)
        if (address && paramAddress.toLowerCase() === address.toLowerCase()) {
          setIsOwner(true);
          console.log("Welcome, owner!");
        } else {
          setIsOwner(false);
          console.log("Not the owner");
        }
      } catch (err: any) {
        setErrorPage(err.message || 'Error fetching brand');
      } finally {
        setLoadingPage(false);
      }
    };

    fetchBrand();
  }, [paramAddress,address]);

  // Fetch series list
  useEffect(() => {
    if (!paramAddress) return;
    setLoadingPage(true);
    const fetchSeries = async () => {
      try {
        const res = await getBrandSeries(paramAddress);
        if (!res.success || !res.data) {
          setSeriesList([]);
          return;
        }

        const seriesDetails: SeriesDetail[] = [];
        for (const idStr of res.data) {
          const id = Number(idStr);
          const seriesRes = await readSeries(id);
          if (seriesRes.success && seriesRes.data) {
            seriesDetails.push({
              seriesId: idStr,
              ...seriesRes.data
            } as SeriesDetail);
          }
        }
        setSeriesList(seriesDetails);
      } catch (err: any) {
        console.error('Error fetching series:', err);
      }
    };

    fetchSeries();
  }, [paramAddress]);

  // Filter and sort
  useEffect(() => {
    let result = [...seriesList];

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (series) =>
          series.seriesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          series.seriesId.toString().includes(searchQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return Number(a.createdAt) - Number(b.createdAt);
        case "most-minted":
          return Number(b.minted) - Number(a.minted);
        case "newest":
        default:
          return Number(b.createdAt) - Number(a.createdAt);
      }
    });

    setFilteredSeries(result);
  }, [seriesList, searchQuery, sortBy]);

  if (loadingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-primary">
        Loading brand details and series...
      </div>
    );
  }

  if (errorPage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {errorPage}
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Brand not found
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white p-8 pt-30 bg-[url('/create-brand-background.png')] bg-cover bg-center">
        <div className="max-w-6xl mx-auto">
          {/* Brand Detail Card */}
          <div className="bg-gray-50 rounded-3xl border shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Brand Logo */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                  {brand.logoURI ? (
                    <img
                      src={brand.logoURI}
                      alt={`${brand.brandName} Logo`}
                      className="w-44 h-44 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-44 h-44 bg-gray-200 rounded-full flex items-center justify-center">
                      <Package className="w-20 h-20 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Info */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">
                      Brand Address: {paramAddress?.slice(0, 10)}...{paramAddress?.slice(-8)}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">
                      {brand.brandName}
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                      {brand.isVerified ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                          <XCircle className="w-4 h-4 mr-1" />
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Registered at:{" "}
                    {new Date(Number(brand.registeredAt) * 1000).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{brand.description}</p>
              </div>
            </div>
          </div>

          {/* Series List Section */}
          <div className="max-w-6xl mx-auto px-6 py-6 bg-white rounded-3xl border shadow-2xl border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  placeholder="Search for Series"
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
              {isOwner && (
                <div className="py-6 flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#3d9cfb] text-white px-4 py-2 rounded-full hover:bg-[#0052ff] hover:scale-105 transition-all duration-300 shadow-sm"
                  >
                    + Mint Series
                  </button>
                  <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 hover:scale-105 transition-all duration-300 shadow-sm">
                    Edit Brand
                  </button>
                </div>
              )}
            </div>
            <MintSeriesModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            {/* Title with Line */}
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                SERIES
              </h2>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Series Grid/List */}
            {filteredSeries.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                {searchQuery
                  ? "No series found matching your search."
                  : "No series found for this brand."}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-15 gap-6"
                    : "space-y-4 py-7"
                }
              >
                {filteredSeries.map((s) =>
                  viewMode === "grid" ? (
                    <div
                      key={s.seriesId}
                      onClick={() => router.push(`/series/${s.seriesId}`)}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden bg-gray-100">
                        {s.imageURI ? (
                          <img
                            src={s.imageURI}
                            alt={s.seriesName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">
                          #{s.seriesId.toString().padStart(6, "0")}
                        </p>
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {s.seriesName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {s.minted} / {s.maxSupply} minted
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={s.seriesId}
                      onClick={() => router.push(`/series/${s.seriesId}`)}
                      className="cursor-pointer flex gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                    >
                      {s.imageURI ? (
                        <img
                          src={s.imageURI}
                          alt={s.seriesName}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">
                          #{s.seriesId.toString().padStart(6, "0")}
                        </p>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">
                          {s.seriesName}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {s.description}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            Minted: {s.minted} / {s.maxSupply}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full ml-2">
                            Claimed: {s.claimed}
                          </span>
                          {s.isActive ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrandPage;