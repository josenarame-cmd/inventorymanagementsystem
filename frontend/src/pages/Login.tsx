import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Loader2, Package } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login({ username, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid username or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 blur-[60px] bg-cyan-400/40 rounded-full scale-[2.5]" />
                        <img src="/logo.png" alt="VIZION BOT Logo" className="relative h-48 mx-auto object-contain mix-blend-screen brightness-200 contrast-125 drop-shadow-[0_0_40px_rgba(56,189,248,0.8)]" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-[0.2em] uppercase">Welcome Back</h1>
                    <p className="text-blue-400 font-bold mt-2 uppercase tracking-widest text-sm">Inventory Management System</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white placeholder-gray-500 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                        </button>
                    </form>
                </div>
                
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 font-bold hover:underline">
                        Register now
                    </Link>
                </div>
                
                <p className="text-center text-gray-500 mt-8 text-sm">
                    &copy; 2026 Inventory Management System. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
