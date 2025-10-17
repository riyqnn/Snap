import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import BrandRegistryABI from '../contracts/BrandRegistry.json';

const CONTRACT_ADDRESS = '0x0ad5446e9cb34250d5ba369a9f232137099d334d';

interface Brand {
  brandName: string;
  logoURI: string;
  description: string;
  registeredAt: bigint;
  isVerified: boolean;
}

interface UseBrandRegistryReturn {
  // State
  loading: boolean;
  error: string | null;
  
  // Read functions
  brands: (address: string) => Promise<Brand | null>;
  isRegistered: (address: string) => Promise<boolean>;
  registeredBrands: (index: bigint) => Promise<string | null>;
  registrationFee: () => Promise<bigint | null>;
  owner: () => Promise<string | null>;
  getRegistrationFee: () => Promise<bigint | null>;
  isBrandRegistered: (address: string) => Promise<boolean>;
  getBrandName: (address: string) => Promise<string | null>;
  readBrand: (address: string) => Promise<Brand | null>;
  getAllBrands: () => Promise<string[]>;
  totalBrandsRegistered: () => Promise<bigint | null>;
  contractBalance: () => Promise<bigint | null>;
  
  // Write functions
  mintBrand: (brandName: string, logoURI: string, description: string) => Promise<ethers.ContractTransactionResponse | null>;
  updateRegistrationFee: (newFee: bigint) => Promise<ethers.ContractTransactionResponse | null>;
  withdraw: () => Promise<ethers.ContractTransactionResponse | null>;
  transferOwnership: (newOwner: string) => Promise<ethers.ContractTransactionResponse | null>;
  renounceOwnership: () => Promise<ethers.ContractTransactionResponse | null>;
}

export const useBrandRegistry = (): UseBrandRegistryReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    throw new Error('MetaMask not installed');
  };

  const getContract = async (needSigner = false) => {
    const provider = getProvider();
    if (needSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, BrandRegistryABI, signer);
    }
    return new ethers.Contract(CONTRACT_ADDRESS, BrandRegistryABI, provider);
  };

  // Read Functions
  const brands = async (address: string): Promise<Brand | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const brand = await contract.brands(address);
      return {
        brandName: brand.brandName,
        logoURI: brand.logoURI,
        description: brand.description,
        registeredAt: brand.registeredAt,
        isVerified: brand.isVerified,
      };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isRegistered = async (address: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const registered = await contract.isRegistered(address);
      return registered;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registeredBrands = async (index: bigint): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const brandAddress = await contract.registeredBrands(index);
      return brandAddress;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registrationFee = async (): Promise<bigint | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const fee = await contract.registrationFee();
      return fee;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const owner = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const ownerAddress = await contract.owner();
      return ownerAddress;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRegistrationFee = async (): Promise<bigint | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const fee = await contract.getRegistrationFee();
      return fee;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isBrandRegistered = async (address: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const isRegistered = await contract.isBrandRegistered(address);
      return isRegistered;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBrandName = async (address: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const brandName = await contract.getBrandName(address);
      return brandName;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const readBrand = async (address: string): Promise<Brand | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const brand = await contract.readBrand(address);
      return {
        brandName: brand.brandName,
        logoURI: brand.logoURI,
        description: brand.description,
        registeredAt: brand.registeredAt,
        isVerified: brand.verified,
      };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAllBrands = async (): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const brands = await contract.getAllBrands();
      return brands;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const totalBrandsRegistered = async (): Promise<bigint | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const total = await contract.totalBrandsRegistered();
      return total;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const contractBalance = async (): Promise<bigint | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract();
      const balance = await contract.contractBalance();
      return balance;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Write Functions
  const mintBrand = async (
    brandName: string,
    logoURI: string,
    description: string
  ): Promise<ethers.ContractTransactionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract(true);
      const fee = await contract.getRegistrationFee();
      const tx = await contract.mintBrand(brandName, logoURI, description, {
        value: fee,
      });
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationFee = async (
    newFee: bigint
  ): Promise<ethers.ContractTransactionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract(true);
      const tx = await contract.updateRegistrationFee(newFee);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (): Promise<ethers.ContractTransactionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract(true);
      const tx = await contract.withdraw();
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const transferOwnership = async (
    newOwner: string
  ): Promise<ethers.ContractTransactionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract(true);
      const tx = await contract.transferOwnership(newOwner);
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const renounceOwnership = async (): Promise<ethers.ContractTransactionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const contract = await getContract(true);
      const tx = await contract.renounceOwnership();
      await tx.wait();
      return tx;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    brands,
    isRegistered,
    registeredBrands,
    registrationFee,
    owner,
    getRegistrationFee,
    isBrandRegistered,
    getBrandName,
    readBrand,
    getAllBrands,
    totalBrandsRegistered,
    contractBalance,
    mintBrand,
    updateRegistrationFee,
    withdraw,
    transferOwnership,
    renounceOwnership,
  };
};

// Hook untuk mendengarkan events
export const useBrandRegistryEvents = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const setupEventListeners = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          BrandRegistryABI,
          provider
        );

        // Listen to BrandRegistered event
        contract.on('BrandRegistered', (
          brandAddress: string, 
          brandName: string, 
          logoURI: string, 
          description: string, 
          fee: bigint, 
          timestamp: bigint
        ) => {
          setEvents((prev) => [
            ...prev,
            {
              type: 'BrandRegistered',
              brandAddress,
              brandName,
              logoURI,
              description,
              fee,
              timestamp,
            },
          ]);
        });

        // Listen to RegistrationFeeUpdated event
        contract.on('RegistrationFeeUpdated', (oldFee: bigint, newFee: bigint) => {
          setEvents((prev) => [
            ...prev,
            {
              type: 'RegistrationFeeUpdated',
              oldFee,
              newFee,
            },
          ]);
        });

        return () => {
          contract.removeAllListeners();
        };
      }
    };

    setupEventListeners();
  }, []);

  return { events };
};