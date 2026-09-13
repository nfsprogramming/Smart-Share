
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CardContent } from '../components/card/CardContent';
import { type CardData } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

import { getCardFromFirebase, updateCardViews, getCardByUsername, logAnalyticsEvent } from '../utils/firebase';

export function PublicCard() {
    const { id, username } = useParams();
    const [data, setData] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCard = async () => {
            if (!id && !username) return;
            try {
                let card = null;
                if (username) {
                    card = await getCardByUsername(username);
                } else if (id) {
                    card = await getCardFromFirebase(id);
                }
                
                if (card) {
                    setData(card as CardData);
                    // Update SEO metadata
                    document.title = `${(card as CardData).fullName} | Smart Share`;
                    const metaDesc = document.querySelector('meta[name="description"]');
                    if (metaDesc) metaDesc.setAttribute('content', (card as CardData).bio || 'Digital Profile');
                    
                    // Track View in Background
                    updateCardViews(card.id);
                    logAnalyticsEvent({
                        cardId: card.id,
                        eventType: 'profile_view',
                        source: document.referrer || 'direct'
                    });
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [id, username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-accent">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-brand-text-secondary p-4 text-center">
                <AlertCircle size={48} className="text-brand-status-danger mb-4" />
                <h1 className="text-2xl font-bold text-brand-text-primary mb-2">Card Not Found</h1>
                <p className="max-w-md mb-8">
                    The digital card you are looking for does not exist or has been removed.
                </p>
                <Link to="/" className="px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-white rounded-xl font-medium transition-colors">
                    Create Your Own Card
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg">
            <CardContent data={data} />
        </div>
    );
}

