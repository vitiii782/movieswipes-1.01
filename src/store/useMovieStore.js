import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMovieStore = create(
  persist(
    (set, get) => ({
      currentUser: null, // { id, username, email, watchlist, seenIds, disliked }
      users: [], // Array of { id, username, email, password, watchlist, seenIds, disliked }
      filters: {
        genreId: '',
        minRating: 7,
        year: '',
        language: 'en-US',
        trending: false,
      },
      showCategories: true,
      showAuth: false,
      showAccountDetails: false,
      showLogoutConfirm: false,
      showMovieFinder: false,
      mediaType: 'movie',

      setShowCategories: (show) => set({ showCategories: show }),
      setShowAuth: (show) => set({ showAuth: show }),
      setShowAccountDetails: (show) => set({ showAccountDetails: show }),
      setShowLogoutConfirm: (show) => set({ showLogoutConfirm: show }),
      setShowMovieFinder: (show) => set({ showMovieFinder: show }),
      setMediaType: (type) => set({ mediaType: type }),

      signUp: (userData) => {
        const state = get();
        if (state.users.some(u => u.username === userData.username || u.email === userData.email)) {
          return false;
        }
        const newUser = {
          ...userData,
          id: Date.now().toString(),
          watchlist: [],
          seenIds: { movie: [], tv: [] },
          disliked: []
        };
        set({
          users: [...state.users, newUser],
          currentUser: newUser
        });
        return true;
      },

      login: (credentials) => {
        const state = get();
        const user = state.users.find(u =>
          (u.username === credentials.username || u.email === credentials.username) &&
          u.password === credentials.password
        );
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      addToSeen: (id, type) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUsers = state.users.map(u => {
          if (u.id === state.currentUser.id) {
            const currentSeen = u.seenIds[type] || [];
            if (currentSeen.includes(id)) return u;
            return {
              ...u,
              seenIds: {
                ...u.seenIds,
                [type]: [...currentSeen, id]
              }
            };
          }
          return u;
        });
        const updatedUser = updatedUsers.find(u => u.id === state.currentUser.id);
        return { users: updatedUsers, currentUser: updatedUser };
      }),

      addToWatchlist: (movie) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUsers = state.users.map(u => {
          if (u.id === state.currentUser.id) {
            if (u.watchlist.some(m => m.id === movie.id)) return u;
            return { ...u, watchlist: [movie, ...u.watchlist] };
          }
          return u;
        });
        const updatedUser = updatedUsers.find(u => u.id === state.currentUser.id);
        return { users: updatedUsers, currentUser: updatedUser };
      }),

      removeFromWatchlist: (id) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUsers = state.users.map(u => {
          if (u.id === state.currentUser.id) {
            return { ...u, watchlist: u.watchlist.filter(m => m.id !== id) };
          }
          return u;
        });
        const updatedUser = updatedUsers.find(u => u.id === state.currentUser.id);
        return { users: updatedUsers, currentUser: updatedUser };
      }),

      addToDisliked: (id) => set((state) => {
        if (!state.currentUser) return state;
        const updatedUsers = state.users.map(u => {
          if (u.id === state.currentUser.id) {
            if (u.disliked.includes(id)) return u;
            return { ...u, disliked: [...u.disliked, id] };
          }
          return u;
        });
        const updatedUser = updatedUsers.find(u => u.id === state.currentUser.id);
        return { users: updatedUsers, currentUser: updatedUser };
      }),

      updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

      resetFilters: () => set((state) => {
        const base = {
          filters: {
            genreId: '',
            minRating: 7,
            year: '',
            language: 'en-US',
            trending: false,
          }
        };
        if (state.currentUser) {
          const updatedUsers = state.users.map(u => u.id === state.currentUser.id ? { ...u, seenIds: { movie: [], tv: [] } } : u);
          const updatedUser = updatedUsers.find(u => u.id === state.currentUser.id);
          return {
            ...base,
            users: updatedUsers,
            currentUser: updatedUser
          };
        }
        return base;
      }),
    }),
    {
      name: 'movie-swipes-storage',
    }
  )
);
