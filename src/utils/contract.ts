import { ethers } from 'ethers';
import { MARKETPLACE_ABI } from '../config/abi';
import { CONTRACT_ADDRESS } from '../config/contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const getContract = async (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, MARKETPLACE_ABI, signer);
};

export const createListing = async (
  signer: ethers.Signer,
  assetContract: string,
  tokenId: number,
  quantity: number,
  currency: string,
  pricePerToken: number,
  startTime: number,
  endTime: number,
  reserved: boolean = false
) => {
  const contract = await getContract(signer);
  const params = {
    assetContract,
    tokenId,
    quantity,
    currency,
    pricePerToken,
    startTimestamp: startTime,
    endTimestamp: endTime,
    reserved
  };

  const tx = await contract.createListing(params);
  return tx.wait();
};

export const buyFromListing = async (
  signer: ethers.Signer,
  listingId: number,
  quantity: number,
  currency: string,
  totalPrice: number
) => {
  const contract = await getContract(signer);
  const address = await signer.getAddress();
  
  const tx = await contract.buyFromListing(
    listingId,
    address,
    quantity,
    currency,
    totalPrice,
    { value: currency === ethers.ZeroAddress ? totalPrice : 0 }
  );
  return tx.wait();
};

export const cancelListing = async (
  signer: ethers.Signer,
  listingId: number
) => {
  const contract = await getContract(signer);
  const tx = await contract.cancelListing(listingId);
  return tx.wait();
};

export const getListing = async (
  signer: ethers.Signer,
  listingId: number
) => {
  const contract = await getContract(signer);
  return contract.getListing(listingId);
}; 