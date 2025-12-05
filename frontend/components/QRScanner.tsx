import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (data: any) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
    const [scanResult, setScanResult] = useState<string | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                setScanResult(decodedText);
                try {
                    const parsedData = JSON.parse(decodedText);
                    onScan(parsedData);
                } catch (e) {
                    console.error("Invalid QR Code data", e);
                    alert("Invalid QR Code format");
                }
            },
            (error) => {
                // console.warn(error);
            }
        );

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [onScan]);

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div id="reader" className="w-full"></div>
            {scanResult && (
                <p className="mt-4 text-green-600 font-semibold">Code Scanned!</p>
            )}
        </div>
    );
}
