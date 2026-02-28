import React from 'react'
import { X, Star, ExternalLink } from 'lucide-react'

const MovieDetails = ({ movie, onClose }) => {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-dark-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-pop">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-20"
                >
                    <X size={24} />
                </button>

                <div className="relative h-[250px] md:h-[350px]">
                    <img src={movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '')} alt={movie.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                </div>

                <div className="p-6 md:p-8 -mt-20 relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {movie.genres?.map(genre => (
                            <span key={genre} className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-gray-300">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black mb-2">{movie?.title || 'Unknown'}</h2>

                    <div className="flex items-center gap-6 mb-8 text-sm font-medium">
                        <div className="flex items-center gap-1.5 text-accent-gold">
                            <Star size={18} fill="currentColor" />
                            <span className="text-lg font-bold">{Number(movie?.rating || 0).toFixed(1)}</span>
                            <span className="text-gray-500">/ 10</span>
                        </div>
                        <div className="text-gray-400">
                            {movie?.release_date || movie?.year || 'N/A'} • {movie?.runtime || 'N/A'} min
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-tinder-gradient rounded-full" />
                            Overview
                        </h3>
                        <p className="text-gray-300 leading-relaxed text-lg font-medium selection:bg-primary-start/30">
                            {movie.overview || movie.description}
                        </p>
                    </div>

                    {movie?.watchProviders && Array.isArray(movie.watchProviders) && movie.watchProviders.length > 0 && (
                        <div className="mb-10 animate-fade-in">
                            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-tinder-gradient rounded-full" />
                                Available On
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {movie.watchProviders.map((provider, idx) => (
                                    <div
                                        key={provider?.name || idx}
                                        className="flex flex-col items-center gap-2 group/provider"
                                        title={provider?.name || 'Provider'}
                                    >
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover/provider:scale-110 group-hover/provider:border-white/30 transition-all duration-300">
                                            {provider?.logo ? (
                                                <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-center p-1 font-bold">
                                                    {provider?.name || 'Unknown'}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-0 group-hover/provider:opacity-100 transition-opacity">
                                            {provider?.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <button
                            onClick={() => window.open(`https://www.themoviedb.org/${movie.mediaType || 'movie'}/${movie.id}`, '_blank')}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/20 active:scale-95"
                        >
                            TMDB <ExternalLink size={18} />
                        </button>
                        <button
                            onClick={() => window.open(`https://www.youtube.com/results?search_query=${movie.title}+trailer`, '_blank')}
                            className="flex-1 py-4 bg-tinder-gradient hover:opacity-90 rounded-2xl font-bold shadow-xl shadow-primary-start/20 transition-all text-white active:scale-95"
                        >
                            Watch Trailer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetails
