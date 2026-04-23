import React, { useEffect, useState } from 'react';
import { 
    LayoutDashboard, 
    TrendingUp, 
    ShoppingCart, 
    Package, 
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    Users,
    Truck,
    Shield
} from 'lucide-react';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { format } = useCurrency();
    const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Revenue', value: format(stats?.totalSalesAmount), icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Total Purchases', value: format(stats?.totalPurchaseAmount), icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Inventory Items', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'Low Stock Alerts', value: stats?.lowStockCount || 0, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    const handleExport = () => {
        if (!stats) return;
        const csvContent = 
            "Metric,Value\n" +
            `Total Revenue,${stats.totalSalesAmount}\n` +
            `Total Purchases,${stats.totalPurchaseAmount}\n` +
            `Inventory Items,${stats.totalProducts}\n` +
            `Low Stock Alerts,${stats.lowStockCount}\n` +
            `Total Customers,${stats.totalCustomers}\n` +
            `Global Suppliers,${stats.totalSuppliers}`;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) return <div className="flex h-96 items-center justify-center">Loading Stats...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h2>
                    <p className="text-gray-500 mt-1">Real-time overview of your inventory and financials.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleExport}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Export Report
                    </button>
                    <Link to="/sales" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center">New Transaction</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                            <span className="flex items-center text-emerald-500 text-sm font-medium">
                                +12% <ArrowUpRight size={16} />
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                ))}
            </div>

            {user?.role === 'SUPER_ADMIN' && (
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl shadow-lg border border-gray-700 text-white mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="text-emerald-400" size={24} /> 
                        Super Admin System Control
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/users" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl flex items-center justify-between border border-gray-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Users className="text-blue-400" size={20} />
                                <span className="font-medium">User & Access Management</span>
                            </div>
                            <ArrowUpRight className="text-gray-500 group-hover:text-blue-400 transition-colors" size={18} />
                        </Link>
                        <Link to="/audit-logs" className="bg-gray-800 hover:bg-gray-700 p-4 rounded-2xl flex items-center justify-between border border-gray-700 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Shield className="text-purple-400" size={20} />
                                <span className="font-medium">System Audit Logs</span>
                            </div>
                            <ArrowUpRight className="text-gray-500 group-hover:text-purple-400 transition-colors" size={18} />
                        </Link>
                    </div>
                </div>
            )}

            {user?.role === 'ADMIN' && (
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 rounded-3xl shadow-lg border border-blue-700 text-white mb-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Package className="text-blue-400" size={24} /> 
                        Operational Control Panel
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/inventory" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-between border border-white/10 transition-colors group text-white">
                            <div className="flex items-center gap-3">
                                <Package className="text-blue-300" size={20} />
                                <span className="font-medium">Inventory Mastery</span>
                            </div>
                            <ArrowUpRight className="text-white/40 group-hover:text-white transition-colors" size={18} />
                        </Link>
                        <Link to="/suppliers" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-between border border-white/10 transition-colors group text-white">
                            <div className="flex items-center gap-3">
                                <Truck className="text-blue-300" size={20} />
                                <span className="font-medium">Supplier Network</span>
                            </div>
                            <ArrowUpRight className="text-white/40 group-hover:text-white transition-colors" size={18} />
                        </Link>
                        <Link to="/customers" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-between border border-white/10 transition-colors group text-white">
                            <div className="flex items-center gap-3">
                                <Users className="text-blue-300" size={20} />
                                <span className="font-medium">Customer Database</span>
                            </div>
                            <ArrowUpRight className="text-white/40 group-hover:text-white transition-colors" size={18} />
                        </Link>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue vs Purchases</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[]}> {/* Data would come from a trends API */}
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff'}}
                                    itemStyle={{color: '#fff'}}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Entities</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <Users size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{stats?.totalCustomers || 0}</h4>
                                <p className="text-sm text-gray-500">Active Customers</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{stats?.totalSuppliers || 0}</h4>
                                <p className="text-sm text-gray-500">Global Suppliers</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h4>
                        <p className="text-xs text-gray-500 mb-4">Check our documentation for advanced inventory workflows.</p>
                        <a href="http://localhost:8086/swagger-ui/index.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-bold hover:underline">View Docs &rarr;</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
