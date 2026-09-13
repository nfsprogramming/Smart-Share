import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { ScanLine, ExternalLink, Copy, AlertCircle, RefreshCw } from 'lucide-react';

export function Scan() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (!scannerRef.current) {
            const timer = setTimeout(() => {
                const element = document.getElementById('reader');
                if (element) {
                    try {
                        const scanner = new Html5QrcodeScanner(
                            "reader",
                            {
                                fps: 10,
                                qrbox: { width: 250, height: 250 },
                                aspectRatio: 1.0,
                                supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
                            },
                            false
                        );

                        scanner.render(onScanSuccess, onScanFailure);
                        scannerRef.current = scanner;
                    } catch (e) {
                        setError("Camera access failed or not supported.");
                        console.error(e);
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }

        return () => {
            if (scannerRef.current) {
                try {
                    scannerRef.current.clear().catch(console.error);
                } catch (e) {
                    // ignore
                }
                scannerRef.current = null;
            }
        };
    }, []);

    const onScanSuccess = (decodedText: string) => {
        setScanResult(decodedText);
        if (scannerRef.current) {
            scannerRef.current.clear().catch(console.error);
            scannerRef.current = null;
        }
    };

    const onScanFailure = () => { };

    const handleReset = () => {
        setScanResult(null);
        setError(null);
        window.location.reload();
    };

    return (
        <div className="auto-container py-10 animate-fade-in relative">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-black text-brand-text-primary mb-3 tracking-tighter">
                    Scanner
                </h1>
                <p className="text-brand-text-secondary text-lg font-medium max-w-lg leading-relaxed mx-auto">
                    Instantly capture and decode any QR code using your device's high-speed lens.
                </p>
            </header>

            <div className="w-full max-w-[620px] mx-auto">
                {!scanResult ? (
                    <>
                        <div className="relative">
                            <div
                                id="reader"
                                className="w-full overflow-hidden rounded-2xl bg-black border border-brand-border"
                                style={{ aspectRatio: '4/3' }}
                            />
                            {/* Scanning Line */}
                            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[2px] bg-brand-accent/70 shadow-[0_0_6px_rgba(255,92,69,0.4)] animate-scan-line pointer-events-none" />
                        </div>
                        {error && (
                            <div className="mt-4 p-4 bg-brand-status-danger/10 border border-brand-status-danger/20 rounded-xl flex items-center gap-3 text-brand-status-danger">
                                <AlertCircle size={20} />
                                <span className="text-sm font-bold">{error}</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-8 py-8 px-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-status-success/20 blur-2xl rounded-full scale-150 animate-pulse" />
                            <div className="relative w-20 h-20 bg-brand-status-success/10 rounded-2xl flex items-center justify-center text-brand-status-success border border-brand-status-success/20 shadow-xl">
                                <ScanLine size={40} strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="text-center w-full">
                            <p className="text-brand-text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-3">Payload Decoded</p>
                            <div className="p-5 bg-black/40 rounded-xl border border-white/5 break-all text-white font-mono text-sm leading-relaxed shadow-inner">
                                {scanResult}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(scanResult);
                                    alert('Copied to system clipboard!');
                                }}
                                className="h-[52px] bg-white text-black rounded-[10px] font-bold text-sm transition-all hover:bg-slate-100 active:scale-95 flex items-center justify-center gap-2 shadow-xl"
                            >
                                <Copy size={16} strokeWidth={2.5} />
                                <span>Copy</span>
                            </button>
                            {scanResult.startsWith('http') && (
                                <a
                                    href={scanResult}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-[52px] bg-brand-accent text-white rounded-[10px] font-bold text-sm transition-all hover:bg-brand-accent-hover active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20"
                                >
                                    <ExternalLink size={16} strokeWidth={2.5} />
                                    <span>Open Link</span>
                                </a>
                            )}
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 text-brand-text-muted hover:text-brand-text-primary text-xs font-bold transition-all uppercase tracking-widest active:scale-95"
                        >
                            <RefreshCw size={14} />
                            <span>Scan Again</span>
                        </button>
                    </div>
                )}

                {!scanResult && (
                    <div className="mt-6 px-5 py-4 bg-brand-surface/30 rounded-[14px] border border-brand-border text-center">
                        <p className="text-brand-text-muted text-[11px] uppercase font-bold tracking-[0.2em]">
                            Requires camera permissions • Optimized for high-density codes
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
