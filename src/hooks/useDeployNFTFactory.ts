import { useContractWrite, useWaitForTransactionReceipt } from 'wagmi';
import { FACTORY_ABI, FACTORY_BYTECODE } from '../contracts/bytecode';

export function useDeployNFTFactory() {
    const { data: hash, isPending, isSuccess, writeContract } = useContractWrite({
        abi: FACTORY_ABI,
        bytecode: FACTORY_BYTECODE as `0x${string}`,
        functionName: 'constructor',
    });

    const { isLoading: isWaiting } = useWaitForTransactionReceipt({
        hash,
    });

    return {
        deploy: writeContract,
        isLoading: isPending || isWaiting,
        isSuccess,
        hash
    };
} 