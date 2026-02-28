import React from 'react'
import { X, Heart, Info, RotateCcw } from 'lucide-react'

const SwipeButtons = ({ onNope, onLike, onInfo, onUndo }) => {
    return (
        <div className="flex items-center justify-center gap-4 md:gap-8 pb-4 lg:pb-10 w-full max-w-[400px] pb-safe">
            <button
                onClick={onUndo}
                className="p-4 rounded-full bg-white/5 border border-white/10 text-orange-400 hover:scale-110 active:scale-95 transition-all shadow-lg backdrop-blur-md"
            >
                <RotateCcw size={20} />
            </button>

            <button
                onClick={onNope}
                className="p-5 rounded-full bg-white/5 border border-white/10 text-red-500 hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-md"
            >
                <X size={32} strokeWidth={3} />
            </button>

            <button
                onClick={onInfo}
                className="p-4 rounded-full bg-white/5 border border-white/10 text-blue-400 hover:scale-110 active:scale-95 transition-all shadow-lg backdrop-blur-md"
            >
                <Info size={24} />
            </button>

            <button
                onClick={onLike}
                className="p-5 rounded-full bg-white/5 border border-white/10 text-green-500 hover:scale-110 active:scale-95 transition-all shadow-xl backdrop-blur-md"
            >
                <Heart size={32} fill="currentColor" />
            </button>
        </div>
    )
}

export default SwipeButtons
