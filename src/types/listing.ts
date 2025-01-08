export interface Listing {
    listingId: number;
    tokenId: number;
    quantity: number;
    pricePerToken: number;
    startTimestamp: number;
    endTimestamp: number;
    listingCreator: string;
    assetContract: string;
    currency: string;
    tokenType: number;
    status: number;
    reserved: boolean;
} 