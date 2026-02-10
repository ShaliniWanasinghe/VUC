import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (userId, password) => {
        try {
            console.log(`🌐 Attempting login for: ${userId} at ${api.defaults.baseURL}/auth/login`);
            const response = await api.post('/auth/login', { userId, password });
            console.log('✅ Server response:', response.data);
            const { token, user: loggedInUser } = response.data;
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            localStorage.setItem('token', token);
            toast.success(`Welcome back, ${loggedInUser.name}!`);
            return true;
        } catch (error) {
            console.error('❌ Login error detail:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userId, name, email, password, role) => {
        try {
            const response = await api.post('/auth/register', { userId, name, email, password, role });
            const { token, user: newUser } = response.data;
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('token', token);
            toast.success('Registration successful! Welcome to VUC.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
