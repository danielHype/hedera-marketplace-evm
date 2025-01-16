'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, http, defineChain } from 'viem';
import { Layout } from '@/components/Layout';
import Link from 'next/link';

interface NFT {
  tokenId: number;
  contractAddress: string;
  uri?: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
  };
}

const NFT_ABI = [
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  }
] as const;

const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  network: 'hedera-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: { 
      http: ['https://hedera-testnet.rpc.thirdweb.com'] 
    },
    public: { 
      http: ['https://hedera-testnet.rpc.thirdweb.com'] 
    },
  },
});

const customPublicClient = createPublicClient({
  chain: hederaTestnet,
  transport: http('https://hedera-testnet.rpc.thirdweb.com'),
});

const PortfolioPage = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMetadata = async (uri: string) => {
    try {
      const url = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const response = await fetch(url);
      const metadata = await response.json();
      return metadata;
    } catch (err) {
      console.error('Error fetching metadata:', err);
      return null;
    }
  };

  const fetchNFTsForContract = async (contractAddress: string) => {
    try {
      console.log('Fetching NFTs for contract:', contractAddress);
      
      const nftList: NFT[] = [];
      const MAX_TOKEN_ID = 20; // Check first 20 token IDs
      
      // Check each token ID from 0 to MAX_TOKEN_ID
      for (let i = 0; i < MAX_TOKEN_ID; i++) {
        try {
          const owner = await customPublicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: NFT_ABI,
            functionName: 'ownerOf',
            args: [BigInt(i)],
          });

          console.log(`Token ${i} owner:`, owner);

          if (owner.toLowerCase() === address?.toLowerCase()) {
            let uri;
            try {
              uri = await customPublicClient.readContract({
                address: contractAddress as `0x${string}`,
                abi: NFT_ABI,
                functionName: 'tokenURI',
                args: [BigInt(i)],
              });

              console.log(`Token ${i} URI:`, uri);
              const metadata = uri ? await fetchMetadata(uri as string) : null;

              nftList.push({
                tokenId: i,
                contractAddress,
                uri: uri as string,
                metadata
              });
            } catch (err) {
              console.log('No URI available for token:', i);
              nftList.push({
                tokenId: i,
                contractAddress
              });
            }
          }
        } catch (err) {
          // Token doesn't exist or other error, continue to next token
          console.log(`Token ${i} not found or other error`);
          continue;
        }
      }

      console.log('Found NFTs:', nftList);
      return nftList;
    } catch (err) {
      console.error('Error fetching NFTs for contract:', err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllNFTs = async () => {
      if (!address) return;

      setLoading(true);
      setError('');

      try {
        // For testing, let's hardcode the contract address
        const testContract = '0x615DFE73D29ed828FE9968231E1E985F10713543';
          // second contract: 0xd3c87b49F84868D604b0d40161CA4Fb2186f405b
        console.log('Checking contract:', testContract);
        
        const contractNFTs = await fetchNFTsForContract(testContract);
        setNfts(contractNFTs);
        
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to load NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, [address]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My NFT Portfolio</h1>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p>Loading your NFTs...</p>
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div key={`${nft.contractAddress}-${nft.tokenId}`} 
                   className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="mb-4">
                  {nft.metadata?.image && (
                    <img 
                      src={nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                      alt={nft.metadata?.name || `NFT ${nft.tokenId}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {nft.metadata?.name || `NFT #${nft.tokenId}`}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {nft.metadata?.description || 'No description available'}
                  </p>
                  <div className="pt-2">
                    <p className="text-sm font-medium">Token ID: {nft.tokenId}</p>
                    <p className="text-xs text-gray-500 truncate">
                      Contract: {nft.contractAddress}
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link
                      href={`/marketplace/list?tokenId=${nft.tokenId}&contract=${nft.contractAddress}`}
                      className="block w-full bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      List for Sale
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No NFTs found in your wallet.</p>
          </div>
        )}
      </div>
      </Layout>
  );
};

export default PortfolioPage; 