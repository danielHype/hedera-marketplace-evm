'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWatchContractEvent, usePublicClient } from 'wagmi';
import Header from '@/components/Header';
import { FACTORY_ABI } from '@/contracts/bytecode';
import { parseAbiItem, decodeEventLog } from 'viem';

const NFT_ABI = [
  {
    inputs: [{ name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  }
] as const;

const NFTPage = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [baseURI, setBaseURI] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [existingAddress, setExistingAddress] = useState('');
  const [mode, setMode] = useState<'create' | 'existing'>('create');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExistingContract = () => {
    try {
      if (!existingAddress) {
        throw new Error('Please enter a contract address');
      }
      if (!existingAddress.startsWith('0x')) {
        throw new Error('Address must start with 0x');
      }
      setContractAddress(existingAddress as `0x${string}`);
      setSuccess(`Connected to NFT contract: ${existingAddress}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid address');
    }
  };

  // Deploy NFT through factory
  const { 
    writeContract: deployNFT,
    isPending: isDeploying,
    isSuccess: isDeployed,
    data: hash
  } = useWriteContract();

  // Watch for deployment transaction receipt
  useEffect(() => {
    if (hash) {
      console.log('Deployment transaction hash:', hash);
      
      const watchTransaction = async () => {
        try {
          const receipt = await publicClient.waitForTransactionReceipt({ hash });
          console.log('Transaction receipt:', receipt);

          // Find the NFTContractDeployed event in the logs
          const deployEvent = receipt.logs.find(log => {
            try {
              const event = decodeEventLog({
                abi: FACTORY_ABI,
                data: log.data,
                topics: log.topics,
              });
              return event.eventName === 'NFTContractDeployed';
            } catch {
              return false;
            }
          });

          if (deployEvent) {
            console.log('Found deployment event:', deployEvent);
            const decodedEvent = decodeEventLog({
              abi: FACTORY_ABI,
              data: deployEvent.data,
              topics: deployEvent.topics,
            });
            console.log('Decoded event:', decodedEvent);

            const nftContract = decodedEvent.args.nftContract as `0x${string}`;
            setContractAddress(nftContract);
            setSuccess(`NFT Contract deployed successfully!\nContract Address: ${nftContract}`);
          } else {
            console.log('No deployment event found in logs');
            setError('Contract deployed but unable to find contract address');
          }
        } catch (err) {
          console.error('Error watching transaction:', err);
          setError('Error processing deployment transaction');
        }
      };

      watchTransaction();
    }
  }, [hash, publicClient]);

  // Debug log for factory address
  useEffect(() => {
    console.log('Factory address:', process.env.NEXT_PUBLIC_FACTORY_ADDRESS);
  }, []);

  // Mint NFT with transaction watching
  const { 
    writeContract: mintNFT,
    isPending: isMinting,
    data: mintHash
  } = useWriteContract();

  // Watch mint transaction
  useEffect(() => {
    if (mintHash) {
      console.log('Mint transaction hash:', mintHash);
      
      const watchMintTransaction = async () => {
        try {
          const receipt = await publicClient.waitForTransactionReceipt({ hash: mintHash });
          console.log('Mint receipt:', receipt);
          
          if (receipt.status === 'success') {
            setSuccess(`NFT minted successfully!\nTransaction Hash: ${mintHash}`);
          }
        } catch (err) {
          console.error('Error watching mint transaction:', err);
          setError('Error processing mint transaction');
        }
      };

      watchMintTransaction();
    }
  }, [mintHash, publicClient]);

  const handleDeploy = async () => {
    if (!name || !symbol || !baseURI) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      console.log('Starting deployment with args:', { name, symbol, baseURI });
      
      deployNFT({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'deployNFT',
        args: [name, symbol, baseURI],
      });
    } catch (err) {
      console.error('Deployment error:', err);
      setError(err instanceof Error ? err.message : 'Failed to deploy NFT');
    }
  };

  const handleMint = async () => {
    if (!contractAddress) {
      setError('Please deploy a contract first');
      return;
    }

    try {
      setError('');
      mintNFT({
        address: contractAddress as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [address!],
      });
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">NFT Contract Interaction</h1>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 bg-green-100 text-green-700 rounded whitespace-pre-line">
            {success}
          </div>
        )}

        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('create')}
              className={`px-4 py-2 rounded ${
                mode === 'create'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Create New Contract
            </button>
            <button
              onClick={() => setMode('existing')}
              className={`px-4 py-2 rounded ${
                mode === 'existing'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Use Existing Contract
            </button>
          </div>

          {mode === 'create' ? (
            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Deploy New NFT Contract</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="NFT Name"
                  className="w-full p-2 border rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="NFT Symbol"
                  className="w-full p-2 border rounded"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Base URI"
                  className="w-full p-2 border rounded"
                  value={baseURI}
                  onChange={(e) => setBaseURI(e.target.value)}
                />
                <button
                  onClick={handleDeploy}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={isDeploying || !name || !symbol || !baseURI}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Contract'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Use Existing NFT Contract</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Contract Address (0x...)"
                  className="w-full p-2 border rounded"
                  value={existingAddress}
                  onChange={(e) => setExistingAddress(e.target.value)}
                />
                <button
                  onClick={handleExistingContract}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                  disabled={!existingAddress}
                >
                  Connect to Contract
                </button>
              </div>
            </div>
          )}
        </div>

        {contractAddress && (
          <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Contract Details</h2>
            <div className="space-y-2 mb-6">
              <p><strong>Contract Address:</strong> {contractAddress}</p>
            </div>
            <h3 className="text-lg font-semibold mb-2">Mint NFT</h3>
            <button
              onClick={handleMint}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
              disabled={isMinting}
            >
              {isMinting ? 'Minting...' : 'Mint NFT'}
            </button>
            {mintHash && (
              <div className="mt-4 p-4 bg-green-50 rounded">
                <p className="text-sm text-green-700">
                  Transaction Hash: {mintHash}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NFTPage; 