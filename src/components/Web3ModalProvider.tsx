'use client';


import { cookieStorage, createStorage } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { hederaTestnet } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// Get projectId from WalletConnect Cloud
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
    throw new Error('Project ID is not defined');
}

// Configure networks
const networks = [hederaTestnet];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
});

// Get wagmi config from adapter
export const config = wagmiAdapter.wagmiConfig;

// Create AppKit instance
createAppKit({
    projectId,
    metadata: {
        name: 'Hedera Marketplace',
        description: 'Marketplace for Hedera NFTs',
        url: 'https://localhost:3000',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    },
    adapters: [wagmiAdapter],
    networks,
    defaultNetwork: networks[0],
    themeMode: 'light'
});

const queryClient = new QueryClient();

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                    {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}