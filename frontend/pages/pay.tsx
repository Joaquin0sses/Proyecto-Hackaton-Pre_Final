import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import QRScanner from '@/components/QRScanner';
import Link from 'next/link';
import { parseEther, parseUnits } from 'viem';

// PLACEHOLDERS
const QUICKPAY_ADDRESS = (process.env.NEXT_PUBLIC_QUICKPAY_ADDRESS || "0x0797cE06a87efF9931D02F3D38791f0f37120450") as `0x${string}`;
const MOCK_USDC_ADDRESS = (process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || "0xA19A3613CD8AF1685b131068EdE7a657D3083578") as `0x${string}`;

const ERC20_ABI = [
    {
        "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }],
        "name": "approve",
        "outputs": [{ "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }],
        "name": "allowance",
        "outputs": [{ "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const QUICKPAY_ABI = [
    {
        "inputs": [
            { "name": "_seller", "type": "address" },
            { "name": "_amount", "type": "uint256" },
            { "name": "_reference", "type": "string" }
        ],
        "name": "payMerchant",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export default function Pay() {
    const { address } = useAccount();
    const [scanData, setScanData] = useState<any>(null);
    const [step, setStep] = useState<'scan' | 'approve' | 'pay' | 'success'>('scan');

    // 1. Read Allowance
    const { data: allowance } = useContractRead({
        address: MOCK_USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, QUICKPAY_ADDRESS],
        watch: true,
    });

    // 2. Prepare Approve
    const { config: approveConfig } = usePrepareContractWrite({
        address: MOCK_USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [QUICKPAY_ADDRESS, scanData ? parseUnits(scanData.amount, 6) : BigInt(0)], // Assuming USDC 6 decimals
        enabled: !!scanData,
    });
    const { write: writeApprove, data: approveData } = useContractWrite(approveConfig);
    const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransaction({
        hash: approveData?.hash,
    });

    // 3. Prepare Pay
    const { config: payConfig } = usePrepareContractWrite({
        address: QUICKPAY_ADDRESS,
        abi: QUICKPAY_ABI,
        functionName: 'payMerchant',
        args: [scanData?.seller, scanData ? parseUnits(scanData.amount, 6) : BigInt(0), scanData?.ref],
        enabled: !!scanData && (allowance as bigint) >= (scanData ? parseUnits(scanData.amount, 6) : BigInt(0)),
    });
    const { write: writePay, data: payData } = useContractWrite(payConfig);
    const { isLoading: isPaying, isSuccess: isPaid } = useWaitForTransaction({
        hash: payData?.hash,
    });

    useEffect(() => {
        if (scanData) {
            const amountBig = parseUnits(scanData.amount, 6);
            if (allowance && (allowance as bigint) >= amountBig) {
                setStep('pay');
            } else {
                setStep('approve');
            }
        }
    }, [scanData, allowance]);

    useEffect(() => {
        if (isPaid) setStep('success');
    }, [isPaid]);

    const handleScan = (data: any) => {
        if (data && data.seller && data.amount) {
            setScanData(data);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex justify-between items-center mb-8">
                <Link href="/" className="text-blue-600 font-bold">← Back</Link>
                <ConnectButton />
            </div>

            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Buyer Terminal</h1>

                {step === 'scan' && (
                    <QRScanner onScan={handleScan} />
                )}

                {step !== 'scan' && scanData && (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Paying to:</p>
                            <p className="font-mono text-xs break-all">{scanData.seller}</p>
                            <p className="text-sm text-gray-500 mt-2">Amount:</p>
                            <p className="text-2xl font-bold">{scanData.amount} USDC</p>
                            <p className="text-sm text-gray-500 mt-2">For:</p>
                            <p className="font-medium">{scanData.ref}</p>
                        </div>

                        {step === 'approve' && (
                            <button
                                onClick={() => writeApprove?.()}
                                disabled={!writeApprove || isApproving}
                                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50"
                            >
                                {isApproving ? 'Approving...' : '1. Approve USDC'}
                            </button>
                        )}

                        {step === 'pay' && (
                            <button
                                onClick={() => writePay?.()}
                                disabled={!writePay || isPaying}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                            >
                                {isPaying ? 'Processing...' : '2. Pay Now'}
                            </button>
                        )}

                        {step === 'success' && (
                            <div className="text-center text-green-600">
                                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                                <p className="mt-2">You can close this window.</p>
                                <button
                                    onClick={() => { setScanData(null); setStep('scan'); }}
                                    className="mt-4 text-blue-600 underline"
                                >
                                    Make another payment
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
