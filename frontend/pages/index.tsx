import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="absolute top-4 right-4">
                <ConnectButton />
            </div>

            <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                SafeSwap
            </h1>
            <p className="text-xl mb-12 text-gray-300">Secure Face-to-Face Crypto Payments</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/sell" className="group">
                    <div className="p-8 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-center">
                        <h2 className="text-3xl font-bold mb-4 group-hover:text-purple-400">I am Selling</h2>
                        <p className="text-gray-400">Generate a QR code to receive payment.</p>
                    </div>
                </Link>

                <Link href="/pay" className="group">
                    <div className="p-8 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all cursor-pointer text-center">
                        <h2 className="text-3xl font-bold mb-4 group-hover:text-pink-400">I am Buying</h2>
                        <p className="text-gray-400">Scan a QR code to make a payment.</p>
                    </div>
                </Link>
            </div>
        </main>
    );
}
