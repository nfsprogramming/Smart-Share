import { useState, useEffect } from 'react';
import { getContactSubmissions } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Download, Users, Mail, Phone, Calendar, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export function Contacts() {
    const { user } = useAuth();
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        getContactSubmissions(user.uid).then(data => {
            setContacts(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [user]);

    const handleExportCSV = () => {
        if (contacts.length === 0) return;
        
        const headers = ['Name', 'Email', 'Phone', 'Message', 'Date'];
        const rows = contacts.map(c => [
            `"${c.name || ''}"`,
            `"${c.email || ''}"`,
            `"${c.phone || ''}"`,
            `"${c.message || ''}"`,
            `"${new Date(c.createdAt).toLocaleDateString()}"`
        ]);
        
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `smartshare_contacts_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="auto-container py-8 animate-fade-in">
            <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary mb-2 tracking-tight">Contacts</h1>
                    <p className="text-brand-text-secondary font-medium">Manage leads and connections from your profile.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={contacts.length === 0}
                    className="flex items-center justify-center gap-2 bg-brand-surface hover:bg-brand-elevated text-brand-text-primary px-5 py-3 rounded-xl text-sm font-bold border border-brand-border transition-all disabled:opacity-50"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
                </div>
            ) : contacts.length === 0 ? (
                <div className="bg-brand-surface border border-brand-border rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-2xl">
                    <div className="w-20 h-20 bg-brand-elevated rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-border">
                        <Users size={32} className="text-brand-text-muted" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text-primary mb-3">No Contacts Yet</h2>
                    <p className="text-brand-text-secondary">When visitors submit their information on your profile, they will appear here.</p>
                </div>
            ) : (
                <div className="bg-brand-surface border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-brand-border bg-brand-surface/80">
                                    <th className="p-4 text-xs font-bold text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Name</th>
                                    <th className="p-4 text-xs font-bold text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Contact Info</th>
                                    <th className="p-4 text-xs font-bold text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Date</th>
                                    <th className="p-4 text-xs font-bold text-brand-text-muted uppercase tracking-widest whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact, i) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={contact.id} 
                                        className="border-b border-brand-border/50 hover:bg-brand-elevated transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-brand-text-primary">{contact.name}</div>
                                        </td>
                                        <td className="p-4 space-y-1">
                                            {contact.email && (
                                                <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                                    <Mail size={14} className="text-brand-text-muted" />
                                                    <a href={`mailto:${contact.email}`} className="hover:text-brand-accent">{contact.email}</a>
                                                </div>
                                            )}
                                            {contact.phone && (
                                                <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
                                                    <Phone size={14} className="text-brand-text-muted" />
                                                    <a href={`tel:${contact.phone}`} className="hover:text-brand-accent">{contact.phone}</a>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-brand-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(contact.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <button className="p-2 text-brand-text-muted hover:text-brand-text-primary transition-colors rounded-lg hover:bg-brand-elevated">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
