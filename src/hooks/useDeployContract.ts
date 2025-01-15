import { useState, useEffect } from 'react';
import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import type { TransactionReceipt } from 'viem';
import { parseAbiItem } from 'viem';

// NFT Factory ABI
const FACTORY_ABI = [
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'symbol', type: 'string' },
      { name: 'baseURI', type: 'string' }
    ],
    name: 'deployNFT',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'nftContract', type: 'address' },
      { indexed: false, name: 'name', type: 'string' },
      { indexed: false, name: 'symbol', type: 'string' },
      { indexed: true, name: 'owner', type: 'address' }
    ],
    name: 'NFTContractDeployed',
    type: 'event'
  }
] as const;

// Calculate event signature
const EVENT_SIGNATURE = parseAbiItem(
  'event NFTContractDeployed(address indexed nftContract, string name, string symbol, address indexed owner)'
).signature;

interface UseDeployContractProps {
  constructorArgs: [string, string, string]; // [name, symbol, baseURI]
  onSuccess?: (data: { contractAddress: string }) => void;
}

export function useDeployContract({
  constructorArgs,
  onSuccess,
}: UseDeployContractProps) {
  const [error, setError] = useState<Error | null>(null);

  console.log('Factory Address:', process.env.NEXT_PUBLIC_FACTORY_ADDRESS);
  console.log('Constructor Args:', constructorArgs);

  const {
    write: deploy,
    data: deployData,
    isLoading: isDeploying,
    error: writeError
  } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'deployNFT',
    args: constructorArgs,
  });

  useEffect(() => {
    if (writeError) {
      console.error('Contract write error:', writeError);
      setError(writeError);
    }
  }, [writeError]);

  const { isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: deployData?.hash,
    onSuccess: (receipt: TransactionReceipt) => {
      console.log('Transaction receipt:', receipt);
      
      // Find the NFTContractDeployed event
      const deployEvent = receipt.logs.find(log => {
        console.log('Checking log:', log);
        console.log('Expected signature:', EVENT_SIGNATURE);
        return log.topics[0] === EVENT_SIGNATURE;
      });

      console.log('Deploy event:', deployEvent);

      if (deployEvent && onSuccess) {
        // The contract address is the first indexed parameter (topic[1])
        const contractAddress = deployEvent.topics[1];
        console.log('Deployed contract address:', contractAddress);
        onSuccess({ contractAddress: contractAddress as `0x${string}` });
      }
    },
    onError: (err: Error) => {
      console.error('Transaction error:', err);
      setError(err);
    },
  });

  return {
    deploy,
    isLoading: isDeploying || isWaiting,
    error,
  };
} 