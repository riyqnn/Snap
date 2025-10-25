"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import useProductSeriesNFT from "@/hooks/useProductSeriesNFT";
import {useBrandRegistry} from "@/hooks/useBrandRegistry";
import Footer from "@/components/atom/Footer";

interface SeriesData {
  id: number;
  seriesName: string;
  description: string;
  imageURI: string;
  createdAt: number;
  claimed: string;
  maxSupply: string;
}

interface BrandData {
  address: string;
  brandName: string;
  logoURI: string;
  description: string;
  registeredAt: number;
  isVerified: boolean;
}

const BrandCard = ({ brand }: { brand: BrandData }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer">
      <div className="w-full h-80 mb-4 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={brand.logoURI || "/placeholder-brand.png"}
          alt={brand.brandName}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs text-gray-400 mb-1">
        {brand.address.slice(0, 6)}...{brand.address.slice(-4)}
      </p>
      <h3 className="text-sm font-semibold text-gray-800 mb-1">{brand.brandName}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{brand.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center space-x-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 9h10m-11 5h12"
            />
          </svg>
          <span>{new Date(brand.registeredAt * 1000).toLocaleDateString()}</span>
        </span>
        <span className={`px-2 py-1 rounded-full ${brand.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {brand.isVerified ? 'Verified' : 'Unverified'}
        </span>
      </div>
    </div>
  );
};

export default function Museum() {
  const router = useRouter();
  const { getTotalSeries, readSeries } = useProductSeriesNFT();
  const { getAllBrands, readBrand } = useBrandRegistry();

  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [activeTab, setActiveTab] = useState<"Products" | "Brands">("Products");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // FETCH SERIES
        const totalSeries = await getTotalSeries();
        const fetchedSeries: SeriesData[] = [];
        if (totalSeries.success && totalSeries.data) {
          const count = Number(totalSeries.data);
          for (let i = 0; i < count; i++) {
            const s = await readSeries(i);
            if (s.success && s.data) {
              fetchedSeries.push({
                id: i,
                seriesName: s.data.seriesName,
                description: s.data.description,
                imageURI: s.data.imageURI,
                createdAt: Number(s.data.createdAt),
                claimed: s.data.claimed?.toString() || "0",
                maxSupply: s.data.maxSupply?.toString() || "0",
              });
            }
          }
        }

        // FETCH BRANDS
        const fetchedBrands: BrandData[] = [];
        const addresses = await getAllBrands();
        console.log("Addresses from contract:", addresses);
        for (const addr of addresses) {
          const b = await readBrand(addr);
          if (b) {
            fetchedBrands.push({
              address: addr,
              brandName: b.brandName,
              logoURI: b.logoURI,
              description: b.description,
              registeredAt: Number(b.registeredAt),
              isVerified: b.isVerified,
            });
          }
        }

        // SET STATE
        setSeriesList(fetchedSeries);
        setBrands(fetchedBrands);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <img
            src="/output-background.png"
            alt=""
            className="absolute z-0 w-full h-full object-cover"
          />
          <section className="relative z-20 flex flex-col gap-4 md:gap-8 items-center justify-center h-full px-4">
            <h2 className="text-blue-700 font-bold text-2xl md:text-3xl flex items-center rounded-full border border-gray-300 bg-white shadow-md overflow-hidden px-8 md:px-24 py-3 md:py-4">
              SNAP MUSEUM
            </h2>
            <div className="mt-2 md:mt-6 flex justify-center w-full max-w-3xl px-4">
              <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-md overflow-hidden w-full">
                <input
                  type="text"
                  placeholder="Email, Address or ENS"
                  className="flex-1 px-4 py-2 text-sm outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 md:px-5 py-2 rounded-full m-1 transition whitespace-nowrap">
                  Search
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Content Section */}
        <section className="px-4 md:px-6 py-8 md:py-10 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-6 md:mb-8 rounded-full p-1 border border-gray-300 bg-white w-fit mx-auto shadow-sm">
              <button
                onClick={() => setActiveTab("Products")}
                className={`${
                  activeTab === "Products" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                } px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all`}
              >
                <span className="hidden sm:inline">{seriesList.length} Products</span>
                <span className="sm:hidden">Products ({seriesList.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("Brands")}
                className={`${
                  activeTab === "Brands" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                } px-4 md:px-6 py-2 rounded-full text-sm font-medium transition-all`}
              >
                <span className="hidden sm:inline">{brands.length} Brands</span>
                <span className="sm:hidden">Brands ({brands.length})</span>
              </button>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="text-center text-gray-500 py-10 md:py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {activeTab === "Products" &&
                  seriesList.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => router.push(`/series/${s.id}`)}
                      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <div className="w-full h-64 md:h-80 mb-4 rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={s.imageURI || "/placeholder-nft.png"}
                          alt={s.seriesName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        ID {s.id.toString().padStart(6, "0")}
                      </p>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">{s.seriesName}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{s.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 9h10m-11 5h12"
                            />
                          </svg>
                          <span className="hidden sm:inline">{new Date(s.createdAt * 1000).toLocaleDateString()}</span>
                          <span className="sm:hidden">{new Date(s.createdAt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                          {s.claimed}/{s.maxSupply}
                        </span>
                      </div>
                    </div>
                  ))}

                {activeTab === "Brands" &&
                  brands.map((b, idx) => (
                    <div key={idx} onClick={() => router.push(`/brand/${b.address}`)}>
                      <BrandCard brand={b} />
                    </div>
                  ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && activeTab === "Products" && seriesList.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                <p className="text-lg">No products found</p>
              </div>
            )}
            {!loading && activeTab === "Brands" && brands.length === 0 && (
              <div className="text-center text-gray-500 py-20">
                <p className="text-lg">No brands found</p>
              </div>
            )}
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}