import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovieStore } from '../store/useMovieStore';
import { Mail, Lock, User, ArrowRight, Sparkles, Ghost, X } from 'lucide-react';

const Auth = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, signUp, setShowAuth } = useMovieStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const success = login({ username: formData.username, password: formData.password });
            if (success) {
                setShowAuth(false);
                if (onClose) onClose();
            } else {
                setError('Invalid username, email, or password.');
            }
        } else {
            if (!formData.username || !formData.email || !formData.password) {
                setError('Please fill in all fields');
                return;
            }
            const success = signUp(formData);
            if (success) {
                setShowAuth(false);
                if (onClose) onClose();
            } else {
                setError('Username or email already exists.');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-[#0F0F1A] p-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tinder-gradient opacity-20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 opacity-20 blur-[120px] rounded-full animate-pulse" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tinder-gradient shadow-lg shadow-rose-500/20 mb-4"
                    >
                        <Sparkles className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        MovieSwipes
                    </h1>
                    <p className="text-gray-400 font-medium">
                        {isLogin ? 'Welcome back! Ready to swipe?' : 'Join the club of movie lovers.'}
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setShowAuth(false);
                            if (onClose) onClose();
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Username</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            autoComplete={isLogin ? "username" : "new-username"}
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                            placeholder="johndoe"
                                        />
                                    </div>
                                </div>

                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                                placeholder="hello@example.com"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="password"
                                            autoComplete={isLogin ? "current-password" : "new-password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-rose-500 text-sm font-bold text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-tinder-gradient text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 group mt-4"
                        >
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-400 font-medium text-sm">
                            {isLogin ? "Don't have an account?" : "Already a member?"}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                                className="ml-2 text-rose-500 font-bold hover:underline"
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Trust Badge or similar */}
                <div className="mt-8 flex items-center justify-center gap-6 text-gray-500 grayscale opacity-50">
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                        <Ghost size={14} /> Only +16 Horror
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-tighter">
                        <Sparkles size={14} /> Premium Picks
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
