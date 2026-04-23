import React, { useState, useEffect } from 'react';
import { 
    Cpu, 
    ShieldCheck, 
    Activity, 
    Zap, 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    Database, 
    Server,
    ArrowUpRight,
    Search
} from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const IntelligenceCenter = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sRes, aRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/audit-logs')
                ]);
                setStats(sRes.data);
                setAuditLogs(aRes.data.slice(0, 10));
            } catch (err) {
                console.error('Failed to fetch intelligence data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const systemHealth = [
        { name: 'Core Engine', status: 'Optimal', health: 100, icon: Cpu, color: 'text-emerald-500' },
        { name: 'Database Node', status: 'Active', health: 98, icon: Database, color: 'text-blue-500' },
        { name: 'Security Matrix', status: 'Encrypted', health: 100, icon: ShieldCheck, color: 'text-indigo-500' },
        { name: 'API Gateway', status: 'Stable', health: 99, icon: Zap, color: 'text-amber-500' },
    ];

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Neural Link...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Intelligence Center
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium">Real-time system diagnostics and operational oversight.</p>
                </div>
                <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Global Status: Operational</span>
                </div>
            </div>

            {/* System Diagnostic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemHealth.map((sys, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-gray-50 group-hover:scale-110 transition-transform`}>
                                <sys.icon className={sys.color} size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Health Score</p>
                                <p className="text-lg font-black text-gray-900">{sys.health}%</p>
                            </div>
                        </div>
                        <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">{sys.name}</h3>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${sys.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${sys.health}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sys.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Alerts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                <Activity className="text-blue-600" size={18} /> Active Alerts Feed
                            </h3>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Clear All</button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {stats?.lowStockCount > 0 ? (
                                <div className="p-8 flex items-start gap-5 hover:bg-gray-50/50 transition-colors group">
                                    <div className="p-4 rounded-2xl bg-amber-50 text-amber-500 shrink-0">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-black text-gray-900 group-hover:text-amber-600 transition-colors uppercase tracking-tight">Critical Stock Threshold</p>
                                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">Priority: High</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                            System detected <span className="font-bold text-gray-900">{stats.lowStockCount} items</span> below the defined minimum quantity. Immediate replenishment recommended to avoid service disruption.
                                        </p>
                                        <div className="mt-6 flex items-center gap-4">
                                            <button 
                                                onClick={() => navigate('/inventory')}
                                                className="px-5 py-2 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                                            >
                                                Action Required
                                            </button>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock size={12} /> Detected 14m ago
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-xl">
                                        <ShieldCheck className="text-emerald-500" size={32} />
                                    </div>
                                    <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No Active Alerts</p>
                                    <p className="text-sm text-gray-500 mt-2">All systems are currently performing within expected parameters.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operational Velocity Chart (Mock) */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                <Zap className="text-blue-600" size={18} /> Operational Velocity
                            </h3>
                            <div className="flex gap-2">
                                {['1H', '24H', '7D'].map(t => (
                                    <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === '24H' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { time: '00:00', val: 45 }, { time: '04:00', val: 32 }, { time: '08:00', val: 89 },
                                    { time: '12:00', val: 120 }, { time: '16:00', val: 95 }, { time: '20:00', val: 65 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                                    <Tooltip 
                                        contentStyle={{backgroundColor: '#111827', border: 'none', borderRadius: '16px', padding: '12px'}}
                                        itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                                    />
                                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right: Security Log Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 mb-6">
                            <Clock className="text-purple-600" size={18} /> Event Timeline
                        </h3>
                        <div className="space-y-6">
                            {auditLogs.map((log, i) => (
                                <div key={i} className="relative pl-6 pb-6 border-l-2 border-gray-50 last:border-0 last:pb-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{log.action}</p>
                                        <p className="text-[10px] text-gray-500 mt-1 truncate">{log.entityName || log.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => navigate('/audit-logs')}
                            className="w-full mt-6 py-3 bg-gray-50 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                            Explore Archive
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                            <Server size={64} />
                        </div>
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Neural Node Status</h4>
                        <p className="text-xl font-bold leading-tight">Master Intelligence Core is fully engaged.</p>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-gray-900 bg-blue-500 flex items-center justify-center text-[8px] font-bold">V{i}</div>
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">3 Virtualized Agents Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceCenter;
