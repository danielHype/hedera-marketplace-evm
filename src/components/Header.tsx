import { useEffect, useState } from 'react';


export default function Header() {
  
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);



    if (!mounted) return null;

    return (
        <header className="w-full p-4 bg-white border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Hedera Marketplace</h1>
                <div className="flex items-center gap-4">
                    <appkit-button />
                </div>
            </div>
        </header>
    );
} 