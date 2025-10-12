// wagmi.js
'use client'; // Pastikan ini adalah Client Component

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

// 1. Buat QueryClient
const queryClient = new QueryClient();

// 2. Buat konfigurasi wagmi
const config = createConfig(
  getDefaultConfig({
    // Wajib diisi
    appName: 'Your App Name',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Jaringan yang ingin didukung
    chains: [mainnet, sepolia],
    
    // Opsional
    ssr: true, // Jika menggunakan App Router di Next.js
  })
);

// 3. Ekspor komponen Provider
export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};