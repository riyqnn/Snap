import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BrandRegistryABI from '../contracts/IBrandRegistry.json';

interface UseBrandRegistryReturn {
  isRegistered: boolean | null;
  loading: boolean;
  error: string | null;
  checkIsRegistered: (address: string) => Promise<void>;
}

/**
 * Hook untuk berinteraksi dengan Brand Registry Contract
 * @param contractAddress - Address dari contract BrandRegistry
 * @param provider - Ethers provider (optional, akan menggunakan window.ethereum jika tidak ada)
 */
export function useIBrandRegistry(
  contractAddress: string,
  provider?: ethers.Provider
): UseBrandRegistryReturn {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (provider) return provider;
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error('No provider available');
  };

  const checkIsRegistered = async (address: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const ethersProvider = getProvider();
      const contract = new ethers.Contract(
        contractAddress,
        BrandRegistryABI,
        ethersProvider
      );

      const result = await contract.isRegistered(address);
      setIsRegistered(result);
    } catch (err: any) {
      setError(err.message || 'Failed to check registration status');
      console.error('Error checking registration:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistered,
    loading,
    error,
    checkIsRegistered,
  };
}

/**
 * Hook untuk auto-check registration status saat component mount
 * @param contractAddress - Address dari contract BrandRegistry
 * @param addressToCheck - Address yang ingin dicek
 * @param provider - Ethers provider (optional)
 */
export function useIsRegistered(
  contractAddress: string,
  addressToCheck?: string,
  provider?: ethers.Provider
) {
  const { isRegistered, loading, error, checkIsRegistered } = useIBrandRegistry(
    contractAddress,
    provider
  );

  useEffect(() => {
    if (addressToCheck && ethers.isAddress(addressToCheck)) {
      checkIsRegistered(addressToCheck);
    }
  }, [addressToCheck, contractAddress]);

  return { isRegistered, loading, error, refetch: checkIsRegistered };
}

/**
 * Hook untuk check multiple addresses sekaligus
 * @param contractAddress - Address dari contract BrandRegistry
 * @param addresses - Array of addresses yang ingin dicek
 * @param provider - Ethers provider (optional)
 */
export function useMultipleIsRegistered(
  contractAddress: string,
  addresses: string[],
  provider?: ethers.Provider
) {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkMultiple = async () => {
    if (!addresses.length) return;

    setLoading(true);
    setError(null);

    try {
      const ethersProvider = provider || new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        BrandRegistryABI,
        ethersProvider
      );

      const promises = addresses.map(async (addr) => {
        if (!ethers.isAddress(addr)) return [addr, false];
        const result = await contract.isRegistered(addr);
        return [addr, result];
      });

      const allResults = await Promise.all(promises);
      const resultsMap = Object.fromEntries(allResults);
      setResults(resultsMap);
    } catch (err: any) {
      setError(err.message || 'Failed to check registration status');
      console.error('Error checking multiple registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMultiple();
  }, [JSON.stringify(addresses), contractAddress]);

  return { results, loading, error, refetch: checkMultiple };
}