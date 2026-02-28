import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useMovieStore } from '../store/useMovieStore';

const LogoutConfirm = () => {
    const { setShowLogoutConfirm, logout, showAccountDetails, setShowAccountDetails } = useMovieStore();

    const handleConfirm = () => {
        logout();
        setShowLogoutConfirm(false);
        if (showAccountDetails) {
            setShowAccountDetails(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-[#0F0F1A]/90 backdrop-blur-sm p-6 overflow-hidden animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm"
            >
                <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-[#16213E]/80 backdrop-blur-xl flex flex-col items-center text-center">
                    <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10 bg-black/20 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mb-4 mt-2">
                        <LogOut size={32} />
                    </div>

                    <h2 className="text-xl font-black text-white mb-2">Sign Out?</h2>
                    <p className="text-gray-400 text-sm mb-6">Are you sure you want to sign out of your account?</p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LogoutConfirm;
