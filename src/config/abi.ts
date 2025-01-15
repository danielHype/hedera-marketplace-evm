export const MARKETPLACE_ABI = [
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "assetContract",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "pricePerToken",
            "type": "uint256"
          },
          {
            "internalType": "uint128",
            "name": "startTimestamp",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "endTimestamp",
            "type": "uint128"
          },
          {
            "internalType": "bool",
            "name": "reserved",
            "type": "bool"
          }
        ],
        "internalType": "struct IDirectListings.ListingParameters",
        "name": "_params",
        "type": "tuple"
      }
    ],
    "name": "createListing",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "listingId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_listingId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_buyFor",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_currency",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_expectedTotalPrice",
        "type": "uint256"
      }
    ],
    "name": "buyFromListing",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_listingId",
        "type": "uint256"
      }
    ],
    "name": "cancelListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_listingId",
        "type": "uint256"
      }
    ],
    "name": "getListing",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "listingId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "quantity",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "pricePerToken",
            "type": "uint256"
          },
          {
            "internalType": "uint128",
            "name": "startTimestamp",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "endTimestamp",
            "type": "uint128"
          },
          {
            "internalType": "address",
            "name": "listingCreator",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "assetContract",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "currency",
            "type": "address"
          },
          {
            "internalType": "enum IDirectListings.TokenType",
            "name": "tokenType",
            "type": "uint8"
          },
          {
            "internalType": "enum IDirectListings.Status",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "reserved",
            "type": "bool"
          }
        ],
        "internalType": "struct IDirectListings.Listing",
        "name": "listing",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const ERC721_ABI = [
  {
    name: 'setApprovalForAll',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' }
    ],
    outputs: []
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const; 