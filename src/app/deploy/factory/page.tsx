'use client';

import { useState } from 'react';
import { deployGameItems } from '../../../utils/deploy';
import { Layout } from '@/components/Layout';
import { useAppKitAccount } from '@reown/appkit/react';
import { useSignMessage, useDeployContract } from 'wagmi';
import { type Address } from 'viem';

export default function DeployFactoryPage() {
    const { address, isConnected } = useAppKitAccount();
    const { signMessageAsync } = useSignMessage();
    const { deployContractAsync } = useDeployContract();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleDeploy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !address) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // First sign the deployment message
            const message = 'Deploy NFT Factory contract';
            await signMessageAsync({ message, account: address as Address });

            // Then deploy the contract
            const hash = await deployContractAsync({
                abi: deployGameItems.abi,
                bytecode: deployGameItems.bytecode as `0x${string}`,
                account: address as Address,
                args: []
            });

            console.log('Factory deployed successfully!');
            setSuccess(`NFT Factory contract deployed successfully! Transaction hash: ${hash}`);
        } catch (err) {
            console.error('Deployment error:', err);
            let errorMessage = 'Failed to deploy contract';

            if (err instanceof Error) {
                if (err.message.includes('user rejected')) {
                    errorMessage = 'Transaction was rejected by user';
                } else if (err.message.includes('insufficient funds')) {
                    errorMessage = 'Insufficient funds to deploy contract';
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        
            <Layout>
            <main className="min-h-screen p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Deploy NFT Factory</h1>

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
                        <div className="p-6 border rounded-lg">
                            <h2 className="text-xl font-bold mb-4">Factory Contract Details</h2>
                            <p className="mb-4 text-gray-600">
                                This will deploy the NFT Factory contract that allows:
                            </p>
                            <ul className="list-disc pl-5 mb-6 space-y-2">
                                <li>Users to create their own NFT collections</li>
                                <li>Customizable NFT name and symbol</li>
                                <li>Configurable base URI for NFT metadata</li>
                                <li>Full ERC721 compatibility</li>
                            </ul>

                            <button
                                onClick={handleDeploy}
                                disabled={loading}
                                className={`w-full p-3 rounded text-white font-bold ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {loading ? 'Deploying...' : 'Deploy Factory'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-lg text-gray-600">Please connect your wallet to deploy the contract.</p>
                        </div>
                    )}
                </div>
            </main>
            </Layout>
    );
} 