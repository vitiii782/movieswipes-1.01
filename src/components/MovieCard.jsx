import React, { useState, useMemo, memo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Star, Clock, ChevronDown, Check, X, Calendar } from 'lucide-react';

const MovieCard = ({ movie, onSwipe, onInfoClick, active, index }) => {
    const [expanded, setExpanded] = useState(false);
    const x = useMotionValue(0);
    // Reduced rotation range for a snappier feel
    const rotate = useTransform(x, [-300, 300], [-18, 18]);
    const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [40, 120], [0, 1]);
    const nopeOpacity = useTransform(x, [-40, -120], [0, 1]);

    const handleDragEnd = (event, info) => {
        if (info.offset.x > 90) {
            onSwipe('right', movie);
        } else if (info.offset.x < -90) {
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
            style={{
                x,
                rotate,
                opacity: active ? opacity : 1,
                scale,
                y: yOffset,
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
            className="w-full max-w-[400px] h-[600px] cursor-grab active:cursor-grabbing touch-none"
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

                <div className="z-10 w-full bg-gradient-to-t from-black/95 to-black/50 p-4 rounded-2xl border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        {isUpcoming ? (
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                                <Calendar size={9} /> {formattedRelease}
                            </span>
                        ) : (
                            <span className="bg-gradient-to-r from-[#FF4458] to-[#FF6B81] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                                New
                            </span>
                        )}
                        <span className="text-gray-300 text-xs font-semibold">{movie.year}</span>
                    </div>

                    <h2 className="text-3xl font-black leading-tight mb-2 tracking-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {movie.title}
                    </h2>

                    <div className="flex items-center gap-4 text-xs font-bold mb-3">
                        <div className="flex items-center gap-1 text-accent-gold">
                            <Star size={16} fill="currentColor" />
                            <span>{Number(movie?.rating || 0).toFixed(1)}</span>
                        </div>
                        {movie.runtime && (
                            <div className="flex items-center gap-1 text-gray-300">
                                <Clock size={16} />
                                <span>{movie.runtime}m</span>
                            </div>
                        )}
                    </div>

                    <div className={`text-sm text-gray-200 transition-all duration-300 overflow-hidden ${expanded ? 'max-h-40' : 'max-h-12'}`}>
                        <p className="line-clamp-2 leading-relaxed opacity-90">
                            {movie.description}
                        </p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onInfoClick(movie);
                        }}
                        className="mt-3 text-[#FF4458] text-[13px] font-black flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                        LEARN MORE <ChevronDown size={14} strokeWidth={3} />
                    </button>
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
