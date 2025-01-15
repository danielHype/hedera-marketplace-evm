export const HEDERA_TESTNET = {
  chainId: 296,
  name: 'Hedera Testnet',
  network: 'testnet',
  nativeCurrency: {
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api']
    },
    public: {
      http: ['https://testnet.hashio.io/api']
    }
  },
  blockExplorers: {
    default: {
      name: 'HashScan',
      url: 'https://hashscan.io/testnet'
    }
  },
  testnet: true
}; 