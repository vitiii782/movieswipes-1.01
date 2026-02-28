import React, { useState, useMemo, memo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Star, Clock, ChevronDown, Check, X, Calendar } from 'lucide-react';

const MovieCard = ({ movie, onSwipe, onInfoClick, active, index }) => {
    const [expanded, setExpanded] = useState(false);
    const x = useMotionValue(0);
    // Reduced rotation range for a snappier feel
    const rotate = useTransform(x, [-300, 300], [-18, 18]);
    const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [20, 60], [0, 1]);
    const nopeOpacity = useTransform(x, [-20, -60], [0, 1]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 50) {
            onSwipe('right', movie);
        } else if (info.offset.x < -50) {
            onSwipe('left', movie);
        }
    };

    // Detect if movie is upcoming (future release)
    const isUpcoming = useMemo(() =>
        movie.releaseDate && new Date(movie.releaseDate) > new Date(),
        [movie.releaseDate]
    );
    const formattedRelease = useMemo(() =>
        movie.releaseDate
            ? new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : null,
        [movie.releaseDate]
    );

    // Calculate stack effect based on index
    const scale = active ? 1 : 1 - (index * 0.05);
    const yOffset = active ? 0 : index * -15;

    return (
        <motion.div
            layout={false}
            animate={{
                scale,
                y: yOffset
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            style={{
                x,
                rotate,
                opacity: active ? opacity : 1,
                zIndex: 50 - index,
                position: 'absolute',
                willChange: active ? 'transform' : 'auto',
            }}
            drag={active ? "x" : false}
            dragConstraints={{ left: -1000, right: 1000 }}
            dragElastic={0.7}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            whileTap={active ? { scale: 1.01 } : {}}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        >
            <div
                className="card relative w-full h-full flex flex-col justify-end p-6 overflow-hidden bg-dark-card border border-white/10 shadow-2xl rounded-[32px] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%), url(${movie.poster})`, transform: 'translateZ(0)' }}
            >
                {/* Overlays */}
                {active && (
                    <>
                        <motion.div
                            style={{ opacity: likeOpacity }}
                            className="absolute top-10 left-10 border-4 border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[-20deg] z-50 uppercase tracking-widest pointer-events-none"
                        >
                            <div className="flex items-center gap-2">
                                <Check size={40} strokeWidth={4} /> LIKE
                            </div>
                        </motion.div>
                        <motion.div
                            style={{ opacity: nopeOpacity }}
                            className="absolute top-10 right-10 border-4 border-rose-500 text-rose-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[20deg] z-50 uppercase tracking-widest pointer-events-none"
                        >
                            <div className="flex items-center gap-2">
                                NOPE <X size={40} strokeWidth={4} />
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Coming Soon banner */}
                {isUpcoming && (
                    <div className="absolute top-5 left-0 right-0 flex justify-center z-20 pointer-events-none">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black text-xs px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/30 uppercase tracking-widest animate-pulse">
                            <Calendar size={12} />
                            Coming Soon
                        </div>
                    </div>
                )}

                <div className="z-10 w-full bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 sm:p-5 rounded-b-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        {isUpcoming ? (
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase">
                                {formattedRelease}
                            </span>
                        ) : (
                            <span className="bg-gradient-to-r from-[#FF4458] to-[#FF6B81] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                                New
                            </span>
                        )}
                        <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase opacity-60">{movie.year}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black leading-none mb-1.5 tracking-tight line-clamp-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {movie.title}
                    </h2>

                    <p className="text-[12px] text-gray-400 font-medium mb-3 line-clamp-1 leading-relaxed opacity-80">
                        {movie.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-black text-gray-300 pb-1 uppercase tracking-wider">
                        <div className="flex items-center gap-1 text-accent-gold">
                            <Star size={14} fill="currentColor" />
                            <span>{Number(movie?.rating || 0).toFixed(1)}</span>
                        </div>
                        {movie.runtime && (
                            <div className="flex items-center gap-1 opacity-80">
                                <Clock size={14} />
                                <span>{movie.runtime}m</span>
                            </div>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onInfoClick(movie);
                            }}
                            className="ml-auto text-[#FF4458] hover:text-white transition-colors flex items-center gap-0.5"
                        >
                            INFO <ChevronDown size={14} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(MovieCard, (prevProps, nextProps) => {
    return (
        prevProps.movie.id === nextProps.movie.id &&
        prevProps.active === nextProps.active &&
        prevProps.index === nextProps.index
    );
});
