import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Zap, ScanLine, LogOut, ArrowLeft, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { triggerHapticSelection } from '../utils/capacitor';
import { CommandPalette } from '../components/ui/CommandPalette';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Contacts', path: '/contacts', icon: UserPlus },
        { name: 'Quick QR', path: '/quick-qr', icon: Zap },
        { name: 'Scanner', path: '/scan', icon: ScanLine },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans selection:bg-brand-accent-soft overflow-x-hidden flex flex-col">
            <CommandPalette />
            
            {/* Background decoration (Subtle soft accent) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="hidden md:block absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-accent-soft rounded-full blur-[120px] opacity-20" />
            </div>

            {/* Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-md md:backdrop-blur-3xl border-b border-brand-border shadow-2xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-20" />
                <div className="auto-container h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 relative z-10">
                        {/* Page Back Button (Visible on mobile for internal pages) */}
                        {location.pathname !== '/' && location.pathname !== '/login' && (
                            <button
                                onClick={() => navigate(-1)}
                                className="md:hidden p-2 -ml-2 text-brand-text-muted hover:text-brand-text-primary transition-colors touch-manipulation"
                            >
                                <ArrowLeft size={24} />
                            </button>
                        )}

                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-1 rounded-lg bg-white/5 group-hover:bg-brand-accent/10 group-hover:scale-105 transition-all border border-brand-border">
                                <img src="/favicon.png" alt="Logo" className="w-5 h-5 object-contain opacity-90 group-hover:opacity-100" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-brand-text-primary">
                                Smart Share
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 relative z-10">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative py-5 text-sm font-semibold transition-colors ${isActive ? 'text-brand-text-primary' : 'text-brand-text-secondary hover:text-brand-text-primary'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <item.icon size={16} className={isActive ? 'text-brand-accent' : ''} />
                                        {item.name}
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-brand-accent rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-semibold text-brand-text-muted hover:text-brand-status-danger transition-colors py-5"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </nav>

                    {/* Mobile Logout (Header) */}
                    <button
                        onClick={handleLogout}
                        className="md:hidden p-2 text-brand-text-muted hover:text-brand-status-danger transition-colors relative z-10"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main
                className="relative flex-1 flex flex-col z-10"
                style={{
                    paddingTop: 'clamp(8rem, 8rem + env(safe-area-inset-top), 12rem)',
                    paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))'
                }}
            >
                {children}
            </main>

            {/* Footer - Only visible on desktop or large screens */}
            <footer className="hidden md:block border-t border-brand-border py-10 text-center relative z-10 bg-brand-bg mt-auto">
                <div className="auto-container">
                    <p className="text-brand-text-muted fluid-text text-sm">
                        Copyrights reserved by <span className="text-brand-text-primary font-bold">Smart Share</span>.
                    </p>
                </div>
            </footer>

            {/* Bottom Nav - Native App Style for Mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-bg/90 backdrop-blur-md border-t border-brand-border pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-4 h-20">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => triggerHapticSelection()}
                                className="flex flex-col items-center justify-center gap-1 group relative touch-manipulation"
                            >
                                <div className={`p-1 rounded-lg transition-all duration-300 ${isActive ? 'text-brand-accent scale-110' : 'text-brand-text-muted group-hover:text-brand-text-secondary'}`}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-brand-text-primary' : 'text-brand-text-muted'}`}>
                                    {item.name.split(' ')[0]}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-brand-accent rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
