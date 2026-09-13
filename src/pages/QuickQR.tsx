import { useState } from 'react';
import { QRCodeCard } from '../components/QRCodeCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Link2 } from 'lucide-react';

export function QuickQR() {
    const [url, setUrl] = useState('');
    const [qrValue, setQrValue] = useState('https://example.com');

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            setQrValue(url);
        }
    };

    return (
        <div className="animate-fade-in relative w-full overflow-x-hidden min-h-screen">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="hidden md:block absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-brand-accent/5 rounded-full blur-[140px]" />
                <div className="hidden md:block absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-brand-accent-hover/5 rounded-full blur-[140px]" />
            </div>

            <div className="w-[calc(100%-48px)] lg:w-[calc(100%-64px)] max-w-[1200px] mx-auto pb-24 pt-8 lg:pt-12 relative z-10">

            {/* Header */}
            <header className="mb-12 lg:mb-14 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-brand-surface border border-brand-border text-brand-text-secondary text-[11px] font-bold uppercase tracking-[0.25em] mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                    Instant Generation
                </div>
                <h1 className="text-4xl lg:text-[60px] font-black text-brand-text-primary mb-4 tracking-tighter leading-tight">
                    Quick QR
                </h1>
                <p className="text-brand-text-secondary text-base lg:text-lg font-medium max-w-2xl leading-relaxed">
                    Transform any URL into a high-performance, scan-ready QR code in seconds. Optimized for mobile and print.
                </p>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,600px)_minmax(0,390px)] gap-10 lg:gap-16 items-start">

                {/* Input Section */}
                <div className="w-full bg-brand-surface/40 backdrop-blur-xl border border-brand-border p-6 lg:p-10 rounded-2xl shadow-xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-brand-text-primary mb-3">
                            QR Content
                        </h2>
                        <p className="text-brand-text-muted text-sm leading-relaxed font-medium">
                            Enter your destination URL or plain text. We'll optimize the QR density for maximum scannability.
                        </p>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-7">
                        <div>
                            <Input
                                placeholder="https://your-website.com or plain text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                label="Destination URL or Text"
                                className="w-full bg-brand-bg border-brand-border h-[52px] rounded-[10px] text-base focus:ring-0 focus:border-brand-accent shadow-sm transition-colors"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={!url.trim()} 
                            className="w-full h-[56px] bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 disabled:hover:bg-brand-accent text-white font-bold text-lg rounded-[10px] transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            <span>Generate QR</span>
                            <Link2 size={20} />
                        </Button>
                    </form>
                </div>

                {/* Preview Section */}
                <div className="relative w-full flex flex-col items-center max-w-[390px]">

                    {/* Display Frame */}
                    <div className="w-full py-8 rounded-2xl bg-brand-bg border border-brand-border shadow-xl flex items-center justify-center">
                        <QRCodeCard value={qrValue} />
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-2">
                        <p className="text-brand-text-secondary text-[11px] font-bold uppercase tracking-[0.3em]">
                            Active Preview
                        </p>
                        <div className="w-8 h-[2px] bg-brand-border rounded-full" />
                    </div>
                </div>

            </div>
        </div>
        </div>
    );
}
