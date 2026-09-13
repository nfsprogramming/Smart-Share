import { type CardData } from '../../types';
import { Icon } from '../ui/Icon';
import { motion } from 'framer-motion';
import { openUrl } from '../../utils/capacitor';
import { MapPin, Download } from 'lucide-react';
import { generateVCard } from '../../utils/vcard';
import { logAnalyticsEvent } from '../../utils/firebase';

interface CardContentProps {
    data: CardData;
    isPreview?: boolean;
}

export function CardContent({ data, isPreview = false }: CardContentProps) {
    if (isPreview) { } // Suppress unused warning
    const { theme } = data;
    
    const getContainerStyle = () => {
        switch (theme.style) {
            case 'minimal': return 'bg-[#F6F5F2] text-[#15161A]'; // Light mode base
            case 'midnight': return 'bg-brand-bg text-brand-text-primary';
            case 'aurora': return 'bg-brand-bg text-brand-text-primary';
            case 'editorial': return 'bg-[#E3E2DE] text-[#15161A]';
            case 'mono': return 'bg-white text-black';
            case 'glass': return 'bg-brand-bg text-brand-text-primary';
            case 'luxury': return 'bg-[#0a0a0a] text-[#d4af37]';
            default: return 'bg-brand-bg text-brand-text-primary';
        }
    };

    const getButtonStyle = () => {
        switch (theme.style) {
            case 'minimal': return 'bg-white hover:bg-[#F6F5F2] border border-[#E3E2DE] text-[#15161A] shadow-sm';
            case 'midnight': return 'bg-brand-surface hover:bg-brand-elevated text-brand-text-primary border border-brand-border';
            case 'aurora': return 'bg-brand-surface/50 hover:bg-brand-elevated border border-brand-border text-brand-text-primary backdrop-blur-lg';
            case 'editorial': return 'bg-transparent hover:bg-black/5 text-[#15161A] border-b-2 border-black rounded-none';
            case 'mono': return 'bg-white text-black hover:bg-black hover:text-white rounded-none border-2 border-black transition-colors';
            case 'glass': return 'bg-brand-surface/40 hover:bg-brand-elevated/60 border border-white/5 text-white shadow-lg backdrop-blur-xl';
            case 'luxury': return 'bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] shadow-xl';
            default: return 'bg-brand-surface hover:bg-brand-elevated text-brand-text-primary border border-brand-border';
        }
    };

    const getPrimaryButtonStyle = () => {
        switch (theme.style) {
            case 'minimal': return 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-xl';
            case 'midnight': return 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-xl';
            case 'aurora': return 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-lg shadow-brand-accent/20 border-none';
            case 'editorial': return 'bg-black hover:bg-gray-800 text-white rounded-none';
            case 'mono': return 'bg-black text-white hover:bg-white hover:text-black border-2 border-black rounded-none transition-colors';
            case 'luxury': return 'bg-[#d4af37] hover:bg-[#c5a028] text-black';
            default: return 'bg-brand-accent hover:bg-brand-accent-hover text-white shadow-xl';
        }
    };

    const getFontStack = (font: string) => {
        switch (font) {
            case 'Playfair Display': return "'Playfair Display', serif";
            case 'JetBrains Mono': return "'JetBrains Mono', monospace";
            case 'Lexend': return "'Lexend', sans-serif";
            case 'Bricolage Grotesque': return "'Bricolage Grotesque', sans-serif";
            case 'Roboto': return "'Roboto', sans-serif";
            case 'Outfit': return "'Outfit', sans-serif";
            default: return "'Inter', sans-serif";
        }
    };

    const renderBackground = () => {
        if (theme.style === 'glass') {
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-brand-accent-soft rounded-full blur-[100px] animate-pulse-slow" />
                </div>
            );
        }
        if (theme.style === 'aurora') {
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[50%] w-[60%] h-[60%] bg-brand-accent-soft rounded-full blur-[120px] animate-pulse-slow -translate-x-1/2" />
                </div>
            );
        }
        return null;
    };

    const handleSaveContact = () => {
        if (!isPreview) {
            logAnalyticsEvent({
                cardId: data.id,
                eventType: 'contact_save'
            });
        }
        const vcfContent = generateVCard(data);
        const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${data.fullName.replace(/\s+/g, '_')}.vcf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Derived flags for design tweaks
    const isRounded = !['editorial', 'mono'].includes(theme.style);
    const radiusClass = isRounded ? 'rounded-2xl' : 'rounded-none';

    return (
        <div
            className={`relative w-full min-h-full flex flex-col items-center selection:bg-brand-accent-soft ${getContainerStyle()}`}
            style={{
                fontFamily: getFontStack(theme.fontFamily),
            }}
        >
            {renderBackground()}

            {/* Cover Image */}
            {data.coverUrl && (
                <div className="w-full h-48 sm:h-64 relative z-0">
                    <img src={data.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${theme.style === 'minimal' || theme.style === 'editorial' || theme.style === 'mono' ? 'from-white/50 to-transparent' : 'from-brand-bg/80 to-transparent'}`} />
                </div>
            )}

            {/* Content wrapper z-index 10 to sit above background */}
            <div className={`relative z-10 w-full max-w-lg mx-auto flex flex-col px-6 sm:px-8 pb-6 ${data.coverUrl ? '-mt-16 sm:-mt-24' : 'mt-12 sm:mt-16'}`}>

                {/* Avatar */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, type: 'spring' }}
                    className={`w-32 h-32 overflow-hidden mb-6 border-4 shadow-xl mx-auto
                        ${isRounded ? 'rounded-full' : 'rounded-none'}
                        ${['midnight', 'aurora', 'glass'].includes(theme.style) ? 'border-brand-surface' : 'border-transparent'}
                    `}
                >
                    <img
                        src={data.avatarUrl}
                        alt={data.fullName}
                        className="w-full h-full object-cover bg-brand-elevated"
                    />
                </motion.div>

                {/* Info Hierarchy: Identity */}
                <div className="text-center mb-8 w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-1 tracking-tight">{data.fullName}</h1>
                    <p className={`text-lg font-medium mb-3 opacity-90`}>
                        {data.jobTitle} {data.company ? `at ${data.company}` : ''}
                    </p>
                    
                    {(data.location) && (
                        <div className="flex items-center justify-center gap-1.5 text-sm opacity-60 mb-5 font-medium">
                            <MapPin size={14} />
                            <span>{data.location}</span>
                        </div>
                    )}

                    <p className="text-base opacity-80 leading-relaxed max-w-sm mx-auto">
                        {data.bio}
                    </p>
                </div>

                {/* Primary Actions */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3 mb-10 w-full"
                >
                    <button 
                        onClick={handleSaveContact}
                        className={`flex-1 p-4 ${radiusClass} font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-transform active:scale-95 ${getPrimaryButtonStyle()}`}
                    >
                        <Download size={18} />
                        Save Contact
                    </button>
                </motion.div>

                {/* Links */}
                <div className="w-full flex flex-col gap-3 sm:gap-4 animate-stagger-fade">
                    {data.links.filter(l => l.active).map((link, i) => {
                        const isUrl = link.url.startsWith('http') || link.url.startsWith('https');
                        const isMail = link.url.startsWith('mailto:');
                        const isTel = link.url.startsWith('tel:');
                        const isLink = isUrl || isMail || isTel;

                        const handleClick = async (e: React.MouseEvent) => {
                            if (!isPreview) {
                                logAnalyticsEvent({
                                    cardId: data.id,
                                    eventType: 'link_click',
                                    linkId: link.title
                                });
                            }
                            if (!isLink) {
                                e.preventDefault();
                                navigator.clipboard.writeText(link.url);
                                alert('Copied to clipboard: ' + link.url);
                            } else if (isUrl) {
                                e.preventDefault();
                                await openUrl(link.url);
                            }
                        };

                        return (
                            <motion.a
                                key={link.id}
                                href={isLink ? link.url : '#'}
                                onClick={handleClick}
                                rel={isUrl ? "noopener noreferrer" : undefined}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.05) }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 ${radiusClass} flex items-center gap-4 group cursor-pointer transition-all ${getButtonStyle()}`}
                            >
                                <div className={`p-2.5 rounded-lg bg-black/5 dark:bg-white/5`}>
                                    <Icon name={link.icon} size={20} />
                                </div>
                                <span className="font-semibold text-[15px] flex-1">{link.title}</span>
                            </motion.a>
                        );
                    })}
                </div>

                {/* Footer */}
                <footer className="mt-8 opacity-30 text-xs font-medium flex flex-col items-center gap-2 pb-4">
                    <div className="w-8 h-1 bg-current rounded-full opacity-20 mb-2" />
                    <p>Powered by <span className="font-bold">Smart Share</span></p>
                </footer>

            </div>
        </div>
    );
}
