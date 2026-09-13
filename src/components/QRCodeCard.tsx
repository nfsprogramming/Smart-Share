
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Check, Copy } from 'lucide-react';
import { downloadQRCode } from '../utils/download';
import { Button } from './Button';

interface QRCodeCardProps {
    value: string;
    size?: number;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
    value,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const handleDownload = () => {
        // The utility expects an ID. We will give the wrapper div an ID.
        downloadQRCode('qr-code-wrapper', `qr-code-${Date.now()}`, 'png');
    };

    return (
        <div className="flex flex-col items-center w-full relative group mx-auto">
            
            {/* QR Wrapper Container */}
            <div className="flex items-center justify-center w-full relative z-10 transition-transform duration-500 hover:scale-[1.02] mb-6">
                <div
                    id="qr-code-wrapper"
                    className="p-4 bg-white rounded-[14px] shadow-[0_10px_30px_rgba(255,255,255,0.05)] flex items-center justify-center shrink-0 border border-white/20 w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]"
                >
                    <QRCodeSVG
                        value={value}
                        size={300}
                        style={{ width: '100%', height: '100%' }}
                        fgColor="#08090B"
                        bgColor="#ffffff"
                        level="H" 
                        includeMargin={false}
                        imageSettings={{
                            src: '/favicon.png',
                            height: 64,
                            width: 64,
                            excavate: true,
                        }}
                    />
                </div>
            </div>

            {/* Actions Container */}
            <div className="flex flex-col w-[220px] sm:w-[260px] gap-3 relative z-10 mb-5">
                <Button
                    variant="secondary"
                    className="w-full h-[52px] rounded-[10px] bg-brand-elevated hover:bg-brand-border text-brand-text-primary border border-brand-border transition-all flex items-center justify-center gap-3 hover:-translate-y-[1px]"
                    onClick={handleCopy}
                >
                    {copied ? <Check size={20} strokeWidth={2.5} className="text-brand-status-success" /> : <Copy size={20} strokeWidth={2.5} />}
                    <span className="font-bold text-sm tracking-wide">{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </Button>

                <Button
                    variant="primary"
                    className="w-full h-[52px] rounded-[10px] shadow-lg shadow-brand-accent/20 flex items-center justify-center gap-3 transition-all hover:-translate-y-[1px]"
                    onClick={handleDownload}
                >
                    <Download size={20} strokeWidth={2.5} />
                    <span className="font-bold text-sm tracking-wide">Download QR</span>
                </Button>
            </div>

        </div>
    );
};
