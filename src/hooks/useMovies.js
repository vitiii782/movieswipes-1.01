import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../services/tmdb';
import { useMovieStore } from '../store/useMovieStore';

const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
    });
};

export const useMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [knownTotalPages, setKnownTotalPages] = useState(1);
    const { filters, mediaType, currentUser } = useMovieStore();

    const fetchMovies = useCallback(async (currentFilters, currentType, startPage) => {
        setLoading(true);
        try {
            // Always start at page 1 for initial load, then randomize within known bounds
            const page = startPage != null ? startPage :
                (knownTotalPages > 1 ? Math.floor(Math.random() * Math.min(knownTotalPages, 20)) + 1 : 1);

            const response = await tmdbService.getMovies(page, currentFilters, currentType);
            let results = response.results || [];
            const newTotalPages = response.totalPages || 1;

            setKnownTotalPages(newTotalPages);

            // Safety: if random page came back empty but page1 might have results, fallback
            if (results.length === 0 && page > 1) {
                const fallback = await tmdbService.getMovies(1, currentFilters, currentType);
                results = fallback.results || [];
            }

            const currentSeen = currentUser?.seenIds?.[currentType] || [];

            const filteredResults = results.filter(movie => !currentSeen.includes(movie.id));
            // Sort highest rating first (the card at the top of the stack is the last item)
            const sorted = [...filteredResults].sort((a, b) => (b.rating || 0) - (a.rating || 0));

            setMovies(prev => {
                const existingIds = new Set(prev.map(m => m.id));
                const uniqueNew = sorted.filter(m => !existingIds.has(m.id)).reverse();
                return [...uniqueNew, ...prev];
            });

            sorted.forEach(movie => {
                if (movie.poster) { const img = new Image(); img.src = movie.poster; }
            });
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser, knownTotalPages]);

    // When filters/mediaType change, reset and start fresh from page 1
    useEffect(() => {
        setMovies([]);
        setKnownTotalPages(1);
        fetchMovies(filters, mediaType, 1);
    }, [filters, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

    const popMovie = useCallback(() => {
        let popped = null;
        setMovies(prev => {
            if (prev.length === 0) return prev;
            const newMovies = [...prev];
            popped = newMovies.pop();
            if (newMovies.length < 5 && !loading) {
                setTimeout(() => fetchMovies(filters, mediaType), 10);
            }
            return newMovies;
        });
        return popped;
    }, [fetchMovies, filters, mediaType, loading]);

    const pushMovie = useCallback((movie) => {
        setMovies(prev => [...prev, movie]);
    }, []);

    return { movies, loading, popMovie, pushMovie };
};
