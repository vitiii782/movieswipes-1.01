import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, User, LogOut, Settings, LogIn, UserPlus, Search } from 'lucide-react';
import { useMovieStore } from '../store/useMovieStore';

const Header = ({ showWatchlist, onToggleWatchlist }) => {
  const { currentUser, setShowCategories, setShowAuth, setShowAccountDetails, setShowLogoutConfirm, setShowMovieFinder } = useMovieStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-[1000] flex items-center justify-between px-4 sm:px-6 pointer-events-none">
      {/* Search / AI Finder Button (Left) */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMovieFinder(true)}
          className="flex items-center gap-2 px-3 h-10 rounded-xl bg-white/5 border border-white/10 text-rose-500 backdrop-blur-md transition-colors shadow-lg"
          title="MovieFinder AI"
        >
          <Search size={18} />
          <span className="hidden md:block text-[10px] font-black uppercase tracking-tighter text-gray-300">MovieFinder AI</span>
        </motion.button>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 cursor-pointer group pointer-events-auto"
          onClick={() => setShowCategories(true)}
          title="Home / Categories"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-110 transition-transform backdrop-blur-md">
            <img src="/logo.png" alt="MovieSwipes Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase italic hidden sm:block">
            MovieSwipes
          </h1>
        </motion.div>
      </div>

      {/* User Profile & Actions */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-lg"
            title="Account Options"
          >
            <User size={22} />
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#16213E]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-2"
              >
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{currentUser.username}</p>
                    </div>
                    <button
                      onClick={() => { setShowAccountDetails(true); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings size={16} /> Account Details
                    </button>
                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setShowAuth(true); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LogIn size={16} /> Log In
                    </button>
                    <button
                      onClick={() => { setShowAuth(true); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <UserPlus size={16} /> Sign Up
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleWatchlist}
          className="flex items-center gap-2 bg-tinder-gradient px-5 py-2.5 rounded-2xl text-white font-bold shadow-lg shadow-rose-500/20 text-sm"
        >
          {showWatchlist ? 'Swipe' : 'Watchlist'}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
