import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
    Package, TrendingUp, Shield, BarChart3, Users, Truck,
    ArrowRight, CheckCircle, Zap, Globe, Lock, ChevronRight,
    Star, ShoppingCart, ClipboardList, Eye, Layers, Activity, Search, Play, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const stats = [
    { value: '99.9%', label: 'System Uptime', suffix: '' },
    { value: '10K', label: 'Items Tracked', suffix: '+' },
    { value: '50', label: 'Reports Generated', suffix: '+' },
    { value: '24/7', label: 'Monitoring', suffix: '' },
];

const features = [
    {
        icon: Package,
        title: 'Smart Inventory',
        desc: 'Real-time stock tracking with automatic reorder alerts. Never run out of critical supplies again.',
        color: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-500/10',
    },
    {
        icon: TrendingUp,
        title: 'Sales Analytics',
        desc: 'Powerful dashboards with revenue tracking, customer insights, and profit margin analysis.',
        color: 'from-emerald-500 to-teal-400',
        bg: 'bg-emerald-500/10',
    },
    {
        icon: ShoppingCart,
        title: 'Purchase Management',
        desc: 'Streamlined procurement workflow with supplier tracking, order history, and cost optimization.',
        color: 'from-purple-500 to-pink-400',
        bg: 'bg-purple-500/10',
    },
    {
        icon: Users,
        title: 'Role-Based Access',
        desc: 'Granular permissions with 6 role levels — from Staff to Super Admin. Enterprise-grade security.',
        color: 'from-orange-500 to-amber-400',
        bg: 'bg-orange-500/10',
    },
    {
        icon: BarChart3,
        title: 'Executive Dashboard',
        desc: 'Bird\'s-eye view of your entire operation. Revenue, costs, inventory health — all at a glance.',
        color: 'from-rose-500 to-red-400',
        bg: 'bg-rose-500/10',
    },
    {
        icon: Shield,
        title: 'Audit Trail',
        desc: 'Complete activity logging for compliance. Track every action, every user, every change.',
        color: 'from-indigo-500 to-blue-400',
        bg: 'bg-indigo-500/10',
    },
];

const workflow = [
    { step: '01', title: 'Register Products', desc: 'Add your inventory items with SKU, pricing, and category details.', icon: ClipboardList },
    { step: '02', title: 'Track Movement', desc: 'Monitor purchases, sales, and stock levels in real-time.', icon: Activity },
    { step: '03', title: 'Analyze & Grow', desc: 'Use analytics to optimize stock, reduce costs, and maximize revenue.', icon: Eye },
];

const AnimatedCounter = ({ target, suffix = '' }: { target: string; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const numericPart = parseInt(target.replace(/[^0-9]/g, '')) || 0;
    const hasNonNumeric = target.replace(/[0-9]/g, '');

    useEffect(() => {
        if (numericPart === 0) return;
        let current = 0;
        const increment = Math.max(1, Math.floor(numericPart / 60));
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericPart) {
                current = numericPart;
                clearInterval(timer);
            }
            setCount(current);
        }, 25);
        return () => clearInterval(timer);
    }, [numericPart]);

    if (numericPart === 0) return <>{target}{suffix}</>;
    return <>{count.toLocaleString()}{hasNonNumeric}{suffix}</>;
};

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden pb-24">

            {/* ─── NAVBAR ─── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="VIZION BOT" className="h-24 md:h-28 object-contain mix-blend-screen brightness-200 contrast-125 drop-shadow-[0_0_20px_rgba(56,189,248,0.7)]" />
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#stats" className="hover:text-white transition-colors">Performance</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ─── HERO ─── */}
            <section className="relative pt-40 pb-28 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 animate-fade-in">
                        <Zap size={14} className="text-blue-400" />
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Enterprise-Grade Inventory Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8 animate-fade-in">
                        <span className="text-white">Take Control of</span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Your Inventory
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
                        VIZION BOT delivers real-time inventory intelligence, automated stock management,
                        and powerful analytics — all in one unified platform built for modern enterprises.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
                        <Link
                            to="/register"
                            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-2xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 active:scale-95 text-lg"
                        >
                            Start Free Trial
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all active:scale-95 text-lg"
                        >
                            <Globe size={20} />
                            Live Demo
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-16 flex items-center justify-center gap-8 text-gray-600 text-xs font-medium">
                        <span className="flex items-center gap-2"><Lock size={14} /> SSL Encrypted</span>
                        <span className="flex items-center gap-2"><Shield size={14} /> SOC2 Ready</span>
                        <span className="flex items-center gap-2"><Zap size={14} /> 99.9% Uptime</span>
                    </div>
                </div>
            </section>

            {/* ─── STATS BAR ─── */}
            <section id="stats" className="relative py-16 border-t border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </p>
                                <p className="text-sm text-gray-500 font-medium mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                            <Layers size={14} className="text-blue-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Core Capabilities</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Everything You Need to <br />
                            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Run Your Operations</span>
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto text-lg">
                            A complete suite of tools to manage inventory, track sales, and grow your business with confidence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1">
                                    {/* Glow effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] rounded-3xl transition-opacity duration-500`} />

                                    <div className={`relative w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                        <Icon size={26} className={`bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                                    </div>
                                    <h3 className="relative text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="relative text-gray-500 text-sm leading-relaxed">{feature.desc}</p>

                                    <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-gray-600 group-hover:text-blue-400 transition-colors">
                                        Learn more <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how-it-works" className="py-28 relative">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                            <Activity size={14} className="text-emerald-400" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Simple Workflow</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Get Running in <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">3 Steps</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {workflow.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="relative">
                                    {/* Connector line */}
                                    {i < workflow.length - 1 && (
                                        <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                                    )}

                                    <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 rounded-3xl p-8 text-center hover:border-white/10 transition-all">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-2xl mb-6">
                                            <Icon size={28} className="text-emerald-400" />
                                        </div>
                                        <div className="text-6xl font-black text-white/[0.04] absolute top-6 right-8">{item.step}</div>
                                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── ENTERPRISE CTA ─── */}
            <section className="py-28">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl">
                        {/* Decorative circles */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl" />

                        <div className="relative">
                            <div className="flex items-center justify-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={20} className="text-yellow-300 fill-yellow-300" />
                                ))}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                                Ready to Transform Your<br />Inventory Operations?
                            </h2>
                            <p className="text-blue-100/80 text-lg max-w-xl mx-auto mb-10">
                                Join businesses worldwide that trust VIZION BOT to power their inventory management.
                                Start your free account today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="group flex items-center gap-3 px-10 py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 text-lg"
                                >
                                    Create Free Account
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all active:scale-95 text-lg"
                                >
                                    Sign In →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;

