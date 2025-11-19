import { jsx as _jsx } from "react/jsx-runtime";
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { user } = await authAPI.getMe();
                setUser(user);
            }
            catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    };
    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
    };
    const register = async (name, email, password) => {
        const response = await authAPI.register({ name, email, password });
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
