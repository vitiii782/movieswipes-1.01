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
    const { filters, mediaType, currentUser } = useMovieStore();

    const fetchMovies = useCallback(async (currentFilters, currentType) => {
        setLoading(true);
        try {
            // Standard discovery paging
            const maxPage = 20;
            const randomPage = Math.floor(Math.random() * maxPage) + 1;

            let results = await tmdbService.getMovies(randomPage, currentFilters, currentType);

            // Fallback for empty random pages
            if (results.length === 0 && randomPage > 1) {
                results = await tmdbService.getMovies(1, currentFilters, currentType);
            }

            const currentSeen = currentUser?.seenIds?.[currentType] || [];

            // Deduplicate and filter seen
            const filteredResults = results.filter(movie => !currentSeen.includes(movie.id));
            const sorted = [...filteredResults].sort((a, b) => (b.rating || 0) - (a.rating || 0));

            // Avoid adding duplicates if they're already in the current stack
            setMovies(prev => {
                const existingIds = new Set(prev.map(m => m.id));
                const newMovies = sorted.reverse().filter(m => !existingIds.has(m.id));
                return [...newMovies, ...prev];
            });

            // Preload posters
            sorted.forEach(movie => {
                if (movie.poster) { const img = new Image(); img.src = movie.poster; }
            });
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser, filters, mediaType]);

    // Initial fetch and fetch when filters or mediaType change
    useEffect(() => {
        setMovies([]);
        fetchMovies(filters, mediaType);
    }, [filters, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle running out of movies
    const popMovie = useCallback(() => {
        let popped = null;
        setMovies(prev => {
            if (prev.length === 0) return prev;

            const newMovies = [...prev];
            popped = newMovies.pop();

            // AGGRESSIVE PRE-FETCH: If stack is low, fetch next batch
            if (newMovies.length < 5 && !loading) {
                // We use a small timeout to let the popping state settle
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
