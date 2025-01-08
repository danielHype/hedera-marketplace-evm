export const CONTRACT_ADDRESS = '0x84f3123d1254013D3feEF9Af1Eebbc6e2466d5c8';

// Chain ID 296 (0x128) in hex format with 0x prefix and padded to 32 bytes
export const NETWORK_CONFIG = {
    chainId: '0x128',
    chainName: 'Hedera Testnet',
    nativeCurrency: {
        name: 'HBAR',
        symbol: 'HBAR',
        decimals: 18
    },
    rpcUrls: ['https://testnet.hashio.io/api'],
    blockExplorerUrls: ['https://hashscan.io/testnet']
}; 