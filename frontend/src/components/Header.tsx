import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User, LogOut, Package, Users, AlertTriangle, ChevronRight, X, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{ products: any[], customers: any[] }>({ products: [], customers: [] });
    const [showSearch, setShowSearch] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch notifications (Low stock)
        api.get('/dashboard/stats').then(res => {
            const lowStock = res.data.lowStockCount || 0;
            if (lowStock > 0) {
                setNotifications([{
                    id: 1,
                    type: 'alert',
                    title: 'Low Stock Warning',
                    message: `There are ${lowStock} products currently low on stock.`,
                    icon: AlertTriangle,
                    color: 'text-amber-500',
                    bg: 'bg-amber-50',
                    link: '/inventory'
                }]);
            }
        }).catch(console.error);

        // Click outside listeners
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults({ products: [], customers: [] });
            return;
        }

        try {
            const [pRes, cRes] = await Promise.all([
                api.get('/products'),
                api.get('/customers')
            ]);

            const filteredProducts = pRes.data.filter((p: any) => 
                p.name.toLowerCase().includes(term.toLowerCase()) || 
                p.category?.toLowerCase().includes(term.toLowerCase())
            ).slice(0, 5);

            const filteredCustomers = cRes.data.filter((c: any) => 
                c.name.toLowerCase().includes(term.toLowerCase()) || 
                c.email.toLowerCase().includes(term.toLowerCase())
            ).slice(0, 5);

            setSearchResults({ products: filteredProducts, customers: filteredCustomers });
            setShowSearch(true);
        } catch (err) {
            console.error('Search failed', err);
        }
    };

    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative" ref={searchRef}>
                    <div className="relative group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-blue-600' : 'text-gray-400'}`} size={18} />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchTerm.length >= 2 && setShowSearch(true)}
                            placeholder="Find products, customers..." 
                            className="bg-gray-100/50 border-none rounded-2xl py-3 pl-12 pr-10 w-80 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-bold" 
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearch && (searchTerm.length >= 2) && (
                        <div className="absolute top-full mt-2 w-[450px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-fade-in translate-y-0">
                            <div className="p-6">
                                {searchResults.products.length === 0 && searchResults.customers.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search className="text-gray-300" size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-400">No matches found for "{searchTerm}"</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {searchResults.products.length > 0 && (
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Package size={12} className="text-blue-500" /> Inventory Items Items
                                                </h4>
                                                <div className="space-y-1">
                                                    {searchResults.products.map(p => (
                                                        <button 
                                                            key={p.id}
                                                            onClick={() => { navigate('/inventory'); setShowSearch(false); }}
                                                            className="w-full flex items-center justify-between p-3 hover:bg-blue-50 rounded-2xl transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                                    {p.name.substring(0, 2)}
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-sm font-bold text-gray-900">{p.name}</p>
                                                                    <p className="text-[10px] text-gray-400">{p.category} • {p.remainingQty} units</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {searchResults.customers.length > 0 && (
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Users size={12} className="text-emerald-500" /> Client Records
                                                </h4>
                                                <div className="space-y-1">
                                                    {searchResults.customers.map(c => (
                                                        <button 
                                                            key={c.id}
                                                            onClick={() => { navigate('/customers'); setShowSearch(false); }}
                                                            className="w-full flex items-center justify-between p-3 hover:bg-emerald-50 rounded-2xl transition-colors group"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                                                                    {c.name.substring(0, 1)}
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                                                                    <p className="text-[10px] text-gray-400">{c.email}</p>
                                                                </div>
                                                            </div>
                                                            <ChevronRight size={16} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Search Active</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative" ref={notificationRef}>
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p-3 rounded-2xl transition-all ${showNotifications ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && (
                            <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 ${showNotifications ? 'bg-white border-blue-600' : 'bg-red-500 border-white'}`} />
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-fade-in z-50">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-black text-gray-900 uppercase tracking-tight">Intelligence Feed</h3>
                                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                    {notifications.length} Alerts
                                </span>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <button 
                                            key={notif.id}
                                            onClick={() => { navigate(notif.link); setShowNotifications(false); }}
                                            className="w-full p-6 flex items-start gap-4 hover:bg-gray-50 border-b border-gray-50 transition-colors group text-left"
                                        >
                                            <div className={`w-12 h-12 rounded-2xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
                                                <notif.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{notif.title}</p>
                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.message}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest">Just Now</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck size={32} className="text-emerald-500" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-600">System Secure</p>
                                        <p className="text-xs text-gray-400 mt-1">No active alerts at this time.</p>
                                    </div>
                                )}
                            </div>
                            <button className="w-full py-4 bg-gray-50 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                View Intelligence Center
                            </button>
                        </div>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-gray-100" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-gray-900 leading-none capitalize">{user?.name || 'Administrator'}</p>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.role?.replace('_', ' ') || 'SYSTEM USER'}</p>
                    </div>
                    <div className="relative group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 cursor-pointer group-hover:rotate-12 transition-transform">
                            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                        </div>
                        
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Account</p>
                                <p className="text-xs font-bold text-gray-900 truncate">{user?.email}</p>
                            </div>
                            <button className="w-full px-5 py-3 text-left text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors">
                                <User size={18} /> Account Profile
                            </button>
                            <button 
                                onClick={logout}
                                className="w-full px-5 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                            >
                                <LogOut size={18} /> Terminate Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* ShieldCheck icon import fix if needed, but I used shieldcheck earlier */}
        </header>
    );
};

export default Header;
