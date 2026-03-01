import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, Send, Loader2, Info } from 'lucide-react';
import { tmdbService } from '../services/tmdb';

const MovieFinder = ({ onClose, onMovieClick }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);

        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 800));

        const [movies, tv] = await Promise.all([
            tmdbService.searchMovies(query, 'movie'),
            tmdbService.searchMovies(query, 'tv')
        ]);

        const combined = [...movies, ...tv].sort((a, b) => b.rating - a.rating);
        setResults(combined);
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 bg-[#0F0F1E]/80 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-2xl bg-[#16213E] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-tinder-gradient flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">MovieFinder AI</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Powered by TMDb</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-6">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, edits or description..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-tinder-gradient flex items-center justify-center text-white shadow-lg disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 gap-4"
                            >
                                <div className="relative">
                                    <Loader2 className="animate-spin text-rose-500" size={48} />
                                    <Sparkles className="absolute -top-1 -right-1 text-yellow-400 animate-pulse" size={16} />
                                </div>
                                <p className="text-gray-400 font-bold tracking-widest text-sm uppercase animate-pulse">Analyzing results...</p>
                            </motion.div>
                        ) : results.length > 0 ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 gap-3"
                            >
                                {results.map((movie, idx) => (
                                    <motion.div
                                        key={movie.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => onMovieClick(movie)}
                                        className="group flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-white/10 transition-all cursor-pointer"
                                    >
                                        <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 shadow-lg group-hover:scale-105 transition-transform">
                                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="font-bold text-white truncate text-lg">{movie.title}</h4>
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-500 text-[10px] font-black uppercase">
                                                    ★ {movie.rating?.toFixed(1)}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2 mb-2 leading-relaxed">{movie.description}</p>
                                            <div className="flex items-center gap-3 mt-auto">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{movie.year} • {movie.mediaType}</span>
                                                <div className="hidden group-hover:flex items-center gap-1 text-rose-500 text-[11px] font-bold uppercase ml-auto">
                                                    Details <Info size={12} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : hasSearched ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                    <Search className="text-gray-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Matches Found</h3>
                                <p className="text-gray-500 text-sm">Our AI couldn't find exactly that. Try a different query!</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <Sparkles className="text-rose-500/30 mx-auto mb-4" size={48} />
                                <h3 className="text-white font-bold text-lg mb-2 italic">How can I help you find tonight's watch?</h3>
                                <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                                    {['Action movies set in space', 'The Dark Knight', 'Funny sitcoms', 'Horror 2024'].map(suggestion => (
                                        <button
                                            key={suggestion}
                                            onClick={() => { setQuery(suggestion); }}
                                            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-400 hover:text-white hover:border-rose-500/50 transition-all font-bold uppercase tracking-wider"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MovieFinder;
