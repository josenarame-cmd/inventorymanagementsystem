import React, { useEffect, useState } from 'react';
import { Shield, Trash2, AlertTriangle, UserPlus, X, Lock, User, Mail, Eye, EyeOff, ChevronDown, Users as UsersIcon, Activity, PenLine } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface UserDto {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    profilePictureUrl: string | null;
    enabled: boolean;
}

const ROLES = [
    { value: 'SUPER_ADMIN',        label: 'Super Admin',        desc: 'Full system control: Users, Roles, Settings',         color: 'bg-red-100 text-red-700' },
    { value: 'ADMIN',              label: 'Admin',              desc: 'Operational control: Inventory, Suppliers, Customers', color: 'bg-orange-100 text-orange-700' },
    { value: 'OPERATIONS_STAFF',   label: 'Operations Staff',   desc: 'Daily work: Purchase orders, Sales, Records',         color: 'bg-blue-100 text-blue-700' },
    { value: 'MANAGER_SUPERVISOR', label: 'Manager/Supervisor', desc: 'Monitoring: Reports, Approve transactions',          color: 'bg-emerald-100 text-emerald-700' },
    { value: 'FINANCE_ACCOUNTANT', label: 'Finance/Accountant', desc: 'Money data: Payments, Receipts, Financial reports',    color: 'bg-purple-100 text-purple-700' },
];

const roleBadge = (role: string) => {
    const r = ROLES.find(x => x.value === role);
    return r ? r.color : 'bg-gray-100 text-gray-600';
};

