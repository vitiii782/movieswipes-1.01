import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovieStore } from '../store/useMovieStore';
import { User, Mail, Film, ThumbsDown, Activity, X, LogOut } from 'lucide-react';

const AccountDetails = ({ onClose }) => {
    const { currentUser, setShowAccountDetails, setShowLogoutConfirm } = useMovieStore();

    if (!currentUser) return null;

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const watchlistCount = currentUser.watchlist?.length || 0;
    const dislikedCount = currentUser.disliked?.length || 0;
    const seenMoviesCount = currentUser.seenIds?.['movie']?.length || 0;
    const seenTvCount = currentUser.seenIds?.['tv']?.length || 0;
    const totalSeen = seenMoviesCount + seenTvCount;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-[#0F0F1A]/90 backdrop-blur-sm p-6 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md"
            >
                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-tinder-gradient opacity-20 blur-[100px] rounded-full pointer-events-none" />

                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-[#16213E]/80 backdrop-blur-xl">
                    <button
                        onClick={() => {
                            setShowAccountDetails(false);
                            if (onClose) onClose();
                        }}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors z-10 bg-black/20 rounded-full"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 mb-4 shadow-xl">
                            <div className="w-full h-full rounded-full bg-[#1A1A2E] flex items-center justify-center text-white">
                                <User size={40} className="opacity-80" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white px-2 text-center break-words max-w-full">
                            {currentUser.username}
                        </h2>
                        {currentUser.email && (
                            <div className="flex items-center gap-2 text-gray-400 mt-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                                <Mail size={14} />
                                <span className="text-sm font-medium">{currentUser.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-500 mb-2">
                                <Film size={20} />
                            </div>
                            <span className="text-2xl font-black text-white">{watchlistCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Watchlist</span>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                            <div className="p-2 rounded-xl bg-gray-500/20 text-gray-400 mb-2">
                                <ThumbsDown size={20} />
                            </div>
                            <span className="text-2xl font-black text-white">{dislikedCount}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Disliked</span>
                        </div>

                        <div className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                                    <Activity size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black text-white">{totalSeen}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Swipes</span>
                                </div>
                            </div>

                            <div className="text-right text-xs text-gray-500">
                                <div>Movies: <span className="text-white font-bold">{seenMoviesCount}</span></div>
                                <div>Series: <span className="text-white font-bold">{seenTvCount}</span></div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-6 py-4 bg-white/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:border-rose-500/50 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AccountDetails;
