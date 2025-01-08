# Game Items Marketplace

A decentralized marketplace for trading game items built with Next.js, Wagmi, and Hedera smart contracts.

## Features

- Connect wallet using WalletConnect
- View game item listings
- Create new listings for game items
- Buy items from existing listings
- Cancel your own listings
- Real-time transaction status updates
- Responsive UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v18 or higher)
- npm or yarn
- A WalletConnect Project ID (get one from [WalletConnect Cloud](https://cloud.walletconnect.com/))
- A wallet compatible with WalletConnect (e.g., MetaMask, Trust Wallet)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/danielHype/hedera-marketplace-demo.git
cd hedera-marketplace-demo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your WalletConnect Project ID:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id_here"
```

## Smart Contract

The marketplace uses an ERC1155-based smart contract deployed at: `0xb1b78577865244f2e20354606c4fdf245e28d83b`

### Compiling the Contract

To compile the smart contract:
```bash
npm run compile
# or
yarn compile
```

This will:
1. Compile the Solidity contract
2. Generate the bytecode
3. Save the bytecode to `src/contracts/bytecode.ts`

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   └── deploy/            # Contract deployment page
├── src/
│   ├── components/        # React components
│   ├── contracts/         # Smart contract files
│   └── utils/             # Utility functions
├── public/                # Static files
└── ...config files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run compile` - Compile smart contract
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contract Functions

### createListing
Create a new listing for a game item:
```typescript
createListing({
    args: [tokenId, amount, price]
})
```

### getListing
Get details of an existing listing:
```typescript
getListing(listingId)
```

### buyListing
Purchase an item from a listing:
```typescript
buyListing({
    args: [listingId],
    value: price
})
```

### cancelListing
Cancel an active listing:
```typescript
cancelListing({
    args: [listingId]
})
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/)
- [WalletConnect](https://walletconnect.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
# hedera-marketplace-evm
# hedera-marketplace-evm
