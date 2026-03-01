import { useState, useEffect, useCallback, useRef } from 'react';
import { tmdbService } from '../services/tmdb';
import { useMovieStore } from '../store/useMovieStore';

export const useMovies = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { filters, mediaType, currentUser } = useMovieStore();

    // Refs for tracking state without causing re-renders
    const nextPageRef = useRef(1);
    const totalPagesRef = useRef(null);
    const isFetchingRef = useRef(false);
    // Tracks ALL IDs shown this session to prevent duplicates
    const sessionSeenRef = useRef(new Set());

    const fetchMore = useCallback(async (currentFilters, currentType) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            // Wrap around if we've finished all pages
            if (totalPagesRef.current !== null && nextPageRef.current > totalPagesRef.current) {
                nextPageRef.current = 1;
            }

            const page = nextPageRef.current;
            const response = await tmdbService.getMovies(page, currentFilters, currentType);
            const results = response.results || [];
            const totalPages = response.totalPages || 1;

            totalPagesRef.current = totalPages;
            nextPageRef.current = page + 1;

            const persistedSeen = currentUser?.seenIds?.[currentType] || [];

            // Filter: skip anything already shown this session or previously swiped
            const newMovies = results.filter(movie => {
                if (sessionSeenRef.current.has(movie.id)) return false;
                if (persistedSeen.includes(movie.id)) return false;
                sessionSeenRef.current.add(movie.id);
                return true;
            });

            // Sort highest-rated first. Stack renders top-last so reverse for correct display order.
            const sorted = [...newMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setMovies(prev => [...sorted.reverse(), ...prev]);

            // Preload poster images in background (no await, pure perf boost)
            sorted.forEach(movie => {
                if (movie.poster) { const img = new Image(); img.src = movie.poster; }
            });

            // If this page yielded nothing new, skip to next page immediately
            if (newMovies.length === 0 && totalPages > 1) {
                isFetchingRef.current = false;
                await fetchMore(currentFilters, currentType);
                return;
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            isFetchingRef.current = false;
        }
    }, [currentUser]);

    // When entering a category, pick a random starting page for variety,
    // then immediately pre-fill the stack with 2 pages for lag-free swiping.
    useEffect(() => {
        let cancelled = false;

        const initialize = async () => {
            setMovies([]);
            nextPageRef.current = 1;
            totalPagesRef.current = null;
            sessionSeenRef.current = new Set();
            isFetchingRef.current = false;
            setLoading(true);

            // First: fetch page 1 to learn totalPages
            const first = await tmdbService.getMovies(1, filters, mediaType);
            if (cancelled) return;

            const totalPages = first.totalPages || 1;
            totalPagesRef.current = totalPages;

            // Pick a random starting page so sequence is different each time
            const startPage = totalPages > 1
                ? Math.floor(Math.random() * Math.min(totalPages, 20)) + 1
                : 1;

            // Mark page 1 results + random start page in session
            const persistedSeen = currentUser?.seenIds?.[mediaType] || [];
            const firstResults = (first.results || []).filter(m => {
                if (persistedSeen.includes(m.id)) return false;
                sessionSeenRef.current.add(m.id);
                return true;
            });

            const sorted1 = [...firstResults].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setMovies(sorted1.reverse());
            sorted1.forEach(m => { if (m.poster) { const img = new Image(); img.src = m.poster; } });

            // Fetch the random starting page as second batch (for variety)
            if (startPage !== 1 && !cancelled) {
                const second = await tmdbService.getMovies(startPage, filters, mediaType);
                if (cancelled) return;
                const secondResults = (second.results || []).filter(m => {
                    if (sessionSeenRef.current.has(m.id)) return false;
                    if (persistedSeen.includes(m.id)) return false;
                    sessionSeenRef.current.add(m.id);
                    return true;
                });
                const sorted2 = [...secondResults].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                setMovies(prev => [...sorted2.reverse(), ...prev]);
                sorted2.forEach(m => { if (m.poster) { const img = new Image(); img.src = m.poster; } });
            }

            // Set next page to continue sequentially after the random page
            nextPageRef.current = startPage === 1 ? 2 : startPage + 1;
            setLoading(false);
        };

        initialize();
        return () => { cancelled = true; };
    }, [filters, mediaType]); // eslint-disable-line react-hooks/exhaustive-deps

    const popMovie = useCallback(() => {
        let popped = null;
        setMovies(prev => {
            if (prev.length === 0) return prev;
            const next = [...prev];
            popped = next.pop();
            // Pre-fetch when stack is getting low — threshold of 15 for buffer
            if (next.length < 15 && !isFetchingRef.current) {
                setTimeout(() => fetchMore(filters, mediaType), 0);
            }
            return next;
        });
        return popped;
    }, [fetchMore, filters, mediaType]);

    const pushMovie = useCallback((movie) => {
        setMovies(prev => [...prev, movie]);
        sessionSeenRef.current.delete(movie.id);
    }, []);

    return { movies, loading, popMovie, pushMovie };
};
