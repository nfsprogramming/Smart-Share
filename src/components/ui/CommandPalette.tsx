import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Edit, Link2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Toggle on Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const commands = [
        { id: 'dashboard', name: 'Go to Dashboard', icon: User, action: () => navigate('/') },
        { id: 'new-card', name: 'Create New Card', icon: Edit, action: () => navigate('/editor') },
        { id: 'quick-qr', name: 'View Quick QR', icon: Link2, action: () => navigate('/quick-qr') },
        { id: 'scanner', name: 'Open Scanner', icon: Search, action: () => navigate('/scan') },
        { id: 'settings', name: 'Settings', icon: Settings, action: () => alert('Settings coming soon') },
    ];

    const filteredCommands = commands.filter((command) =>
        command.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (action: () => void) => {
        action();
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-brand-bg/60 backdrop-blur-sm"
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.15 }}
                    className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden mx-4"
                >
                    <div className="flex items-center px-4 py-4 border-b border-brand-border">
                        <Search className="text-brand-text-secondary mr-3" size={20} />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Type a command or search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 bg-transparent text-brand-text-primary outline-none placeholder:text-brand-text-muted"
                        />
                        <div className="text-xs text-brand-text-secondary bg-brand-elevated px-2 py-1 rounded">ESC</div>
                    </div>

                    <div className="max-h-72 overflow-y-auto py-2">
                        {filteredCommands.length > 0 ? (
                            filteredCommands.map((command) => (
                                <button
                                    key={command.id}
                                    onClick={() => handleSelect(command.action)}
                                    className="w-full flex items-center px-4 py-3 hover:bg-brand-accent/10 text-left transition-colors group"
                                >
                                    <command.icon className="text-brand-text-secondary group-hover:text-brand-accent mr-3" size={18} />
                                    <span className="text-brand-text-primary group-hover:text-brand-accent font-medium">
                                        {command.name}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-brand-text-muted">
                                No results found.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
