import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sword,
    Laugh,
    Heart,
    Ghost,
    Rocket,
    Drama,
    Search,
    Users,
    Clapperboard,
    Tv,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { tmdbService } from '../services/tmdb';

const GENRES = [
    { id: 'all', name: 'Trending', icon: Sparkles, color: 'from-purple-600 to-indigo-600' },
    { id: 28, name: 'Action', icon: Sword, color: 'from-red-600 to-orange-600' },
    { id: 35, name: 'Comedy', icon: Laugh, color: 'from-yellow-500 to-orange-600' },
    { id: 10749, name: 'Romance', icon: Heart, color: 'from-pink-600 to-rose-600' },
    { id: 27, name: 'Horror', icon: Ghost, color: 'from-gray-800 to-black' },
    { id: 878, name: 'Sci-Fi', icon: Rocket, color: 'from-blue-600 to-cyan-600' },
    { id: 18, name: 'Drama', icon: Drama, color: 'from-indigo-700 to-purple-700' },
    { id: 53, name: 'Thriller', icon: Search, color: 'from-emerald-700 to-teal-800' },
    { id: 10751, name: 'Family', icon: Users, color: 'from-green-500 to-blue-600' },
    { id: 99, name: 'Documentary', icon: Clapperboard, color: 'from-amber-700 to-stone-800' },
    { id: 'tv', name: 'TV Series', icon: Tv, color: 'from-violet-600 to-fuchsia-600' },
];

const CategorySelection = ({ onSelect }) => {
    const [previews, setPreviews] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreviews = async () => {
            const previewData = {};
            const fetchPromises = GENRES.map(async (genre) => {
                const filters = {
                    genreId: typeof genre.id === 'number' ? genre.id : '',
                    trending: genre.id === 'all',
                };
                const response = await tmdbService.getMovies(1, filters, genre.id === 'tv' ? 'tv' : 'movie');
                previewData[genre.id] = response.results.slice(0, 3);
            });

            await Promise.all(fetchPromises);
            setPreviews(previewData);
            setLoading(false);
        };

        fetchPreviews();
    }, []);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-[#0F0F1A] text-white overflow-y-auto custom-scrollbar">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 mt-8"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tinder-gradient shadow-lg shadow-rose-500/20 mb-6">
                    <Sparkles className="text-white" size={32} />
                </div>
                <h1 className="text-4xl font-black mb-3 tracking-tighter text-white uppercase italic">
                    Discovery Hub
                </h1>
                <p className="text-gray-400 font-medium max-w-md mx-auto">
                    Choose a category to start swiping. We've curated the best for you.
                </p>
            </motion.div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-rose-500" size={48} />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading Categories...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl pb-12">
                    {GENRES.map((genre, index) => (
                        <motion.button
                            key={genre.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(genre)}
                            className={`relative group h-64 rounded-3xl overflow-hidden bg-gradient-to-br ${genre.color} shadow-xl flex flex-col items-start justify-end p-8 transition-all hover:shadow-2xl hover:shadow-rose-500/10 border border-white/5`}
                        >
                            {/* Movie Previews Background */}
                            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity flex">
                                {previews[genre.id]?.map((movie, idx) => (
                                    <div
                                        key={movie.id}
                                        className="h-full w-1/3 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${movie.poster})` }}
                                    />
                                ))}
                                {/* Fallback if no previews */}
                                {(!previews[genre.id] || previews[genre.id].length === 0) && (
                                    <div className="absolute inset-0 bg-black/20" />
                                )}
                            </div>

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A] via-[#0F0F1A]/40 to-transparent z-10" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />

                            {/* Content */}
                            <div className="relative z-20 flex flex-col items-start gap-2">
                                <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md mb-2 group-hover:scale-110 transition-transform`}>
                                    <genre.icon size={28} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-white mb-1 uppercase italic">{genre.name}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {previews[genre.id]?.slice(0, 3).map((movie, idx) => (
                                            <div
                                                key={idx}
                                                className="w-6 h-6 rounded-full border-2 border-[#1A1A2E] bg-cover bg-center shadow-lg"
                                                style={{ backgroundImage: `url(${movie.poster})` }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                        {genre.id === 'tv' ? 'Popular Series' : 'Top Movies'}
                                    </span>
                                </div>
                            </div>

                            {/* Decorative Icon */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-20 transition-opacity z-20">
                                <genre.icon size={64} />
                            </div>
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySelection;
