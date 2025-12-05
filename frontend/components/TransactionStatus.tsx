import React, { useEffect, useState } from 'react';
import { useContractEvent } from 'wagmi';

interface TransactionStatusProps {
    sellerAddress: string;
    contractAddress: `0x${string}`;
    abi: any;
}

export default function TransactionStatus({ sellerAddress, contractAddress, abi }: TransactionStatusProps) {
    const [paymentReceived, setPaymentReceived] = useState(false);
    const [lastPayment, setLastPayment] = useState<any>(null);

    useContractEvent({
        address: contractAddress,
        abi: abi,
        eventName: 'PaymentMade',
        listener(log) {
            // log is an array of events
            const event = log[0] as any;
            const { seller, amount, reference } = event.args;

            if (seller.toLowerCase() === sellerAddress.toLowerCase()) {
                setPaymentReceived(true);
                setLastPayment({ amount: amount.toString(), reference });
            }
        },
    });

    if (!paymentReceived) {
        return (
            <div className="mt-8 p-4 bg-yellow-100 text-yellow-800 rounded-lg animate-pulse">
                Waiting for payment...
            </div>
        );
    }

    return (
        <div className="mt-8 p-6 bg-green-500 text-white rounded-lg shadow-xl text-center">
            <h2 className="text-3xl font-bold mb-2">PAYMENT RECEIVED!</h2>
            <p className="text-xl">Amount: {lastPayment?.amount} (Units)</p>
            <p className="text-lg opacity-80">Ref: {lastPayment?.reference}</p>
        </div>
    );
}
