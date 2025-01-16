'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ethers } from 'ethers';
import { MARKETPLACE_ABI } from '@/config/abi';
import Link from 'next/link';
import { Layout } from '@/components/Layout';

interface Listing {
  listingId: bigint;
  tokenId: bigint;
  quantity: bigint;
  pricePerToken: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
  listingCreator: string;
  assetContract: string;
  currency: string;
  tokenType: number;
  status: number;
  reserved: boolean;
}

const ListingsPage = () => {
  const { address } = useAccount();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([]);

  // First get total number of listings
  const { data: totalListings } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'totalListings',
  });

  // Then get all valid listings using the total
  const { data: allListings, isLoading: isLoadingListings, error: readError } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getAllValidListings',
    args: totalListings ? [BigInt(0), totalListings - BigInt(1)] : undefined,
    query: {
      enabled: Boolean(totalListings),
    }
  });

  const { data, error: writeError, isPending: isCancelling, writeContract } = useWriteContract();

  useEffect(() => {
    if (readError) {
      setError('Failed to load listings');
    }
  }, [readError]);

  useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Failed to cancel listing');
    }
  }, [writeError]);

  useEffect(() => {
    if (data) {
      setSuccess('Successfully cancelled listing');
    }
  }, [data]);

  useEffect(() => {
    if (allListings) {
      setListings(allListings as Listing[]);
    }
  }, [allListings]);

  const handleCancelListing = async (listingId: bigint) => {
    try {
      setError('');
      setSuccess('');
      
      writeContract({
        address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'cancelListing',
        args: [listingId],
        gas: BigInt(500000)
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel listing';
      setError(errorMessage);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">NFT Listings</h1>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        {isLoadingListings ? (
          <div>Loading listings...</div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.listingId.toString()} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Token ID: {listing.tokenId.toString()}</h3>
                  <p className="text-gray-600 truncate">Contract: {listing.assetContract}</p>
                </div>
                <div className="mb-4">
                  <p>Price: {ethers.formatEther(listing.pricePerToken)} HBAR</p>
                  <p>Quantity: {listing.quantity.toString()}</p>
                  <p>Status: {listing.status === 1 ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="flex gap-4">
                  <Link 
                    href={`/marketplace/buy?listingId=${listing.listingId}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View/Buy
                  </Link>
                  {address?.toLowerCase() === listing.listingCreator.toLowerCase() && (
                    <button
                      onClick={() => handleCancelListing(listing.listingId)}
                      disabled={isCancelling}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel Listing'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No listings found
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ListingsPage; 