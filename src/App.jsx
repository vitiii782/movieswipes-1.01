import React, { useState, useMemo, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import MovieCard from './components/MovieCard'
import SwipeButtons from './components/SwipeButtons'
import Watchlist from './components/Watchlist'
import FilterMenu from './components/FilterMenu'
import MovieDetails from './components/MovieDetails'
import DailyRecommendation from './components/DailyRecommendation'
import CategorySelection from './components/CategorySelection'
import Auth from './components/Auth'
import AccountDetails from './components/AccountDetails'
import LogoutConfirm from './components/LogoutConfirm'
import MovieFinder from './components/MovieFinder'
import { useMovies } from './hooks/useMovies'
import { useMovieStore } from './store/useMovieStore'
import { tmdbService } from './services/tmdb'
import confetti from 'canvas-confetti'
import { Loader2 } from 'lucide-react'

function App() {
    const { movies, loading, popMovie, pushMovie } = useMovies()
    const {
        currentUser,
        showCategories,
        setShowCategories,
        showAuth,
        setShowAuth,
        showAccountDetails,
        setShowAccountDetails,
        showLogoutConfirm,
        setShowLogoutConfirm,
        showMovieFinder,
        setShowMovieFinder,
        updateFilters,
        setMediaType
    } = useMovieStore()

    const watchlist = currentUser?.watchlist || []

    const [showWatchlist, setShowWatchlist] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [showDaily, setShowDaily] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [lastAction, setLastAction] = useState(null)

    // Success milestone
    useEffect(() => {
        if (watchlist?.length > 0 && watchlist.length % 10 === 0) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF4458', '#FF6B81', '#FFD700']
            })
        }
    }, [watchlist?.length])

    // No conditional returns before hooks

    const handleInfoClick = async (movie) => {
        if (!movie) return;
        // Show basic data immediately so the modal opens with the correct movie right away
        setSelectedMovie(movie);
        // Fetch full details in the background
        const details = await tmdbService.getMovieDetails(movie.id, movie.mediaType || 'movie');
        // Only apply if the user hasn't clicked a different movie in the meantime
        setSelectedMovie(prev => {
            if (prev && prev.id === movie.id) return details || movie;
            return prev; // ignore stale result
        });
    }

    const swiped = (direction, movie) => {
        setLastAction({ direction, movie })
        const { addToWatchlist, addToDisliked, addToSeen, mediaType } = useMovieStore.getState()
        addToSeen(movie.id, mediaType)

        if (direction === 'right') {
            addToWatchlist(movie)
        } else if (direction === 'left') {
            addToDisliked(movie.id)
        }

        popMovie()
    }

    const handleUndo = () => {
        if (!lastAction) return
        const { direction, movie } = lastAction
        if (direction === 'right') {
            useMovieStore.getState().removeFromWatchlist(movie.id)
        }
        pushMovie(movie)
        setLastAction(null)
    }

    const handleGenreSelect = (genre) => {
        setMediaType(genre.id === 'tv' ? 'tv' : 'movie');

        // Per-genre release date rules:
        // Horror → 2015+, Romance & Family → no filter (mix of old & new), all others → 2000+
        const ROMANCE_ID = 10749;
        const FAMILY_ID = 10751;
        const HORROR_ID = 27;
        let releaseDateGte = '2000-01-01'; // default
        let certificationCountry = '';
        let certification = '';

        let minRating = null;
        let keywords = '';
        let withoutGenres = '';
        let minVoteCount = 100;

        if (genre.id === HORROR_ID) {
            releaseDateGte = '2010-01-01';
            // Exclude kids' genres: Family (10751) and Animation (16)
            withoutGenres = '10751,16';
            keywords = '';
            minRating = 5.0;
            minVoteCount = 150;
        }
        if (genre.id === ROMANCE_ID || genre.id === FAMILY_ID) releaseDateGte = '';
        if (genre.id === 'all' || genre.id === 'tv') releaseDateGte = '';

        updateFilters({
            genreId: typeof genre.id === 'number' ? genre.id : '',
            trending: genre.id === 'all',
            upcoming: false,
            business: false,
            releaseDateGte,
            certificationCountry,
            certification,
            minRating,
            keywords,
            withoutGenres,
            minVoteCount,
        });
        setShowCategories(false);
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showWatchlist || showFilters || selectedMovie || showDaily || showCategories || showMovieFinder) return;
            if (!movies || movies.length === 0) return;

            const topMovie = movies[movies.length - 1];
            if (e.key === 'ArrowLeft') swiped('left', topMovie);
            else if (e.key === 'ArrowRight') swiped('right', topMovie);
            else if (e.key === ' ') { e.preventDefault(); handleInfoClick(topMovie); }
            else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movies, showWatchlist, showFilters, selectedMovie, showDaily, showCategories, showMovieFinder, lastAction]);

    return (
        <div className="flex flex-col h-[100dvh] bg-[#1A1A2E] text-white overflow-hidden font-sans select-none">
            {showCategories ? (
                <CategorySelection onSelect={handleGenreSelect} />
            ) : (
                <>
                    <Header
                        showWatchlist={showWatchlist}
                        onToggleWatchlist={() => setShowWatchlist(!showWatchlist)}
                        onFilterClick={() => setShowFilters(true)}
                        onDailyClick={() => setShowDaily(true)}
                    />

                    <div className="flex-1 flex overflow-hidden">
                        <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden pt-16 sm:pt-24 pb-safe transition-all duration-500">
                            {loading && (!movies || movies.length === 0) ? (
                                <div className="flex flex-col items-center gap-4 animate-pulse my-auto">
                                    <Loader2 className="animate-spin text-[#FF4458]" size={48} />
                                    <p className="text-gray-400 font-bold tracking-widest text-sm uppercase">Curating your list...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-full max-w-[260px] sm:max-w-[300px] flex-1 min-h-[300px] max-h-[400px] flex items-center justify-center transition-transform">
                                        <AnimatePresence mode="popLayout">
                                            {movies?.slice(-3).map((movie, index, array) => (
                                                <MovieCard
                                                    key={movie.id}
                                                    movie={movie}
                                                    index={array.length - 1 - index}
                                                    active={index === array.length - 1}
                                                    onSwipe={(dir) => swiped(dir, movie)}
                                                    onInfoClick={handleInfoClick}
                                                />
                                            ))}
                                        </AnimatePresence>

                                        {(!movies || movies.length === 0) && !loading && (
                                            <div className="text-center p-8 bg-[#16213E] rounded-3xl border border-white/10 shadow-2xl animate-pop">
                                                <h3 className="text-2xl font-bold mb-2">No More Movies!</h3>
                                                <p className="text-gray-500 mb-6 text-sm">Try adjusting your filters or category.</p>
                                                <button
                                                    onClick={() => setShowCategories(true)}
                                                    className="px-8 py-3 bg-gradient-to-r from-[#FF4458] to-[#FF6B81] rounded-xl font-bold"
                                                >
                                                    Back to Categories
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <SwipeButtons
                                        onNope={() => movies?.length > 0 && swiped('left', movies[movies.length - 1])}
                                        onLike={() => movies?.length > 0 && swiped('right', movies[movies.length - 1])}
                                        onInfo={() => movies?.length > 0 && handleInfoClick(movies[movies.length - 1])}
                                        onUndo={handleUndo}
                                    />
                                </>
                            )}
                        </main>

                        <Watchlist inline onMovieClick={handleInfoClick} />
                    </div>
                </>
            )}

            {showWatchlist && <Watchlist onClose={() => setShowWatchlist(false)} onMovieClick={handleInfoClick} />}
            {showAuth && <Auth onClose={() => setShowAuth(false)} />}
            {showAccountDetails && <AccountDetails onClose={() => setShowAccountDetails(false)} />}
            {showLogoutConfirm && <LogoutConfirm />}
            {showFilters && <FilterMenu onClose={() => setShowFilters(false)} />}
            {showDaily && <DailyRecommendation onClose={() => setShowDaily(false)} onWatch={(movie) => { handleInfoClick(movie); setShowDaily(false); }} />}
            {showMovieFinder && <MovieFinder onClose={() => setShowMovieFinder(false)} onMovieClick={(movie) => { handleInfoClick(movie); setShowMovieFinder(false); }} />}
            {selectedMovie && <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}

            <div className="hidden md:block fixed -top-24 -left-24 w-96 h-96 bg-[#FF4458]/10 blur-[120px] pointer-events-none rounded-full" />
            <div className="hidden md:block fixed -bottom-24 -right-24 w-96 h-96 bg-[#FF6B81]/10 blur-[120px] pointer-events-none rounded-full" />
        </div>
    )
}

export default App
