import { Modal } from '../ui/Modal';
import { QRCodeCard } from '../QRCodeCard';
import { type CardData } from '../../types';


interface ShareModalProps {
    card: CardData | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ShareModal({ card, isOpen, onClose }: ShareModalProps) {
    if (!card) return null;

    const baseUrl = 'https://nfs-smartshare.vercel.app';

    // Generate clean URLs without the hash (Vercel will redirect them to /#/ automatically)
    const publicUrl = card.username 
        ? `${baseUrl}/@${card.username}`
        : `${baseUrl}/card/${card.id}`;



    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Identity">
            <div className="flex flex-col items-center justify-center w-full max-w-[600px] mx-auto">
                
                <div className="text-center mb-6 mt-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-brand-text-primary tracking-tight mb-2">
                        {card.fullName}
                    </h3>
                    <p className="text-brand-text-secondary text-sm font-medium">
                        {card.jobTitle}
                    </p>
                </div>

                <div className="relative group mx-auto w-full flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative w-full">
                        <QRCodeCard value={publicUrl} />
                    </div>
                </div>

            </div>
        </Modal>
    );
}
