'use client';

import { useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import Header from '../components/Header';
import { useCreateListing, useGetListing, useBuyListing, useCancelListing } from '../utils/contractFunctions';
import { parseEther, formatEther } from 'viem';

export default function HomePage() {
    const { address, isConnected } = useAppKitAccount();
    const [listingId, setListingId] = useState<number>(0);
    const [tokenId, setTokenId] = useState<number>(0);
    const [amount, setAmount] = useState<number>(0);
    const [price, setPrice] = useState<string>('0');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Contract hooks
    const { createListing, isLoading: isCreating, isSuccess: createSuccess } = useCreateListing();
    const { listing, isLoading: isLoadingListing } = useGetListing(listingId);
    const { buyListing, isLoading: isBuying, isSuccess: buySuccess } = useBuyListing();
    const { cancelListing, isLoading: isCanceling, isSuccess: cancelSuccess } = useCancelListing();

    // Clear success/error messages when success states change
    useEffect(() => {
        if (createSuccess || buySuccess || cancelSuccess) {
            setError('');
            setSuccess(
                createSuccess ? 'Listing created successfully!' :
                buySuccess ? 'Item purchased successfully!' :
                'Listing cancelled successfully!'
            );
        }
    }, [createSuccess, buySuccess, cancelSuccess]);

    const handleCreateListing = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !address || !createListing) return;

        try {
            await createListing({
                args: [BigInt(tokenId), BigInt(amount), parseEther(price)],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create listing');
        }
    };

    const handleBuyListing = async (id: number) => {
        if (!isConnected || !address || !listing || !buyListing) return;

        try {
            await buyListing({
                args: [BigInt(id)],
                value: listing.price,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to buy item');
        }
    };

    const handleCancelListing = async (id: number) => {
        if (!isConnected || !address || !cancelListing) return;

        try {
            await cancelListing({
                args: [BigInt(id)],
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel listing');
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold mb-8">Game Items Marketplace</h1>

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

                    {address ? (
                        <div className="space-y-8">
                            {/* Create Listing Form */}
                            <div className="p-6 border rounded-lg">
                                <h2 className="text-xl font-bold mb-4">Create New Listing</h2>
                                <form onSubmit={handleCreateListing} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Token ID</label>
                                        <input
                                            type="number"
                                            value={tokenId}
                                            onChange={(e) => setTokenId(Number(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Amount</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price (in ETH)</label>
                                        <input
                                            type="text"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full p-2 border rounded"
                                            pattern="^[0-9]*[.,]?[0-9]*$"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className={`w-full p-3 rounded text-white font-bold ${
                                            isCreating
                                                ? 'bg-blue-300'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    >
                                        {isCreating ? 'Creating...' : 'Create Listing'}
                                    </button>
                                </form>
                            </div>

                            {/* View Listing */}
                            <div className="p-6 border rounded-lg">
                                <h2 className="text-xl font-bold mb-4">View Listing</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Listing ID</label>
                                        <input
                                            type="number"
                                            value={listingId}
                                            onChange={(e) => setListingId(Number(e.target.value))}
                                            className="w-full p-2 border rounded"
                                            min="0"
                                        />
                                    </div>
                                    
                                    {isLoadingListing ? (
                                        <p>Loading listing...</p>
                                    ) : listing ? (
                                        <div className="space-y-2">
                                            <p><strong>Seller:</strong> {listing.seller}</p>
                                            <p><strong>Token ID:</strong> {Number(listing.tokenId)}</p>
                                            <p><strong>Amount:</strong> {Number(listing.amount)}</p>
                                            <p><strong>Price:</strong> {formatEther(listing.price)} ETH</p>
                                            <p><strong>Active:</strong> {listing.active ? 'Yes' : 'No'}</p>
                                            
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => handleBuyListing(listingId)}
                                                    disabled={isBuying || !listing.active}
                                                    className={`flex-1 p-3 rounded text-white font-bold ${
                                                        isBuying || !listing.active
                                                            ? 'bg-gray-300'
                                                            : 'bg-green-500 hover:bg-green-600'
                                                    }`}
                                                >
                                                    {isBuying ? 'Buying...' : 'Buy'}
                                                </button>
                                                
                                                {listing.seller === address && (
                                                    <button
                                                        onClick={() => handleCancelListing(listingId)}
                                                        disabled={isCanceling || !listing.active}
                                                        className={`flex-1 p-3 rounded text-white font-bold ${
                                                            isCanceling || !listing.active
                                                                ? 'bg-gray-300'
                                                                : 'bg-red-500 hover:bg-red-600'
                                                        }`}
                                                    >
                                                        {isCanceling ? 'Canceling...' : 'Cancel'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No listing found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-lg text-gray-600">Please connect your wallet to use the marketplace.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
} 