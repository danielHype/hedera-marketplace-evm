'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { useCreateListing } from '@/utils/contractFunctions';
import { ethers } from 'ethers';
import { MARKETPLACE_ABI } from '@/config/abi';
import { useNFTApproval } from '@/hooks/useNFTApproval';

const ListNFTPage = () => {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const [price, setPrice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Get tokenId and contract from URL params
  const tokenId = searchParams.get('tokenId');
  const contractAddress = searchParams.get('contract');

  const {
    createListing,
    isLoading: isCreatingListing,
    isSuccess: isListingCreated,
    hash: listingHash
  } = useCreateListing();
  

  const {
    approve,
    isApproving,
    isApproved,
    approvalHash
  } = useNFTApproval(contractAddress as string);

  const handleCreateListing = async () => {
    if (!address || !tokenId || !contractAddress || !price) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setSuccess(''); // Clear any previous success messages
      console.log('Checking approval status:', isApproved);

      // Check and handle approval if needed
      if (!isApproved) {
        console.log('Approval needed, initiating approval...');
        try {
          await approve();
          setSuccess('Approval transaction submitted. Please wait for confirmation...');
          return;
        } catch (err) {
          console.error('Approval failed:', err);
          setError('Failed to approve marketplace. Please try again.');
          return;
        }
      }

      console.log('NFT is approved, creating listing...');
      const priceInWei = ethers.parseEther(price);
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + (30 * 24 * 60 * 60); // 30 days from now

      const listingParams = {
        assetContract: contractAddress as `0x${string}`,
        tokenId: BigInt(tokenId),
        quantity: BigInt(1),
        currency: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Zero address for native token
        pricePerToken: priceInWei,
        startTimestamp: BigInt(startTime),
        endTimestamp: BigInt(endTime),
        reserved: false
      };

      console.log('Creating listing with params:', listingParams);

      await createListing({
        address: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'createListing',
        args: [listingParams]
      });

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    }
  };

  // Update button text based on state
  const getButtonText = () => {
    if (isApproving) return 'Approving...';
    if (isCreatingListing) return 'Creating Listing...';
    if (!isApproved) return 'Approve Marketplace';
    return 'List NFT';
  };

  // Add this useEffect to track the listing status
  useEffect(() => {
    if (isListingCreated && listingHash) {
      console.log('Listing created:', listingHash);
      setSuccess(`Listing created successfully! Transaction: ${listingHash}`);
    }
  }, [isListingCreated, listingHash]);

  // Watch for approval completion
  useEffect(() => {
    if (approvalHash && !isApproved) {
      setSuccess('Approval pending... Please wait for the transaction to complete');
    }
  }, [approvalHash, isApproved]);

  return (
   <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">List NFT for Sale</h1>

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
          <div className="bg-gray-100 p-6 rounded-lg">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">NFT Details</h2>
              <p><strong>Token ID:</strong> {tokenId}</p>
              <p className="truncate"><strong>Contract:</strong> {contractAddress}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (in HBAR)
                </label>
                <input
                  type="number"
                  step="0.000000001"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter price in HBAR"
                />
              </div>

              <button
                onClick={handleCreateListing}
                disabled={isCreatingListing || isApproving || !price}
                className={`w-full p-3 rounded text-white font-bold ${
                  isCreatingListing || isApproving || !price
                    ? 'bg-blue-300'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {getButtonText()}
              </button>
            </div>
          </div>

          {isListingCreated && (
            <div className="mt-6 p-4 bg-green-50 rounded">
              <h3 className="font-semibold mb-2">Listing Created!</h3>
              <p className="text-sm break-all">
                Transaction Hash: {listingHash}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ListNFTPage; 