"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import useProductSeriesNFT from "@/hooks/useProductSeriesNFT";

interface SeriesData {
  id: number;
  seriesName: string;
  description: string;
  imageURI: string;
  createdAt: number;
  claimed: string;
  maxSupply: string;
}

const BrandCard = () => {
  return (
    <div className="grid grid-flow-col justify-start col-span-1 items-center bg-white rounded-[2rem] shadow border border-gray-200 px-4 py-3 gap-4 max-w-xl">
      <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/41/f6/43/41f643143963891907660e00af6c0dd2.jpg"
          alt="product"
          className="w-24 h-24 object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-bold">
          <img
            src="https://i.pinimg.com/736x/e7/65/04/e7650458fe434cd647eafb289a569fe2.jpg"
            alt="brand"
            className="w-4 h-4"
          />
          {"Nike"}
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">{"Sepatu"}</h3>
          <span className="text-xs text-gray-500 font-medium mt-1">
            Batch {"1"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Museum() {
  const router = useRouter();
  const { getTotalSeries, readSeries } = useProductSeriesNFT();
  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [activeTab, setActiveTab] = useState<"Products" | "Brands" | "Activity">(
    "Products"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        console.log("🔍 Fetching total series...");
        const total = await getTotalSeries();

        if (!total.success) {
          console.error("❌ Failed to fetch total:", total.error);
          setLoading(false);
          return;
        }

        const count = Number(total.data);
        console.log(`📦 Found ${count} series`);

        const fetchedSeries: SeriesData[] = [];

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

        console.log("✅ Loaded all series:", fetchedSeries);
        setSeriesList(fetchedSeries);
      } catch (err) {
        console.error("💥 Error fetching series:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [getTotalSeries, readSeries]);

  return (
    <>
      <Navbar />
      <section className="w-full min-h-screen">
        {/* section 1 */}
        <div className="relative w-full md:h-[70vh] overflow-hidden">
          <img
            src="/output-background.png"
            alt=""
            className="absolute z-0 w-full mt-0 md:-mt-80"
          />
          <section className="relative z-20 flex flex-col gap-8 items-center justify-center h-[50vh] md:h-[70vh]">
            <h2 className="text-blue-700 font-bold text-3xl flex items-center rounded-full border border-gray-300 bg-white shadow-md overflow-hidden px-24 py-4">
              SNAP MUSEUM
            </h2>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-md overflow-hidden w-full max-w-3xl">
                <input
                  type="text"
                  placeholder="Email, Address or ENS"
                  className="flex-1 px-4 py-2 text-sm outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full m-1 transition">
                  Search
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* section 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 bg-[#F6F7F9] px-2 ">
          <BrandCard />
          <BrandCard />
          <BrandCard />
          <BrandCard />
        </div>

        {/* section 3 */}
        <section className="px-6 py-10 bg-[#f9fafb]">
          <div className="max-w-7xl mx-auto">
            {/* Tabs */}
            <div className="flex items-center space-x-4 mb-6 rounded-full p-1 border border-gray-600 w-fit mx-auto">
              <button
                onClick={() => setActiveTab("Products")}
                className={`${
                  activeTab === "Products"
                    ? "bg-blue-600 text-white "
                    : "text-gray-600 "
                } px-4 py-2 rounded-full text-sm font-medium shadow`}
              >
                {seriesList.length} Products
              </button>
              <button
                onClick={() => setActiveTab("Brands")}
                className={`${
                  activeTab === "Brands"
                    ? "bg-blue-600 text-white "
                    : "text-gray-600 "
                } px-4 py-2 rounded-full text-sm font-medium shadow`}
              >
                12,844 Brands
              </button>
              <button
                onClick={() => alert("soon")}
                className="text-gray-600 px-4 py-2 text-sm font-medium"
              >
                Activity
              </button>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="text-center text-gray-500 py-10">
                Loading series...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-[#F6F7F9]">
                {seriesList.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => router.push(`/series/${s.id}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <img
                      src={s.imageURI || "/placeholder-nft.png"}
                      alt={s.seriesName}
                      className="w-full h-80 mb-4 rounded-xl object-cover"
                    />
                    <p className="text-xs text-gray-400 mb-1">
                      ID {s.id.toString().padStart(6, "0")}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {s.seriesName}
                    </h3>
                    <p className="text-sm text-gray-500">{s.description}</p>

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
                        <span>
                          {new Date(s.createdAt * 1000).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">
                        {s.claimed}/{s.maxSupply} Collected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
