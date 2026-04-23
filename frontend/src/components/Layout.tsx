import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { token, isLoading } = useAuth();

    if (isLoading) return <div className="flex h-screen items-center justify-center text-blue-400">Loading...</div>;

    if (!token) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen flex bg-transparent">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
                <Header />
                <main className="p-8 pb-24 flex-grow relative z-10 animate-fade-in">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
