'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppKitButton } from '@reown/appkit/react';

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => pathname === path;

    if (!mounted) return null;

    return (
        <header className="w-full p-4 bg-white border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold">Hedera Marketplace</h1>
                    <nav className="flex gap-4">
                        <Link 
                            href="/" 
                            className={`px-3 py-2 rounded-md ${
                                isActive('/') 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            Marketplace
                        </Link>
                        <Link 
                            href="/deploy" 
                            className={`px-3 py-2 rounded-md ${
                                isActive('/deploy') 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            Deploy ERC1155
                        </Link>
                        <Link 
                            href="/nft" 
                            className={`px-3 py-2 rounded-md ${
                                isActive('/nft') 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            NFT
                        </Link>
                        <Link 
                            href="/deploy-factory" 
                            className={`px-3 py-2 rounded-md ${
                                isActive('/deploy-factory') 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'text-gray-600 hover:text-blue-600'
                            }`}
                        >
                            Deploy Factory
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <appkit-button />
                </div>
            </div>
        </header>
    );
} 