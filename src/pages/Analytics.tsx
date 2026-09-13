import { useParams } from 'react-router-dom';
import { type CardData } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Users, MousePointer2, Globe, Monitor, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCardFromFirebase } from '../utils/firebase';

// Mock data generator for charts
const generateData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
        name: day,
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 20) + 5,
    }));
};

const deviceData = [
    { name: 'Mobile', value: 65, color: '#FF5C45' }, // brand-accent
    { name: 'Desktop', value: 25, color: '#F5F5F2' }, // brand-text-primary
    { name: 'Tablet', value: 10, color: '#A4A7AE' }, // brand-text-secondary
];

export function Analytics() {
    const { id } = useParams();
    const [card, setCard] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getCardFromFirebase(id).then(data => {
                if (data) setCard(data as CardData);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!card) return null;

    const totalViews = card.views || 0;

    const stats = [
        { label: 'Total Views', value: totalViews, icon: Users, color: 'text-brand-text-primary', bg: 'bg-brand-elevated' },
        { label: 'Link Clicks', value: Math.floor(totalViews * 0.4), icon: MousePointer2, color: 'text-brand-accent', bg: 'bg-brand-accent-soft' },
        { label: 'Unique Visits', value: Math.floor(totalViews * 0.8), icon: Globe, color: 'text-brand-text-secondary', bg: 'bg-brand-surface' },
        { label: 'Avg. Time', value: '1m 45s', icon: Monitor, color: 'text-brand-text-muted', bg: 'bg-brand-bg border border-brand-border' },
    ];

    return (
        <div className="auto-container py-8 animate-fade-in">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary mb-2 tracking-tight">Analytics</h1>
                    <p className="text-brand-text-secondary font-medium">Performance for <span className="text-brand-text-primary font-bold">{card.fullName}</span></p>
                </div>
                <div className="flex items-center gap-2 text-brand-status-success bg-brand-status-success/10 px-4 py-2 rounded-xl font-bold text-sm border border-brand-status-success/20">
                    <ArrowUpRight size={16} />
                    +12% this week
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-brand-surface border border-brand-border p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:border-brand-accent/30 transition-colors">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 shadow-inner border border-brand-border`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="text-4xl font-black text-brand-text-primary mb-2 tracking-tighter">{stat.value}</div>
                        <div className="text-xs font-bold text-brand-text-muted uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-brand-surface border border-brand-border p-6 md:p-8 rounded-3xl shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-brand-text-primary">Engagement Over Time</h3>
                        <select className="bg-brand-elevated border border-brand-border text-brand-text-primary text-sm rounded-lg px-3 py-1 outline-none">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={generateData()}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF5C45" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#FF5C45" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F5F5F2" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F5F5F2" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#6F737C" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6F737C" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#17191F', borderRadius: '16px', border: '1px solid #24272D', color: '#F5F5F2', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#FF5C45" strokeWidth={3} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="clicks" stroke="#F5F5F2" strokeWidth={3} fill="url(#colorClicks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-brand-surface border border-brand-border p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col">
                    <h3 className="text-lg font-bold text-brand-text-primary mb-8">Devices</h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deviceData} layout="vertical" barSize={40}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#A4A7AE" fontSize={12} width={70} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#24272D', opacity: 0.5 }} contentStyle={{ backgroundColor: '#17191F', borderRadius: '12px', border: '1px solid #24272D' }} />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
