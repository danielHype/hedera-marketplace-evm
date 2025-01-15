import { http } from 'viem';
import { defineConfig } from '@wagmi/cli';
import { hedera } from 'viem/chains';

// Custom Hedera testnet configuration with thirdweb RPC
export const hederaTestnet = {
  ...hedera,
  id: 296,
  name: 'Hedera Testnet',
  network: 'testnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://296.rpc.thirdweb.com'],
    },
    public: {
      http: ['https://296.rpc.thirdweb.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashScan',
      url: 'https://hashscan.io/testnet',
    },
  },
  testnet: true,
};

export const config = defineConfig({
  chains: [hederaTestnet],
  transports: {
    [hederaTestnet.id]: http('https://296.rpc.thirdweb.com'),
  },
}); 