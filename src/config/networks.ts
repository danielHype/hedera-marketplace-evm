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
      http: ['https://296.rpc.thirdweb.com']
    },
    public: {
      http: ['https://296.rpc.thirdweb.com']
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