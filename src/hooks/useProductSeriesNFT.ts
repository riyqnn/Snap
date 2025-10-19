import { useState, useCallback } from 'react';
import { ethers, Contract, BrowserProvider, TransactionReceipt } from 'ethers';
import ProductSeriesNFT from '../contracts/ProductSeriesNFT.json';

const CONTRACT_ADDRESS = '0xc438befff53f1a49c4a078842258ac80f93ea90c'; 

interface SeriesData {
  seriesName: string;
  imageURI: string;
  description: string;
  maxSupply: string;
  minted: string;
  claimed: string;
  brandOwner: string;
  createdAt: string;
  isActive: boolean;
}

interface ClaimLinkData {
  seriesId: string;
  isClaimed: boolean;
  claimedBy: string;
  claimedAt: string;
}

interface TransactionResult {
  success: boolean;
  receipt?: TransactionReceipt;
  error?: string;
}

interface MintSeriesResult extends TransactionResult {
  seriesId?: bigint;
}

interface ClaimNFTResult extends TransactionResult {
  tokenId?: bigint;
}

interface ReadSeriesResult {
  success: boolean;
  data?: SeriesData;
  error?: string;
}

interface CheckClaimLinkResult {
  success: boolean;
  data?: ClaimLinkData;
  error?: string;
}

interface GetBrandSeriesResult {
  success: boolean;
  data?: string[];
  error?: string;
}

interface GetSeriesClaimersResult {
  success: boolean;
  data?: string[];
  error?: string;
}

interface GetTotalResult {
  success: boolean;
  data?: string;
  error?: string;
}

interface GetTokenURIResult {
  success: boolean;
  data?: string;
  error?: string;
}

interface BalanceOfResult {
  success: boolean;
  data?: string;
  error?: string;
}

interface OwnerOfResult {
  success: boolean;
  data?: string;
  error?: string;
}

export const useProductSeriesNFT = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get contract instance
  const getContract = useCallback(async (needSigner = false): Promise<Contract> => {
    try {
      let provider;

      if (needSigner) {
        if (!window.ethereum) throw new Error("Wallet not connected");
        provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return new Contract(CONTRACT_ADDRESS, ProductSeriesNFT, signer);
      } else {
        provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
        return new Contract(CONTRACT_ADDRESS, ProductSeriesNFT, provider);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    }
  }, []);



  // Mint new series
  const mintSeries = useCallback(async (
    seriesName: string,
    imageURI: string,
    description: string,
    maxSupply: number
  ): Promise<MintSeriesResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(true);
      const tx = await contract.mintSeries(seriesName, imageURI, description, maxSupply);
      const receipt: TransactionReceipt = await tx.wait();
      
      // Get seriesId from event
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log)?.name === 'SeriesCreated';
        } catch { return false; }
      });
      
      const seriesId = event ? contract.interface.parseLog(event)?.args.seriesId : null;
      
      setLoading(false);
      return { success: true, seriesId, receipt };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Generate claim links
  const generateClaimLinks = useCallback(async (
    seriesId: number,
    claimCodes: string[]
  ): Promise<TransactionResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(true);
      const tx = await contract.generateClaimLinks(seriesId, claimCodes);
      const receipt: TransactionReceipt = await tx.wait();
      
      setLoading(false);
      return { success: true, receipt };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Claim NFT
  const claimNFT = useCallback(async (claimCode: string): Promise<ClaimNFTResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(true);
      const tx = await contract.claimNFT(claimCode);
      const receipt: TransactionReceipt = await tx.wait();
      
      // Get tokenId from event
      const event = receipt.logs.find(log => {
        try {
          return contract.interface.parseLog(log)?.name === 'NFTClaimed';
        } catch { return false; }
      });
      
      const tokenId = event ? contract.interface.parseLog(event)?.args.tokenId : null;
      
      setLoading(false);
      return { success: true, tokenId, receipt };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Read series info
  const readSeries = useCallback(async (seriesId: number): Promise<ReadSeriesResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const series = await contract.readSeries(seriesId);
      
      setLoading(false);
      return {
        success: true,
        data: {
          seriesName: series.seriesName,
          imageURI: series.imageURI,
          description: series.description,
          maxSupply: series.maxSupply.toString(),
          minted: series.minted.toString(),
          claimed: series.claimed.toString(),
          brandOwner: series.brandOwner,
          createdAt: series.createdAt.toString(),
          isActive: series.isActive
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Check claim link
  const checkClaimLink = useCallback(async (claimCode: string): Promise<CheckClaimLinkResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const result = await contract.checkClaimLink(claimCode);
      
      setLoading(false);
      return {
        success: true,
        data: {
          seriesId: result.seriesId.toString(),
          isClaimed: result.isClaimed,
          claimedBy: result.claimedBy,
          claimedAt: result.claimedAt.toString()
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get brand series
  const getBrandSeries = useCallback(async (brandAddress: string): Promise<GetBrandSeriesResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const seriesIds = await contract.getBrandSeries(brandAddress);
      
      setLoading(false);
      return {
        success: true,
        data: seriesIds.map((id: bigint) => id.toString())
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get series claimers
  const getSeriesClaimers = useCallback(async (seriesId: number): Promise<GetSeriesClaimersResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const claimers = await contract.getSeriesClaimers(seriesId);
      
      setLoading(false);
      return { success: true, data: claimers };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Toggle series status
  const toggleSeriesStatus = useCallback(async (seriesId: number): Promise<TransactionResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(true);
      const tx = await contract.toggleSeriesStatus(seriesId);
      const receipt: TransactionReceipt = await tx.wait();
      
      setLoading(false);
      return { success: true, receipt };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get total series
  const getTotalSeries = useCallback(async (): Promise<GetTotalResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const total = await contract.totalSeries();
      
      setLoading(false);
      return { success: true, data: total.toString() };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get total NFTs minted
  const getTotalNFTsMinted = useCallback(async (): Promise<GetTotalResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const total = await contract.totalNFTsMinted();
      
      setLoading(false);
      return { success: true, data: total.toString() };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get token URI
  const getTokenURI = useCallback(async (tokenId: number): Promise<GetTokenURIResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const uri = await contract.tokenURI(tokenId);
      
      setLoading(false);
      return { success: true, data: uri };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get balance of address
  const balanceOf = useCallback(async (address: string): Promise<BalanceOfResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const balance = await contract.balanceOf(address);
      
      setLoading(false);
      return { success: true, data: balance.toString() };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  // Get owner of token
  const ownerOf = useCallback(async (tokenId: number): Promise<OwnerOfResult> => {
    setLoading(true);
    setError(null);
    try {
      const contract = await getContract(false);
      const owner = await contract.ownerOf(tokenId);
      
      setLoading(false);
      return { success: true, data: owner };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLoading(false);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [getContract]);

  return {
    loading,
    error,
    mintSeries,
    generateClaimLinks,
    claimNFT,
    readSeries,
    checkClaimLink,
    getBrandSeries,
    getSeriesClaimers,
    toggleSeriesStatus,
    getTotalSeries,
    getTotalNFTsMinted,
    getTokenURI,
    balanceOf,
    ownerOf
  };
};

export default useProductSeriesNFT;