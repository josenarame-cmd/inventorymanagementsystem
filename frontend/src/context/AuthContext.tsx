import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: any;
    token: string | null;
    login: (data: any) => Promise<any>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        const storedToken = localStorage.getItem('token');
        if (storedToken && storedUser) {
            setUser(storedUser);
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);

    const login = async (data: any) => {
        const response = await authService.login(data);
        setUser(response);
        setToken(response.token);
        return response;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
