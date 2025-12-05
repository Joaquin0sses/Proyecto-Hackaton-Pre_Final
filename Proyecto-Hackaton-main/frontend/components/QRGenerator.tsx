import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
    data: any;
}

export default function QRGenerator({ data }: QRGeneratorProps) {
    const qrValue = JSON.stringify(data);

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Scan to Pay</h2>
            <div className="p-2 border-4 border-gray-800 rounded-lg">
                <QRCodeSVG value={qrValue} size={256} />
            </div>
            <p className="mt-4 text-sm text-gray-500">Show this code to the buyer</p>
        </div>
    );
}
