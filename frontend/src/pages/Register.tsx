import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Building2 } from 'lucide-react';

const PASSWORD_RULES = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
];

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        fullName: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const passwordStrength = PASSWORD_RULES.filter(r => r.test(formData.password)).length;
    const strengthLabel = ['Weak', 'Fair', 'Strong'][passwordStrength - 1] || '';
    const strengthColor = ['bg-red-400', 'bg-yellow-400', 'bg-emerald-500'][passwordStrength - 1] || 'bg-gray-200';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (passwordStrength < 2) {
            setError('Please choose a stronger password.');
            return;
        }
        setLoading(true);
        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('password', formData.password);
            data.append('email', formData.email);
            data.append('fullName', formData.fullName);
            // role is NOT sent — backend defaults to STAFF
            await authService.register(data);
            navigate('/login', { state: { message: 'Account created! Login to get started.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-lg animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 blur-[60px] bg-cyan-400/40 rounded-full scale-[2.5]" />
                        <img src="/logo.png" alt="VIZION BOT Logo" className="relative h-40 mx-auto object-contain mix-blend-screen brightness-200 contrast-125 drop-shadow-[0_0_40px_rgba(56,189,248,0.8)]" />
                    </div>
                    <p className="text-blue-400 font-bold uppercase tracking-widest text-sm">Inventory Management System</p>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 text-sm mt-1">Fill in your details to request system access.</p>
                        <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                            <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700 font-medium">
                                New accounts are created with <span className="font-bold">Staff</span> access. An administrator can upgrade your role after registration.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-400" size={17} />
                                <input
                                    type="text" placeholder="John Doe" required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3.5 pl-11 pr-4 text-gray-900 transition-all outline-none text-sm"
                                    value={formData.fullName} onChange={set('fullName')}
                                />
                            </div>
                        </div>

                        {/* Username & Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                                <input
                                    type="text" placeholder="johndoe" required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3.5 px-4 text-gray-900 transition-all outline-none text-sm"
                                    value={formData.username} onChange={set('username')}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={16} />
                                    <input
                                        type="email" placeholder="john@company.com" required
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3.5 pl-10 pr-4 text-gray-900 transition-all outline-none text-sm"
                                        value={formData.email} onChange={set('email')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={17} />
                                <input
                                    type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl py-3.5 pl-11 pr-12 text-gray-900 transition-all outline-none text-sm"
                                    value={formData.password} onChange={set('password')}
                                />
                                <button type="button" onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {/* Strength bar */}
                            {formData.password && (
                                <div className="space-y-1 pt-1">
                                    <div className="flex gap-1">
                                        {[0,1,2].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColor : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                            {PASSWORD_RULES.map(r => (
                                                <span key={r.label} className={`text-xs flex items-center gap-1 ${r.test(formData.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                    <CheckCircle size={11} /> {r.label}
                                                </span>
                                            ))}
                                        </div>
                                        {strengthLabel && <span className={`text-xs font-bold ${passwordStrength === 3 ? 'text-emerald-600' : passwordStrength === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{strengthLabel}</span>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={17} />
                                <input
                                    type={showConfirm ? 'text' : 'password'} placeholder="••••••••" required
                                    className={`w-full bg-gray-50 border-2 rounded-xl py-3.5 pl-11 pr-12 text-gray-900 transition-all outline-none text-sm ${
                                        formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-blue-500'
                                    }`}
                                    value={formData.confirmPassword} onChange={set('confirmPassword')}
                                />
                                <button type="button" onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-xs text-red-500 font-medium ml-1">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</span>
                            ) : (
                                <><UserPlus size={18} /> Request Access <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="px-8 pb-8 pt-2 text-center">
                        <p className="text-gray-500 text-sm">Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
