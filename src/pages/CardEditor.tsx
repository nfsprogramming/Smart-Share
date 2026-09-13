import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { type CardData, initialCardData, type SocialLink } from '../types';
import { PhonePreview } from '../components/card/PhonePreview';
import { Input } from '../components/Input';
import { ShareModal } from '../components/card/ShareModal';
import { resizeImage } from '../utils/image';
import { saveCardToFirebase, getCardFromFirebase } from '../utils/firebase';

import {
    User,
    Link as LinkIcon,
    Palette,
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    Share2,
    Briefcase,
    MapPin,
    AtSign,
    Phone,
    Mail,
    Globe,
    Eye
} from 'lucide-react';
import { triggerHapticSelection } from '../utils/capacitor';

export function CardEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'appearance' | 'contact'>('profile');
    
    // Deep copy initial state
    const [data, setData] = useState<CardData>(() => JSON.parse(JSON.stringify(initialCardData)));
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            const saved = localStorage.getItem(`card-${id}`);
            if (saved) {
                setData(JSON.parse(saved));
            }
            getCardFromFirebase(id).then(card => {
                if (card) {
                    setData(card as CardData);
                    localStorage.setItem(`card-${id}`, JSON.stringify(card));
                }
            }).catch(err => console.error("Failed to fetch card", err));
        }
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        const cardId = id || crypto.randomUUID();
        const newData = { ...data, id: cardId };

        try {
            localStorage.setItem(`card-${cardId}`, JSON.stringify(newData));
            const savedData = await saveCardToFirebase(newData);
            localStorage.setItem(`card-${cardId}`, JSON.stringify(savedData));
            triggerHapticSelection();

            if (!id) {
                navigate(`/editor/${cardId}`, { replace: true });
            }
        } catch (e) {
            console.error('Save failed:', e);
            alert('Failed to save to cloud.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatarUrl' | 'coverUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Resize cover photo slightly larger (e.g. 800px)
            const maxDim = field === 'coverUrl' ? 800 : 300;
            const base64 = await resizeImage(file, maxDim, maxDim);
            setData(prev => ({ ...prev, [field]: base64 }));
        } catch (error) {
            console.error('Failed to process image:', error);
            alert('Failed to upload image.');
        }
    };

    const addLink = () => {
        const newLink: SocialLink = {
            id: crypto.randomUUID(),
            title: 'New Link',
            url: 'https://',
            icon: 'Link',
            active: true,
        };
        setData({ ...data, links: [...data.links, newLink] });
    };

    const updateLink = (id: string, field: keyof SocialLink, value: any) => {
        setData({
            ...data,
            links: data.links.map(l => l.id === id ? { ...l, [field]: value } : l),
        });
    };

    const removeLink = (id: string) => {
        setData({
            ...data,
            links: data.links.filter(l => l.id !== id),
        });
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-brand-bg overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            
            {/* Left: Editor Panel */}
            <div className="flex-1 flex flex-col bg-brand-bg lg:border-r border-brand-border h-full max-h-screen relative z-20">
                {/* Header */}
                <header className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-bg/80 backdrop-blur-md">
                    <div>
                        <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">{id ? 'Edit Identity' : 'New Identity'}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {id && (
                            <button
                                onClick={() => setShareModalOpen(true)}
                                className="p-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                            >
                                <Share2 size={20} />
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-brand-accent hover:bg-brand-accent-hover text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl shadow-brand-accent/20 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="px-6 py-4 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-brand-border shrink-0">
                    {[
                        { id: 'profile', label: 'Identity', icon: User },
                        { id: 'contact', label: 'Contact', icon: Phone },
                        { id: 'links', label: 'Links', icon: LinkIcon },
                        { id: 'appearance', label: 'Appearance', icon: Palette },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-brand-accent-soft text-brand-accent border border-brand-accent/20' 
                                : 'text-brand-text-secondary hover:bg-brand-surface border border-transparent'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 overflow-y-auto p-6 pb-32">
                    
                    {activeTab === 'profile' && (
                        <div className="space-y-6 max-w-xl mx-auto animate-fade-in">
                            
                            {/* Images */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-2 block">Cover Photo</label>
                                    <div 
                                        onClick={() => coverInputRef.current?.click()}
                                        className="h-32 w-full rounded-2xl bg-brand-surface border border-dashed border-brand-border flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent transition-colors relative overflow-hidden group"
                                    >
                                        {data.coverUrl ? (
                                            <>
                                                <img src={data.coverUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="bg-brand-elevated text-brand-text-primary px-3 py-1 rounded-lg text-xs font-bold border border-brand-border">Change Cover</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-brand-text-muted text-sm font-semibold">+ Add Cover Photo</span>
                                        )}
                                    </div>
                                    <input type="file" ref={coverInputRef} onChange={(e) => handleImageUpload(e, 'coverUrl')} accept="image/*" className="hidden" />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-2 block">Profile Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-20 h-20 rounded-full bg-brand-surface border border-dashed border-brand-border overflow-hidden cursor-pointer hover:border-brand-accent relative group shrink-0"
                                        >
                                            {data.avatarUrl ? (
                                                <img src={data.avatarUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><User className="text-brand-text-muted" /></div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ImageIcon size={20} className="text-white" />
                                            </div>
                                        </div>
                                        <div className="text-xs text-brand-text-muted font-medium">Recommended: 400x400px.<br/>Tap to upload.</div>
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'avatarUrl')} accept="image/*" className="hidden" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input label="Full Name" value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} placeholder="e.g. Alex Doe" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Username" icon={<AtSign size={16}/>} value={data.username || ''} onChange={(e) => setData({ ...data, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })} placeholder="alexdoe" />
                                    <Input label="Job Title" icon={<Briefcase size={16}/>} value={data.jobTitle} onChange={(e) => setData({ ...data, jobTitle: e.target.value })} placeholder="e.g. Designer" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Company" icon={<Briefcase size={16}/>} value={data.company || ''} onChange={(e) => setData({ ...data, company: e.target.value })} placeholder="Company Ltd" />
                                    <Input label="Location" icon={<MapPin size={16}/>} value={data.location || ''} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="City, Country" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">Bio</label>
                                    <textarea
                                        value={data.bio}
                                        onChange={(e) => setData({ ...data, bio: e.target.value })}
                                        className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-brand-text-primary placeholder:text-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/50 min-h-[100px] resize-none"
                                        placeholder="Write a short bio..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-6 max-w-xl mx-auto animate-fade-in">
                            <h3 className="text-sm font-bold text-brand-text-primary mb-2">Direct Contact Information</h3>
                            <p className="text-xs text-brand-text-secondary mb-6">This information will be included in your downloadable vCard.</p>
                            
                            <div className="space-y-4">
                                <Input label="Email Address" icon={<Mail size={16}/>} type="email" value={data.contactInfo?.email || ''} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, email: e.target.value } })} placeholder="hello@example.com" />
                                <Input label="Phone Number" icon={<Phone size={16}/>} type="tel" value={data.contactInfo?.phone || ''} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, phone: e.target.value } })} placeholder="+1 234 567 8900" />
                                <Input label="Website" icon={<Globe size={16}/>} type="url" value={data.contactInfo?.website || ''} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, website: e.target.value } })} placeholder="https://" />
                                <Input label="WhatsApp" icon={<Phone size={16}/>} type="tel" value={data.contactInfo?.whatsapp || ''} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, whatsapp: e.target.value } })} placeholder="WhatsApp number" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <div className="space-y-4 max-w-xl mx-auto animate-fade-in">
                            {data.links.map((link) => (
                                <div key={link.id} className="bg-brand-surface p-4 rounded-2xl border border-brand-border group relative">
                                    <div className="flex gap-4">
                                        <div className="w-1/3">
                                            <select
                                                value={link.icon}
                                                onChange={(e) => updateLink(link.id, 'icon', e.target.value)}
                                                className="w-full px-3 py-3 bg-brand-bg border border-brand-border rounded-xl text-brand-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/50 appearance-none font-medium"
                                            >
                                                <option value="Link">Standard Link</option>
                                                <option value="Globe">Website</option>
                                                <option value="Github">Github</option>
                                                <option value="Linkedin">LinkedIn</option>
                                                <option value="Twitter">X / Twitter</option>
                                                <option value="Instagram">Instagram</option>
                                                <option value="Youtube">YouTube</option>
                                                <option value="Mail">Email</option>
                                                <option value="Phone">Phone</option>
                                                <option value="MapPin">Location</option>
                                                <option value="FileText">Document</option>
                                            </select>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input
                                                placeholder="Title"
                                                value={link.title}
                                                onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                                className="w-full px-3 py-2 bg-transparent border-b border-brand-border text-brand-text-primary focus:border-brand-accent outline-none font-bold placeholder:text-brand-text-muted"
                                            />
                                            <input
                                                placeholder="URL (https://)"
                                                value={link.url}
                                                onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                                className="w-full px-3 py-2 bg-transparent border-b border-brand-border text-brand-text-secondary focus:border-brand-accent outline-none text-sm placeholder:text-brand-text-muted"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeLink(link.id)}
                                        className="absolute top-4 right-4 p-2 text-brand-text-muted hover:text-brand-status-danger transition-colors bg-brand-bg rounded-lg opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addLink}
                                className="w-full py-4 rounded-2xl border-2 border-dashed border-brand-border text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-text-secondary hover:bg-brand-surface transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={20} />
                                Add New Link
                            </button>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-8 max-w-xl mx-auto animate-fade-in">
                            <div>
                                <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-4">Premium Themes</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { id: 'minimal', name: 'Minimal', desc: 'Clean White' },
                                        { id: 'midnight', name: 'Midnight', desc: 'Deep Black' },
                                        { id: 'aurora', name: 'Aurora', desc: 'Glowing Lights' },
                                        { id: 'editorial', name: 'Editorial', desc: 'Magazine Style' },
                                        { id: 'mono', name: 'Mono', desc: 'Brutalist B&W' },
                                        { id: 'glass', name: 'Glass', desc: 'Frosted' },
                                        { id: 'luxury', name: 'Luxury', desc: 'Gold & Black' },
                                    ].map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setData({ ...data, theme: { ...data.theme, style: style.id as any } })}
                                            className={`p-4 rounded-2xl border text-left transition-all ${
                                                data.theme.style === style.id
                                                    ? 'border-brand-accent bg-brand-accent-soft'
                                                    : 'border-brand-border bg-brand-surface hover:border-brand-text-muted'
                                            }`}
                                        >
                                            <div className="font-bold text-brand-text-primary mb-1">{style.name}</div>
                                            <div className="text-xs text-brand-text-muted font-medium">{style.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-brand-text-muted uppercase tracking-widest mb-4">Typography</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Inter', 'Outfit', 'Roboto', 'Playfair Display', 'JetBrains Mono', 'Lexend', 'Bricolage Grotesque'].map((font) => (
                                        <button
                                            key={font}
                                            onClick={() => setData({ ...data, theme: { ...data.theme, fontFamily: font } })}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                                                data.theme.fontFamily === font
                                                    ? 'border-brand-accent bg-brand-accent text-white'
                                                    : 'border-brand-border text-brand-text-secondary hover:border-brand-text-muted hover:bg-brand-surface'
                                            }`}
                                            style={{ fontFamily: font === 'JetBrains Mono' ? 'monospace' : font }}
                                        >
                                            {font === 'JetBrains Mono' ? 'Mono' : font}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Live Preview Panel */}
            <div className="hidden lg:flex w-[480px] bg-brand-bg border-l border-brand-border items-center justify-center relative overflow-hidden shrink-0">
                <div className="w-full max-w-[360px] relative z-10 scale-[0.85] origin-center">
                    <PhonePreview data={data} />
                </div>
            </div>

            {/* Mobile Preview Floating Button */}
            <button 
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-brand-accent text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
                onClick={() => {
                    // Quick toggle to a preview modal could go here, for now it's just a hint
                    alert('Preview is always visible on Desktop. On mobile, we will add a drawer here.');
                }}
            >
                <Eye size={18} /> Preview
            </button>

            <ShareModal card={data} isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
        </div>
    );
}
