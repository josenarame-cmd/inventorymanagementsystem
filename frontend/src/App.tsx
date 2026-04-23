import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';
import Profile from './pages/Profile';
import IntelligenceCenter from './pages/IntelligenceCenter';

import { CurrencyProvider } from './context/CurrencyContext';

function App() {
    return (
        <CurrencyProvider>
            <AuthProvider>
                <BrowserRouter>
                <Routes>
                    {/* Landing Page as absolute root */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Dashboard Routes */}
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/purchases" element={<Purchases />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/audit-logs" element={<AuditLogs />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/intelligence-center" element={<IntelligenceCenter />} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </CurrencyProvider>
    );
}

export default App;
