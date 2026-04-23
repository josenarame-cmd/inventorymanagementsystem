import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    Truck, 
    ShoppingCart, 
    TrendingUp, 
    Activity,
    LogOut,
    Menu,
    Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const { currency, setCurrency } = useCurrency();

    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER_SUPERVISOR', 'FINANCE_ACCOUNTANT'] },
        { path: '/intelligence-center', name: 'Intelligence', icon: Activity, roles: ['SUPER_ADMIN', 'MANAGER_SUPERVISOR'] },
        { path: '/inventory', name: 'Inventory', icon: Package, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER_SUPERVISOR', 'OPERATIONS_STAFF'] },
        { path: '/suppliers', name: 'Suppliers', icon: Truck, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER_SUPERVISOR'] },
        { path: '/customers', name: 'Customers', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER_SUPERVISOR'] },
        { path: '/purchases', name: 'Purchases', icon: ShoppingCart, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER_SUPERVISOR', 'OPERATIONS_STAFF', 'FINANCE_ACCOUNTANT'] },
        { path: '/sales', name: 'Sales', icon: TrendingUp, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER_SUPERVISOR', 'OPERATIONS_STAFF', 'FINANCE_ACCOUNTANT'] },
    ];

    const adminItems = [
        { path: '/audit-logs', name: 'Audit Logs', icon: Shield, roles: ['SUPER_ADMIN'] },
        { path: '/users', name: 'Manage Users', icon: Users, roles: ['SUPER_ADMIN'] },
    ];

    return (
        <div className="h-screen w-64 glass-panel border-r border-white/10 text-white flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 flex items-center justify-center border-b border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-50"></div>
                <img src="/logo.png" alt="VIZION BOT Logo" className="h-20 object-contain mix-blend-screen brightness-200 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.filter(item => !item.roles || item.roles.includes(user?.role || '')).map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                                isActive 
                                ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] border border-white/20' 
                                : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                <div className="pt-4 mt-4 border-t border-white/10">
                    <label className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">System Administration</label>
                    {adminItems.filter(item => item.roles.includes(user?.role || '')).map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                                    isActive 
                                    ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-[0_0_15px_rgba(192,132,252,0.4)] border border-white/20' 
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="px-6 py-4 border-t border-white/10">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">System Currency</label>
                <select 
                    value={currency.code} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white text-xs rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer backdrop-blur-md"
                >
                    <option value="USD">USD ($)</option>
                    <option value="RWF">RWF (FRW)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                </select>
            </div>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-black/20 mb-2 border border-white/5">
                    <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                        {user?.profilePictureUrl ? (
                            <img src={`http://localhost:8086${user.profilePictureUrl}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.username?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white">{user?.username}</p>
                        <p className="text-[10px] text-blue-300 font-medium uppercase tracking-wider truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/30"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
