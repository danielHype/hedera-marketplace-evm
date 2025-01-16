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
        <header className="w-full py-4 bg-white border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                    <h1 className="text-xl font-bold">Hedera</h1>
               
                <div className="flex items-center gap-4">
                    <appkit-button />
                </div>
            </div>
        </header>
    );
} 