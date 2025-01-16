'use client';

import { Layout } from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to NFT Marketplace</h1>
        
        <div className="grid gap-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                Welcome to our NFT marketplace on the Hedera network. Here you can:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Deploy your own NFT contract</li>
                <li>Mint new NFTs</li>
                <li>List NFTs for sale</li>
                <li>Browse and buy NFTs from other creators</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/deploy"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Deploy Contract</h3>
                <p className="text-gray-600">Create your own NFT contract on Hedera</p>
              </a>
              <a
                href="/mint"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Mint NFT</h3>
                <p className="text-gray-600">Create new NFTs in your contract</p>
              </a>
              <a
                href="/marketplace/create"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Create Listing</h3>
                <p className="text-gray-600">List your NFTs for sale</p>
              </a>
              <a
                href="/marketplace/listings"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
                <p className="text-gray-600">Discover and buy NFTs</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 