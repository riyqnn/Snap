// wagmi.tsx
'use client';

import { WagmiProvider, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ReactNode } from 'react';

// 1. QueryClient
const queryClient = new QueryClient();

// 2. Konfigurasi wagmi tanpa WalletConnect
const config = createConfig(
  getDefaultConfig({
    appName: 'Snap',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    chains: [mainnet, sepolia],
    ssr: false,
  })
);


// 3. Provider
export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
