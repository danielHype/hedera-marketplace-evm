import { useWriteContract, useReadContract } from 'wagmi';
import { MARKETPLACE_ABI } from '@/config/abi';

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

export function useGetAllListings() {
    const { data, isLoading, write: getAllListings } = useWriteContract({
    abi: MARKETPLACE_ABI,
    functionName: 'getAllListings' as any,
  });

  return {
    getAllListings,
    isLoading,
  };
}

export function useGetListing() {
  const { data: listing, isLoading, isError } = useReadContract({
    abi: MARKETPLACE_ABI,
    functionName: 'getListing' as any,
  }) as { data: Listing | undefined; isLoading: boolean; isError: boolean };

  return {
    listing,
    isLoading,
    isError,
  };
}

export function useBuyListing() {
    const { data, isLoading, isSuccess, write: buyFromListing, hash } = useWriteContract({
    abi: MARKETPLACE_ABI,
    functionName: 'buyFromListing' as any,
  });

  return {
    buyFromListing,
    isLoading,
    isSuccess,
    hash,
  };
}

export function useCancelListing() {
    const { data, isLoading, isSuccess, write: cancelListing, hash } = useWriteContract({
    abi: MARKETPLACE_ABI,
    functionName: 'cancelListing' as any,
  });

  return {
    cancelListing,
    isLoading,
    isSuccess,
    hash,
  };
}

export function useCreateListing() {
  const { data, isPending, isSuccess, writeContract } = useWriteContract();

  const createListing = async (params: {
    address: `0x${string}`,
    abi: typeof MARKETPLACE_ABI,
    functionName: 'createListing',
    args: [ListingParams]
  }) => {
    return writeContract(params);
  };

  return {
    createListing,
    isLoading: isPending,
    isSuccess,
    hash: data
  };
}

interface ListingParams {
  assetContract: `0x${string}`,
  tokenId: bigint,
  quantity: bigint,
  currency: `0x${string}`,
  pricePerToken: bigint,
  startTimestamp: bigint,
  endTimestamp: bigint,
  reserved: boolean
} 