const AddUserModal = ({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) => {
    const [formData, setFormData] = useState({ username: '', email: '', fullName: '', password: '', role: 'OPERATIONS_STAFF' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setFormData(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/users', formData);
            onCreated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-md shadow-blue-500/30">
                            <UserPlus size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                            <p className="text-xs text-gray-500">Create a system account with a specific role</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-xl text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input type="text" placeholder="Jane Smith" required
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all"
                                value={formData.fullName} onChange={set('fullName')} />
                        </div>
                    </div>

                    {/* Username + Email */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                            <input type="text" placeholder="janesmith" required
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3 px-4 text-sm text-gray-900 outline-none transition-all"
                                value={formData.username} onChange={set('username')} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                                <input type="email" placeholder="jane@company.com" required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all"
                                    value={formData.email} onChange={set('email')} />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Temporary Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                            <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" required
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition-all"
                                value={formData.password} onChange={set('password')} />
                            <button type="button" onClick={() => setShowPass(v => !v)}
                                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Role</label>
                        <div className="relative">
                            <Shield size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                            <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none" />
                            <select
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all appearance-none cursor-pointer"
                                value={formData.role} onChange={set('role')}>
                                {ROLES.map(r => (
                                    <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                                ))}
                            </select>
                        </div>
                        {/* Role preview badge */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${roleBadge(formData.role)}`}>
                            <Shield size={11} />
                            {ROLES.find(r => r.value === formData.role)?.label}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm active:scale-95">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all text-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                            ) : (
                                <><UserPlus size={16} /> Create User</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditUserModal = ({ user, onClose, onUpdated }: { user: UserDto; onClose: () => void; onUpdated: () => void }) => {
    const [formData, setFormData] = useState({ fullName: user.fullName, email: user.email, role: user.role });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/users/${user.id}/role?role=${formData.role}`);
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in border border-amber-100">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                            <PenLine size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Modify Identity</h3>
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Adjusting: {user.username}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    {error && <div className="bg-red-50 p-4 rounded-2xl text-red-700 text-xs font-bold border border-red-100">{error}</div>}
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input type="text" className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all"
                                value={formData.fullName} readOnly />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Role</label>
                        <div className="relative group">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <select 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all cursor-pointer appearance-none"
                                value={formData.role} 
                                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                            >
                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all text-xs">Dismiss</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-600 transition-all text-xs shadow-xl shadow-amber-500/30">
                            {loading ? 'Processing...' : 'Apply Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Users = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [viewingUser, setViewingUser] = useState<UserDto | null>(null);
    const [editingUser, setEditingUser] = useState<UserDto | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await api.put(`/users/${userId}/role?role=${newRole}`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update role');
        }
    };

    const handleToggleStatus = async (userId: number) => {
        try {
            const response = await api.patch(`/users/${userId}/toggle-status`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: response.data.enabled } : u));
        } catch (err: any) {
            alert('Failed to toggle user status');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Permanently delete this user? This action cannot be undone.')) return;
        setDeletingId(userId);
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err: any) {
            alert('Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading users...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex h-96 items-center justify-center">
            <div className="flex items-center gap-3 text-red-500 font-medium">
                <AlertTriangle size={20} /> {error}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">System Users</h2>
                    <p className="text-gray-500 mt-1">Manage platform access, privileges, and user accounts.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 self-start"
                >
                    <UserPlus size={18} /> Add User
                </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total Users', value: users.length, color: 'from-blue-500 to-blue-600' },
                    { label: 'Admins',      value: users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN').length, color: 'from-red-500 to-rose-600' },
                    { label: 'Managers',    value: users.filter(u => u.role === 'MANAGER_SUPERVISOR').length, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Staff',       value: users.filter(u => u.role === 'OPERATIONS_STAFF').length, color: 'from-blue-400 to-indigo-500' },
                    { label: 'Finance',     value: users.filter(u => u.role === 'FINANCE_ACCOUNTANT').length, color: 'from-purple-500 to-purple-600' },
                ].map(stat => (
                    <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-sm`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50 flex items-center gap-3">
                    <UsersIcon size={20} className="text-blue-600" />
                    <h3 className="font-bold text-gray-800">All Accounts ({users.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Account</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => {
                                const isCurrentUser = currentUser?.username === u.username;
                                return (
                                    <tr key={u.id} className="hover:bg-blue-50/20 transition-colors group">
                                        {/* Account */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-sm overflow-hidden flex-shrink-0">
                                                    {u.profilePictureUrl ? (
                                                        <img src={`http://localhost:8086${u.profilePictureUrl}`} alt={u.username} className="w-full h-full object-cover" />
                                                    ) : (
                                                        (u.fullName || u.username).charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        {u.fullName || 'No Name'}
                                                        {isCurrentUser && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">You</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">@{u.username}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 text-sm text-gray-600">{u.email || '—'}</td>

                                        {/* Status */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                                {u.enabled ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            {isCurrentUser || (currentUser?.role !== 'SUPER_ADMIN' && currentUser?.role !== 'ADMIN') ? (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${roleBadge(u.role)}`}>
                                                    <Shield size={11} /> {ROLES.find(r => r.value === u.role)?.label || u.role}
                                                </span>
                                            ) : (
                                                <select
                                                    className={`border-none rounded-xl text-xs font-bold px-3 py-1.5 outline-none cursor-pointer appearance-none ${roleBadge(u.role)}`}
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                >
                                                    {ROLES.map(r => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN') && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setViewingUser(u)}
                                                        className="p-2 rounded-xl text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all"
                                                        title="View information"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN') && (
                                                        <button
                                                            onClick={() => setEditingUser(u)}
                                                            className="p-2 rounded-xl text-amber-500 bg-amber-50 hover:bg-amber-100 transition-all"
                                                            title="Update user"
                                                        >
                                                            <PenLine size={16} />
                                                        </button>
                                                    )}
                                                    {!isCurrentUser && (
                                                        <>
                                                            <button
                                                                onClick={() => handleToggleStatus(u.id)}
                                                                className={`p-2 rounded-xl transition-all ${u.enabled ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'}`}
                                                                title={u.enabled ? 'Deactivate user' : 'Activate user'}
                                                            >
                                                                <Shield size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(u.id)}
                                                                disabled={deletingId === u.id}
                                                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-xl transition-all disabled:opacity-50"
                                                                title="Delete user"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="py-20 text-center">
                        <UsersIcon size={40} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-gray-400 font-medium">No users found</p>
                    </div>
                )}
            </div>

            {/* Role Legend */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2"><Shield size={16} className="text-blue-500" /> Role Permissions Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ROLES.map(r => (
                        <div key={r.value} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
                            <span className={`mt-0.5 px-2 py-0.5 rounded-md text-xs font-bold flex-shrink-0 ${r.color}`}>{r.label}</span>
                            <p className="text-xs text-gray-500">{r.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showAddModal && (
                <AddUserModal
                    onClose={() => setShowAddModal(false)}
                    onCreated={fetchUsers}
                />
            )}

            {viewingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-fade-in p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-blue-600/20">
                                {viewingUser.fullName.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">{viewingUser.fullName}</h3>
                            <p className="text-gray-500 font-medium">@{viewingUser.username}</p>
                            
                            <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${roleBadge(viewingUser.role)}`}>
                                {ROLES.find(r => r.value === viewingUser.role)?.label}
                            </div>

                            <div className="w-full mt-8 space-y-4">
                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><Mail size={16}/></div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-gray-900">{viewingUser.email}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Activity size={16}/></div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                                        <p className="text-sm font-bold text-gray-900">{viewingUser.enabled ? 'Active / Online' : 'Deactivated / Offline'}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setViewingUser(null)}
                                className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUpdated={fetchUsers}
                />
            )}
        </div>
    );
};

export default Users;
