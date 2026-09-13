
export interface SocialLink {
    id: string;
    title: string;
    url: string;
    icon: string; // lucide icon name or simple string for now
    active: boolean;
}

export interface CardTheme {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    style: 'classic' | 'modern' | 'glass' | 'neon' | 'luxury' | 'mesh' | 'dark' | 'minimal' | 'midnight' | 'aurora' | 'editorial' | 'mono';
}

export interface ContactInfo {
    email?: string;
    phone?: string;
    website?: string;
    whatsapp?: string;
}

export interface CardData {
    id: string;
    username: string;
    fullName: string;
    jobTitle: string;
    company?: string;
    location?: string;
    bio: string;
    avatarUrl: string;
    coverUrl?: string;
    links: SocialLink[];
    theme: CardTheme;
    contactInfo?: ContactInfo;
    visibility: 'public' | 'unlisted' | 'private' | 'draft';
    // UPI Payment info (optional)
    upiId?: string; // e.g., "yourname@paytm" or "9876543210@ybl"
    upiName?: string; // Name for UPI payment
    views?: number;
    userId?: string;
    updatedAt?: string;
}

export interface ContactSubmission {
    id: string;
    cardId: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    createdAt: string;
}

export interface AnalyticsEvent {
    id: string;
    cardId: string;
    eventType: 'profile_view' | 'link_click' | 'qr_scan' | 'contact_save' | 'profile_share' | 'contact_submission';
    linkId?: string; // If it's a link click
    timestamp: string;
    source?: string;
}

// Initial state helper
export const initialCardData: CardData = {
    id: crypto.randomUUID(),
    username: '',
    fullName: 'Alex Innovation',
    jobTitle: 'Product Designer',
    company: 'SmartShare',
    location: 'San Francisco, CA',
    bio: 'Creating digital experiences that matter.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    links: [
        { id: '1', title: 'Portfolio', url: 'https://alex.design', icon: 'Globe', active: true },
        { id: '2', title: 'LinkedIn', url: 'https://linkedin.com/in/alex', icon: 'Linkedin', active: true },
        { id: '3', title: 'Instagram', url: 'https://instagram.com/alex', icon: 'Instagram', active: true },
    ],
    theme: {
        primaryColor: '#3b82f6', // blue-500
        backgroundColor: '#0f172a', // slate-900
        fontFamily: 'Inter',
        style: 'modern',
    },
    visibility: 'public',
    contactInfo: {
        email: 'hello@alex.design'
    }
};
