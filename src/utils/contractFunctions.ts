import { type Address } from 'viem';
import { useContractRead, useContractWrite } from 'wagmi';
import { type Config } from 'wagmi';

const CONTRACT_ADDRESS = '0xb1b78577865244f2e20354606c4fdf245e28d83b' as const;

// Define the Listing type to avoid using 'any'
export type Listing = {
    seller: Address;
    tokenId: bigint;
    amount: bigint;
    price: bigint;
    active: boolean;
};

const MARKETPLACE_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "createListing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "getListing",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    }
                ],
                "internalType": "struct GameItemsMarketplace.Listing",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "buyListing",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "listingId",
                "type": "uint256"
            }
        ],
        "name": "cancelListing",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;

const contractConfig = {
    address: CONTRACT_ADDRESS,
    abi: MARKETPLACE_ABI,
} as const;

export function useCreateListing() {
    const { data: hash, isPending, isSuccess, writeContract } = useContractWrite({
        ...contractConfig,
        functionName: 'createListing',
    });

    return {
        createListing: writeContract,
        isLoading: isPending,
        isSuccess,
        hash
    };
}

export function useGetListing(listingId: number) {
    const { data, isLoading, isError } = useContractRead({
        ...contractConfig,
        functionName: 'getListing',
        args: [BigInt(listingId)],
    }) as { data: Listing | undefined; isLoading: boolean; isError: boolean };

    return {
        listing: data,
        isLoading,
        isError
    };
}

export function useBuyListing() {
    const { data: hash, isPending, isSuccess, writeContract } = useContractWrite({
        ...contractConfig,
        functionName: 'buyListing',
    });

    return {
        buyListing: writeContract,
        isLoading: isPending,
        isSuccess,
        hash
    };
}

export function useCancelListing() {
    const { data: hash, isPending, isSuccess, writeContract } = useContractWrite({
        ...contractConfig,
        functionName: 'cancelListing',
    });

    return {
        cancelListing: writeContract,
        isLoading: isPending,
        isSuccess,
        hash
    };
} 