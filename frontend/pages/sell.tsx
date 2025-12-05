import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import QRGenerator from '@/components/QRGenerator';
import TransactionStatus from '@/components/TransactionStatus';
import Link from 'next/link';
import { fetchCatalogProducts, Product } from '@/utils/facebook';

// PLACEHOLDER: Replace with actual deployed address
const QUICKPAY_ADDRESS = (process.env.NEXT_PUBLIC_QUICKPAY_ADDRESS || "0x0797cE06a87efF9931D02F3D38791f0f37120450") as `0x${string}`;
const QUICKPAY_ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "payer", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "reference", "type": "string" }
        ],
        "name": "PaymentMade",
        "type": "event"
    }
];

export default function Sell() {
    const { address } = useAccount();
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [generated, setGenerated] = useState(false);

    // Facebook Integration State
    const [products, setProducts] = useState<Product[]>([]);
    const [showCatalog, setShowCatalog] = useState(false);
    const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
    const [catalogError, setCatalogError] = useState('');

    const handleGenerate = () => {
        if (amount && reference) setGenerated(true);
    };

    const handleConnectFacebook = async () => {
        setIsLoadingCatalog(true);
        setCatalogError('');
        try {
            const fetchedProducts = await fetchCatalogProducts();
            setProducts(fetchedProducts);
            setShowCatalog(true);
        } catch (error: any) {
            setCatalogError(error.message || "Failed to load catalog");
        } finally {
            setIsLoadingCatalog(false);
        }
    };

    const handleSelectProduct = (product: Product) => {
        setAmount(product.price);
        setReference(product.name);
        setShowCatalog(false); // Close catalog after selection
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex justify-between items-center mb-8">
                <Link href="/" className="text-blue-600 font-bold">← Back</Link>
                <ConnectButton />
            </div>

            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Seller Terminal</h1>

                {!generated ? (
                    <div className="space-y-4">
                        {/* Facebook Integration Button */}
                        <button
                            onClick={handleConnectFacebook}
                            disabled={isLoadingCatalog}
                            className="w-full bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#166fe5] flex items-center justify-center gap-2 mb-4"
                        >
                            {isLoadingCatalog ? 'Loading...' : 'Connect Facebook Catalog'}
                        </button>

                        {catalogError && (
                            <p className="text-red-500 text-sm text-center">{catalogError}</p>
                        )}

                        {/* Product Catalog Grid */}
                        {showCatalog && products.length > 0 && (
                            <div className="mb-6 border rounded-lg p-2 max-h-60 overflow-y-auto">
                                <h3 className="text-sm font-bold text-gray-500 mb-2">Select a Product:</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleSelectProduct(product)}
                                            className="border rounded p-2 cursor-pointer hover:bg-gray-50 flex flex-col items-center text-center"
                                        >
                                            {product.image_url && (
                                                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded mb-1" />
                                            )}
                                            <p className="text-xs font-bold truncate w-full">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.price} {product.currency}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount (USDC)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2 border"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Reference</label>
                            <input
                                type="text"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2 border"
                                placeholder="e.g. PS5 Console"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={!amount || !reference || !address}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                        >
                            Generate Payment QR
                        </button>
                        {!address && <p className="text-red-500 text-sm text-center">Please connect wallet first</p>}
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <QRGenerator
                            data={{
                                seller: address,
                                amount: amount, // Note: In real app, convert to Wei here or in contract
                                ref: reference
                            }}
                        />
                        <button
                            onClick={() => setGenerated(false)}
                            className="mt-6 text-indigo-600 hover:text-indigo-800"
                        >
                            Create New Sale
                        </button>

                        {address && (
                            <TransactionStatus
                                sellerAddress={address}
                                contractAddress={QUICKPAY_ADDRESS}
                                abi={QUICKPAY_ABI}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
