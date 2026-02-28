import { X, Trash2, Info, Film, UserCircle2 } from 'lucide-react'
import { useMovieStore } from '../store/useMovieStore'

const Watchlist = ({ onClose, onMovieClick, inline = false }) => {
    const { currentUser, removeFromWatchlist, setShowAuth } = useMovieStore()
    const watchlist = currentUser?.watchlist || []
    const disliked = currentUser?.disliked || []

    const containerClasses = inline
        ? "h-full flex flex-col bg-[#16213E]/50 backdrop-blur-xl border-l border-white/10 w-96 hidden lg:flex"
        : "fixed inset-0 z-[1100] bg-dark-bg/95 flex flex-col animate-pop"

    return (
        <div className={containerClasses}>
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-tinder-gradient rounded-xl shadow-lg shadow-primary-start/20">
                        <Film size={20} className="text-white" />
                    </div>
                    <h2 className="text-xl font-black">Watchlist</h2>
                    <span className="bg-white/10 px-2 pyr-0.5 rounded-full text-[10px] font-bold text-gray-400">
                        {watchlist.length}
                    </span>
                </div>
                {!inline && (
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={28} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {/* Statistics Dashboard - Only in Modal */}
                {!inline && watchlist.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-pop">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center shadow-lg backdrop-blur-md">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Liked</p>
                            <p className="text-3xl font-black text-primary-end">{watchlist.length}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center shadow-lg backdrop-blur-md">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Disliked</p>
                            <p className="text-3xl font-black text-gray-400">{disliked.length}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center shadow-lg backdrop-blur-md">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Ratio</p>
                            <p className="text-3xl font-black text-accent-gold">
                                {disliked.length + watchlist.length > 0
                                    ? `${Math.round((watchlist.length / (watchlist.length + disliked.length)) * 100)}%`
                                    : '0%'
                                }
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center shadow-lg backdrop-blur-md">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Sessions</p>
                            <p className="text-3xl font-black text-blue-400">1</p>
                        </div>
                    </div>
                )}

                {!currentUser ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-6 animate-pop">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 border border-white/10 shadow-inner">
                            <UserCircle2 size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Sign in Required</h3>
                            <p className="text-gray-500 text-sm max-w-[240px]">Sign up or log in to save your favorite movies and see them here.</p>
                        </div>
                        <button
                            onClick={() => setShowAuth(true)}
                            className="w-full py-4 bg-tinder-gradient rounded-2xl font-black text-white uppercase tracking-widest shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
                        >
                            Get Started
                        </button>
                    </div>
                ) : watchlist.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 text-center px-4">
                        <Film size={48} className="opacity-20" />
                        <p className="text-lg font-medium">Empty Watchlist</p>
                        {!inline && (
                            <button
                                onClick={onClose}
                                className="mt-4 px-6 py-2 bg-tinder-gradient rounded-full font-bold text-white shadow-lg"
                            >
                                Start Swiping
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={inline ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"}>
                        {watchlist.map((movie) => (
                            <div
                                key={movie.id}
                                className="group relative bg-dark-card rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                            >
                                <div className="aspect-[2/3] relative">
                                    <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="absolute top-1 right-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromWatchlist(movie.id);
                                            }}
                                            className="p-1.5 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all border border-red-500/20"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => onMovieClick(movie)}
                                            className="w-full py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
                                        >
                                            <Info size={12} /> Details
                                        </button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <h3 className="font-bold text-[11px] truncate">{movie.title}</h3>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[10px] text-gray-500">{movie.year}</span>
                                        <span className="text-[10px] font-bold text-accent-gold">{Number(movie?.rating || 0).toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Watchlist
