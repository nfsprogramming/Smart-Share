import { Link } from 'react-router-dom';
import { Share2, Copy, Eye, MousePointerClick, QrCode, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShareModal } from '../components/card/ShareModal';
import { type CardData, type AnalyticsEvent } from '../types';
import { getUserCardsFromFirebase, getCardAnalyticsEvents } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { triggerHapticSelection } from '../utils/capacitor';
import { PhonePreview } from '../components/card/PhonePreview';

export function Dashboard() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [events, setEvents] = useState<AnalyticsEvent[]>([]);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadCards = async () => {
            if (!user) {
                setCards([]);
                setLoading(false);
                return;
            }

            try {
                const firebaseCards = await getUserCardsFromFirebase();
                setCards(firebaseCards as CardData[]);
                
                if (firebaseCards.length > 0) {
                    const primary = firebaseCards[0] as CardData;
                    const cardEvents = await getCardAnalyticsEvents(primary.id);
                    setEvents(cardEvents as AnalyticsEvent[]);
                }
            } catch (error) {
                console.error('Failed to load cards:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCards();
    }, [user]);

    const primaryCard = cards.length > 0 ? cards[0] : null;

    const copyLink = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
            triggerHapticSelection();
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
                <div className="relative">
                    <div className="hidden md:block absolute inset-0 bg-brand-accent/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!primaryCard) {
        return (
            <div className="auto-container py-12">
                <div className="bg-brand-surface backdrop-blur-xl border border-brand-border rounded-[2.5rem] p-12 text-center max-w-2xl mx-auto shadow-2xl animate-fade-in-up">
                    <div className="w-24 h-24 bg-brand-elevated rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-brand-border">
                        <AlertCircle size={40} className="text-brand-text-muted" />
                    </div>
                    <h2 className="text-4xl font-black text-brand-text-primary tracking-tight mb-4">Welcome to Smart Share</h2>
                    <p className="text-brand-text-secondary text-lg mb-10 leading-relaxed font-medium">
                        Let's create your digital identity. Share who you are, what you do, and where people can find you.
                    </p>
                    <Link
                        to="/editor"
                        className="inline-block bg-brand-accent text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-brand-accent-hover transition-all shadow-xl active:scale-95"
                    >
                        Create Your Identity
                    </Link>
                </div>
            </div>
        );
    }

    const publicUrl = `https://nfs-smartshare.vercel.app/@${primaryCard.username || primaryCard.id.substring(0, 8)}`;

    const profileViews = events.filter(e => e.eventType === 'profile_view').length;
    const linkClicks = events.filter(e => e.eventType === 'link_click').length;
    const qrScans = events.filter(e => e.eventType === 'qr_scan').length;
    const contactSaves = events.filter(e => e.eventType === 'contact_save').length;

    const getEventDetails = (event: AnalyticsEvent) => {
        switch (event.eventType) {
            case 'profile_view': return { text: `Profile view from ${event.source || 'direct link'}`, color: 'bg-brand-accent' };
            case 'link_click': return { text: `Link click on '${event.linkId || 'a link'}'`, color: 'bg-brand-status-warning' };
            case 'qr_scan': return { text: 'Someone scanned your QR Code', color: 'bg-brand-status-success' };
            case 'contact_save': return { text: 'Someone saved your contact', color: 'bg-brand-accent' };
            default: return { text: 'New activity', color: 'bg-gray-500' };
        }
    };

    const formatTimeAgo = (isoString: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
        if (seconds < 60) return `just now`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <div className="auto-container py-8 animate-fade-in relative z-10">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-brand-text-primary mb-2 tracking-tight">
                    Good morning{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}.
                </h1>
                <p className="text-brand-text-secondary font-medium">Your Smart Share is live and ready to connect.</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column: Stats & Actions */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Primary Identity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                    >
                        <button 
                            onClick={() => setShareModalOpen(true)}
                            className="absolute top-0 right-0 p-8 opacity-5 hover:opacity-20 transition-all cursor-pointer z-10 group"
                            title="View QR Code"
                        >
                            <QrCode size={120} className="group-hover:scale-105 transition-transform" />
                        </button>
                        <h2 className="text-xs uppercase tracking-widest font-black text-brand-text-muted mb-6">Your Profile</h2>
                        
                        <div className="flex items-center gap-4 mb-8">
                            <img src={primaryCard.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border border-brand-border" />
                            <div>
                                <h3 className="text-xl font-bold text-brand-text-primary">{primaryCard.fullName}</h3>
                                <p className="text-brand-text-secondary text-sm">{publicUrl}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={`/editor/${primaryCard.id}`}
                                className="flex-1 bg-brand-accent hover:bg-brand-accent-hover text-white px-4 py-3 rounded-xl font-bold text-sm transition-all text-center shadow-lg"
                            >
                                Edit Profile
                            </Link>
                            <button
                                onClick={() => setShareModalOpen(true)}
                                className="flex-1 bg-brand-elevated hover:bg-brand-border text-brand-text-primary border border-brand-border px-4 py-3 rounded-xl font-bold text-sm transition-all text-center flex items-center justify-center gap-2"
                            >
                                <Share2 size={16} />
                                Share
                            </button>
                            <button
                                onClick={() => copyLink(publicUrl)}
                                className="px-4 py-3 bg-brand-elevated hover:bg-brand-border border border-brand-border text-brand-text-primary rounded-xl transition-all"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Quick Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Profile Views', value: profileViews, icon: Eye },
                            { label: 'Link Clicks', value: linkClicks, icon: MousePointerClick },
                            { label: 'QR Scans', value: qrScans, icon: QrCode },
                            { label: 'Contact Saves', value: contactSaves, icon: UserPlus },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (i * 0.05) }}
                                className="bg-brand-surface border border-brand-border rounded-2xl p-4 sm:p-5 hover:border-brand-accent/50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-brand-elevated text-brand-text-secondary flex items-center justify-center mb-4">
                                    <stat.icon size={16} />
                                </div>
                                <p className="text-2xl font-black text-brand-text-primary mb-1">{stat.value}</p>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-brand-text-muted">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold text-brand-text-primary">Recent Activity</h2>
                            <Link to={`/analytics/${primaryCard.id}`} className="text-xs font-bold text-brand-accent hover:text-brand-accent-hover">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {events.length === 0 ? (
                                <p className="text-sm text-brand-text-muted italic">No activity yet. Share your card to get started!</p>
                            ) : (
                                events.slice(0, 4).map(event => {
                                    const details = getEventDetails(event);
                                    return (
                                        <div key={event.id} className="flex items-center gap-4 text-sm">
                                            <div className={`w-2 h-2 rounded-full ${details.color}`}></div>
                                            <div className="flex-1 text-brand-text-primary truncate">{details.text}</div>
                                            <div className="text-brand-text-muted text-xs whitespace-nowrap">{formatTimeAgo(event.timestamp)}</div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Preview */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="w-full max-w-[340px] relative">
                        {/* Removed massive neon gradient behind the phone preview to keep it minimal */}
                        <PhonePreview data={primaryCard} />
                    </div>
                </div>
            </div>

            <ShareModal
                card={primaryCard}
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
            />
        </div>
    );
}
