import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { ERC721_ABI } from '@/config/abi';

export function useNFTApproval(contractAddress: string) {
  const { address } = useAccount();

  const { 
    writeContract: approve,
    isLoading: isApproving,
    data: approvalData
  } = useWriteContract();

  const { data: isApproved } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: ERC721_ABI,
    functionName: 'isApprovedForAll',
    args: [address!, process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`],
    enabled: Boolean(address && contractAddress)
  });

  const handleApprove = async () => {
    if (!contractAddress || !address) return;
    
    try {
      await approve({
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'setApprovalForAll',
        args: [process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT as `0x${string}`, true]
      });
    } catch (err) {
      console.error('Approval error:', err);
      throw err;
    }
  };

  return {
    approve: handleApprove,
    isApproving,
    isApproved,
    approvalHash: approvalData?.hash
  };
} 