import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Lock, Save, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', msg: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                fullName: formData.fullName,
                email: formData.email
            };
            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const response = await api.put('/users/me', updateData);
            
            // Update local auth context if needed
            // login(response.data.token, { ...user, name: response.data.fullName, email: response.data.email });
            
            setStatus({ type: 'success', msg: 'Profile updated successfully' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Account Profile</h2>
                    <p className="text-gray-500 mt-1">Manage your personal information and security settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
                        <div className="relative pt-4">
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 bg-white rounded-[2rem] p-1 shadow-xl mx-auto">
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-[1.8rem] flex items-center justify-center font-black text-gray-400 text-4xl overflow-hidden">
                                        {user?.profilePictureUrl ? (
                                            <img src={`http://localhost:8086${user.profilePictureUrl}`} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.username?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                                <button className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mt-6">{user?.name}</h3>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">{user?.role?.replace('_', ' ')}</p>
                            
                            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Mail size={14} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Email Address</p>
                                        <p className="text-sm font-bold text-gray-700 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Shield size={14} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Access Level</p>
                                        <p className="text-sm font-bold text-gray-700">{user?.role === 'SUPER_ADMIN' ? 'Root Administrator' : 'Standard User'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/50">
                            <h4 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                <User className="text-blue-600" size={18} /> Personal Information
                            </h4>
                        </div>
                        
                        <div className="p-10 space-y-6">
                            {status && (
                                <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'}`}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    {status.msg}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            type="text" 
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Identity</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2 mb-6">
                                    <Lock className="text-amber-500" size={18} /> Security Credentials
                                </h4>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">New Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••"
                                                value={formData.newPassword}
                                                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 px-6 text-sm font-bold outline-none transition-all" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Confirm Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl py-3 px-6 text-sm font-bold outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 italic">Leave password fields blank if you do not wish to change your current credentials.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? 'Saving Changes...' : <><Save size={18} /> Save Profile Settings</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
