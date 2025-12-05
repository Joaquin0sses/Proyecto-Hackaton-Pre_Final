import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Product, getMockProducts, fetchCatalogProducts } from '@/utils/facebook';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Try to fetch real products, fallback to mock
        const loadProducts = async () => {
            try {
                // For demo purposes, we'll mix mock data to ensure it looks good immediately
                // const realProducts = await fetchCatalogProducts(); 
                const mockProducts = getMockProducts();
                setProducts(mockProducts);
            } catch (e) {
                setProducts(getMockProducts());
            }
        };
        loadProducts();
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="absolute top-4 right-4">
                <ConnectButton />
            </div>

            <div className="text-center mb-16 mt-8">
                <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    SafeSwap
                </h1>
                <p className="text-xl text-gray-300">Secure Face-to-Face Crypto Payments</p>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-20">
                <Link href="/sell" className="group">
                    <div className="p-8 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-center h-full flex flex-col justify-center bg-gray-800/50 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold mb-4 group-hover:text-purple-400">I am Selling</h2>
                        <p className="text-gray-400">Generate a QR code to receive payment.</p>
                    </div>
                </Link>

                <Link href="/pay" className="group">
                    <div className="p-8 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-center h-full flex flex-col justify-center bg-gray-800/50 backdrop-blur-sm">
                        <h2 className="text-3xl font-bold mb-4 group-hover:text-pink-400">I am Buying</h2>
                        <p className="text-gray-400">Scan a QR code to make a payment.</p>
                    </div>
                </Link>
            </div>

            {/* Marketplace Section */}
            <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                    <h2 className="text-3xl font-bold text-white">Marketplace</h2>
                    <Link href="/sell" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-colors">
                        + Publish Item
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all group">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-green-400">${product.price}</span>
                                    <Link href="/pay">
                                        <button className="bg-white text-gray-900 px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                                            Buy
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
