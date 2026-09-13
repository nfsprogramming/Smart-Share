import {
    Instagram,
    Linkedin,
    Github,
    Twitter,
    Globe,
    Mail,
    Phone,
    MapPin,
    Youtube,
    Facebook,
    Twitch,
    Link as LinkIcon, // Alias LinkIcon to avoid confusion
    Music,
    Video,
    FileText,
    Code2 // Fallback or generic code icon
} from 'lucide-react';

// Custom LeetCode Icon
const LeetCode = ({ size = 24, className }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 13h7.5" />
        <path d="M9.424 18H19.5" />
        <path d="M12 8h7.5" />
        <path d="M16.638 3.5s-4.666-.35-7.794 2.148c-3.128 2.5-3.87 6.645-1.42 9.548 2.45 2.904 5.753 2.19 5.753 2.19" strokeLinecap="round" />
    </svg>
);

const iconMap: Record<string, any> = {
    Instagram,
    Linkedin,
    Github,
    Twitter,
    Globe,
    Mail,
    Phone,
    MapPin,
    Youtube,
    Facebook,
    Twitch,
    Link: LinkIcon, // Use LinkIcon here
    Music,
    Video,
    FileText,
    LeetCode, // Added LeetCode
    Code: Code2,
};

interface IconProps {
    name: string;
    className?: string;
    size?: number;
}

export function Icon({ name, className, size = 20 }: IconProps) {
    // Simple fallback if name not found in map
    const IconComponent = iconMap[name] || LinkIcon;
    return <IconComponent className={className} size={size} />;
}
