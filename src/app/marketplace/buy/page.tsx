'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { ethers } from 'ethers';
import { MARKETPLACE_ABI } from '@/config/abi';
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

const NATIVE_TOKEN = '0x0000000000000000000000000000000000000000';

const BuyNFTPage = () => {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  
  const listingId = searchParams.get('listingId');

  const { data: listing, isLoading: isLoadingListing } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getListing',
    args: listingId ? [BigInt(listingId)] : undefined,
    query: {
      enabled: Boolean(listingId),
    }
  });

  const { data, error: writeError, isPending: isBuying, writeContract } = useWriteContract();

  useEffect(() => {
    if (writeError) {
      console.error('Write error:', writeError);
      setError(writeError.message || 'Failed to buy NFT');
    }
  }, [writeError]);

  useEffect(() => {
    if (data) {
      setSuccess('Successfully purchased NFT!');
    }
  }, [data]);

  const handleBuy = async () => {
    if (!address || !listingId || !listing || !quantity) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      const typedListing = listing as unknown as Listing;
      const quantityBigInt = BigInt(quantity);
      const totalPrice = typedListing.pricePerToken * quantityBigInt;
      const isNativeToken = typedListing.currency.toLowerCase() === NATIVE_TOKEN.toLowerCase();

      console.log("Buy details:", {
        listingId: listingId,
        buyFor: address,
        quantity: quantity,
        currency: typedListing.currency,
        pricePerToken: typedListing.pricePerToken.toString(),
        totalPrice: totalPrice.toString(),
        isNativeToken: isNativeToken
      });

      if (!isNativeToken) {
        setError('Only native token (HBAR) purchases are supported');
        return;
      }

      writeContract({
        address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'buyFromListing',
        args: [
          BigInt(listingId),
          address as `0x${string}`,
          quantityBigInt,
          NATIVE_TOKEN as `0x${string}`,
          totalPrice
        ],
        value: totalPrice,
        gas: BigInt(500000)
      });
    } catch (err) {
      console.error('Buy error:', err);
      setError(err instanceof Error ? err.message : 'Failed to buy NFT');
    }
  };

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto">
          {isLoadingListing ? (
            <div>Loading listing...</div>
          ) : (
            <div>Listing not found</div>
          )}
        </div>
      </Layout>
    );
  }

  const typedListing = listing as unknown as Listing;
  const isNativeToken = typedListing.currency.toLowerCase() === NATIVE_TOKEN.toLowerCase();
  const totalPrice = typedListing.pricePerToken * BigInt(quantity || '1');

  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Buy NFT</h1>

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

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
            <div className="space-y-2">
              <p>Token ID: {typedListing.tokenId.toString()}</p>
              <p>Price per token: {ethers.formatEther(typedListing.pricePerToken)} {isNativeToken ? 'HBAR' : 'Tokens'}</p>
              <p>Available quantity: {typedListing.quantity.toString()}</p>
              <p>Seller: {typedListing.listingCreator}</p>
              <p>Currency: {isNativeToken ? 'HBAR (Native Token)' : typedListing.currency}</p>
              <p>Total Price: {ethers.formatEther(totalPrice)} HBAR</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Purchase</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity to buy
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={typedListing.quantity.toString()}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  Total Price: {ethers.formatEther(totalPrice)} {isNativeToken ? 'HBAR' : 'Tokens'}
                </p>
              </div>

              <button
                onClick={handleBuy}
                disabled={isBuying || !isNativeToken}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isBuying ? 'Processing...' : isNativeToken ? 'Buy Now' : 'Only HBAR purchases supported'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyNFTPage; 