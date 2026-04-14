import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    Users, 
    Truck, 
    ShoppingCart, 
    TrendingUp, 
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
        { path: '/', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/inventory', name: 'Inventory', icon: Package },
        { path: '/suppliers', name: 'Suppliers', icon: Truck },
        { path: '/customers', name: 'Customers', icon: Users },
        { path: '/purchases', name: 'Purchases', icon: ShoppingCart },
        { path: '/sales', name: 'Sales', icon: TrendingUp },
    ];

    const adminItems = [
        { path: '/audit-logs', name: 'Audit Logs', icon: Shield },
        { path: '/users', name: 'Manage Users', icon: Users },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 flex items-center justify-center border-b border-gray-800">
                <img src="/logo.png" alt="VIZION BOT Logo" className="h-20 object-contain mix-blend-screen brightness-200 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                isActive 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-6 py-4 border-t border-gray-800">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">System Currency</label>
                <select 
                    value={currency.code} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-gray-800 border-none text-white text-xs rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                >
                    <option value="USD">USD ($)</option>
                    <option value="RWF">RWF (FRW)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                </select>
            </div>

            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-4 py-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden">
                        {user?.profilePictureUrl ? (
                            <img src={`http://localhost:8086${user.profilePictureUrl}`} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user?.username?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
