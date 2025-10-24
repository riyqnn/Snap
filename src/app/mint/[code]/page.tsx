"use client";

import { useEffect, useState } from "react";
import { useProductSeriesNFT } from "@/hooks/useProductSeriesNFT";
import { useAccount } from "wagmi"; // pastiin lu udah setup wagmi client

interface NFTData {
  tokenId: string;
  seriesName: string;
  imageURI: string;
  description: string;
}

export default function CollectionPage() {
  const { address, isConnected } = useAccount();
  const {
    balanceOf,
    ownerOf,
    getTokenURI,
    getTotalNFTsMinted,
    loading,
  } = useProductSeriesNFT();

  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;
    fetchUserNFTs();
  }, [isConnected, address]);

  const fetchUserNFTs = async () => {
    try {
      setFetching(true);
      setNfts([]);

      const total = await getTotalNFTsMinted();
      if (!total.success || !total.data) return;
      const totalMinted = parseInt(total.data);

      const owned: NFTData[] = [];

      for (let tokenId = 0; tokenId < totalMinted; tokenId++) {
        const owner = await ownerOf(tokenId);
        if (owner.success && owner.data?.toLowerCase() === address?.toLowerCase()) {
          const uri = await getTokenURI(tokenId);
          if (uri.success && uri.data) {
            try {
              const metadata = JSON.parse(uri.data);
              owned.push({
                tokenId: tokenId.toString(),
                seriesName: metadata.name,
                imageURI: metadata.image,
                description: metadata.description,
              });
            } catch {
              console.warn("Invalid JSON in tokenURI:", uri.data);
            }
          }
        }
      }

      setNfts(owned);
    } catch (err) {
      console.error("Error fetching collection:", err);
    } finally {
      setFetching(false);
    }
  };

  if (!isConnected)
    return (
      <main className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600">🔌 Connect your wallet to see your collection</p>
      </main>
    );

  return (
    <main className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">🪪 My Collection</h1>

      {loading || fetching ? (
        <p>Loading your NFTs...</p>
      ) : nfts.length === 0 ? (
        <p className="text-gray-500">You haven’t claimed any NFTs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={nft.imageURI}
                alt={nft.seriesName}
                className="w-full h-60 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold">{nft.seriesName}</h2>
              <p className="text-sm text-gray-500">{nft.description}</p>
              <p className="text-xs text-gray-400 mt-2">Token ID: #{nft.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
