import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // specific redirect logic could go here if needed, defaults to dashboard
    const from = location.state?.from?.pathname || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            if (user.role !== 'ADMIN') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            login(token, user);
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-indigo-100 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex w-16 h-16 bg-white rounded-2xl items-center justify-center text-primary-600 shadow-xl shadow-primary-100 mb-4 border border-white">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 mt-2 font-medium">Please enter your details to sign in</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@mentorlog.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none shadow-sm placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none shadow-sm placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" />
                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Forgot password?</a>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in to Dashboard'}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                    Don't have an account? <a href="#" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">Contact Support</a>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
