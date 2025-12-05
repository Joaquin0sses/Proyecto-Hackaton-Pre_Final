import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
    onScan: (data: any) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [scanMode, setScanMode] = useState<'camera' | 'file'>('camera');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const handleScanSuccess = useCallback((decodedText: string) => {
        setScanResult(decodedText);
        setError(null);
        setImagePreview(null);
        setSelectedFileName(null);
        try {
            const parsedData = JSON.parse(decodedText);
            onScan(parsedData);
        } catch (e) {
            console.error("Invalid QR Code data", e);
            setError("Invalid QR Code format");
        }
    }, [onScan]);

    useEffect(() => {
        if (scanMode === 'camera') {
            setScanResult(null);
            setError(null);
            const scanner = new Html5QrcodeScanner(
                "reader",
                { 
                    fps: 10, 
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: []
                },
                false
            );

            scannerRef.current = scanner;

            scanner.render(
                (decodedText) => {
                    scanner.clear();
                    handleScanSuccess(decodedText);
                },
                (error) => {
                    // Silently ignore scanning errors
                }
            );

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            };
        } else {
            setScanResult(null);
            setError(null);
            setImagePreview(null);
            setSelectedFileName(null);
        }
    }, [scanMode, handleScanSuccess]);

    const scanImageFile = useCallback(async (file: File) => {
        setError(null);
        let html5QrCode: Html5Qrcode | null = null;

        try {
            // Asegurarse de que el elemento DOM existe
            const element = document.getElementById("file-reader");
            if (!element) {
                throw new Error("Elemento de escaneo no encontrado");
            }

            // Esperar un momento para asegurar que el DOM esté listo
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Crear una instancia de Html5Qrcode
            html5QrCode = new Html5Qrcode("file-reader");
            
            // Escanear el archivo directamente
            // El segundo parámetro false significa que no mostrará la imagen
            const decodedText = await html5QrCode.scanFile(file, false);
            handleScanSuccess(decodedText);
        } catch (err: any) {
            console.error("Error scanning file:", err);
            const errorMessage = err.message || "No se pudo detectar el código QR en la imagen";
            
            // Mensajes de error más amigables
            if (errorMessage.includes("No MultiFormat Readers") || errorMessage.includes("NotFoundException")) {
                setError("No se pudo detectar el código QR. Asegúrate de que la imagen sea clara, tenga buen contraste y contenga un QR code completo y visible.");
            } else {
                setError(errorMessage);
            }
        } finally {
            // Limpiar siempre, incluso si hubo un error
            if (html5QrCode) {
                try {
                    html5QrCode.clear();
                } catch (clearErr) {
                    // Ignorar errores al limpiar
                    console.error("Error clearing scanner:", clearErr);
                }
            }
        }
    }, [handleScanSuccess]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setSelectedFileName(file.name);
        
        await scanImageFile(file);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        // Crear vista previa
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setSelectedFileName(file.name);
        
        await scanImageFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="mb-4 flex gap-2">
                <button
                    onClick={() => {
                        if (scannerRef.current) {
                            scannerRef.current.clear().catch(() => {});
                        }
                        setScanMode('camera');
                        setError(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        scanMode === 'camera'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Cámara
                </button>
                <button
                    onClick={() => {
                        if (scannerRef.current) {
                            scannerRef.current.clear().catch(() => {});
                        }
                        setScanMode('file');
                        setError(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        scanMode === 'file'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Imagen
                </button>
            </div>

            {error && (
                <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <span className="text-red-600 text-sm">⚠️ {error}</span>
                </div>
            )}

            {scanMode === 'camera' ? (
                <div id="reader" className="w-full"></div>
            ) : (
                <div className="w-full">
                    <div id="file-reader" className="absolute opacity-0 pointer-events-none" style={{ width: '250px', height: '250px', top: '-9999px' }}></div>
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        {imagePreview ? (
                            <div className="mb-4">
                                <img 
                                    src={imagePreview} 
                                    alt="Vista previa" 
                                    className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-300"
                                />
                                <p className="text-gray-600 mt-2 text-sm">{selectedFileName}</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 mb-2">
                                    {selectedFileName || "Elige una imagen"}
                                </p>
                                <p className="text-gray-400 text-sm">O arrastra una imagen aquí para escanear</p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (scannerRef.current) {
                                scannerRef.current.clear().catch(() => {});
                            }
                            setScanMode('camera');
                            setError(null);
                        }}
                        className="mt-4 w-full text-blue-600 underline text-sm"
                    >
                        Escanear usando cámara directamente
                    </button>
                </div>
            )}

            {scanResult && (
                <p className="mt-4 text-green-600 font-semibold">¡Código escaneado!</p>
            )}
        </div>
    );
}
