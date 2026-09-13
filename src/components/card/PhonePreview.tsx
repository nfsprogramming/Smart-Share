
import { type CardData } from '../../types';
import { CardContent } from './CardContent';

interface PhonePreviewProps {
    data: CardData;
}

export function PhonePreview({ data }: PhonePreviewProps) {
    // We need to pass the styles down or replicate the container logic.
    // Actually CardContent handles styles internally for the content.
    // We just need the frame.


    return (
        <div className="relative w-[340px] h-[680px] bg-brand-surface rounded-[3.5rem] border-[10px] border-brand-bg shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden select-none outline outline-1 outline-white/10 ring-8 ring-brand-surface/50 scale-[0.85] sm:scale-90 lg:scale-100 transition-transform">
            {/* Glossy Hardware highlight */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[3rem]" />
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-9 bg-black rounded-3xl z-50 pointer-events-none flex items-center shadow-lg border border-white/5">
                <div className="ml-auto mr-4 flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                        <div className="w-[3px] h-[3px] bg-blue-500/30 rounded-full blur-[0.5px]" />
                    </div>
                </div>
            </div>

            {/* Hardware buttons (Titanium style) */}
            <div className="absolute top-28 -left-[10px] w-1 h-16 bg-gradient-to-b from-brand-surface to-brand-elevated rounded-r-md z-50 border-r border-white/10" />
            <div className="absolute top-48 -left-[10px] w-1 h-12 bg-gradient-to-b from-brand-surface to-brand-elevated rounded-r-md z-50 border-r border-white/10" />
            <div className="absolute top-64 -left-[10px] w-1 h-12 bg-gradient-to-b from-brand-surface to-brand-elevated rounded-r-md z-50 border-r border-white/10" />
            <div className="absolute top-40 -right-[10px] w-1 h-24 bg-gradient-to-b from-brand-surface to-brand-elevated rounded-l-md z-50 border-l border-white/10" />

            {/* Screen Content */}
            <div className="w-full h-full overflow-y-auto no-scrollbar relative bg-brand-bg rounded-[2.5rem] shadow-inner">
                <CardContent data={data} isPreview={true} />
            </div>

            {/* Glossy overlay for screen glass effect */}
            <div className="absolute inset-0 pointer-events-none rounded-[3rem] bg-gradient-to-tr from-white/10 via-transparent to-white/5 z-40" />
            <div className="absolute inset-0 pointer-events-none rounded-[3rem] border border-white/5 z-40 shadow-inner" />
        </div>
    );
}
