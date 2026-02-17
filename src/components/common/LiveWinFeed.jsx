import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Zap, TrendingUp, Trophy } from 'lucide-react';

const LiveWinFeed = () => {
  const [wins, setWins] = useState([
    { id: 1, user: "EliteX_99", action: "Extracted", reward: "500 GTC", type: "Booster" },
    { id: 2, user: "Saber_Actual", action: "Redeemed", reward: "2X XP", type: "Artifact" },
    { id: 3, user: "Ghost_Protocol", action: "Completed", reward: "Rank Alpha", type: "Status" },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Simulation for demo (real version would use Socket events)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wins.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [wins.length]);

  return (
    <div className="w-full bg-black/40 border-t border-white/5 backdrop-blur-md px-6 py-2 overflow-hidden flex items-center gap-4 group">
      <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-4">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Live Protocol Feed</span>
      </div>

      <div className="flex-1 relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-3 absolute inset-0"
          >
            <span className="text-[10px] font-black text-white italic uppercase tracking-tighter">
              {wins[currentIndex].user}
            </span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
              {wins[currentIndex].action}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10">
              <Zap size={10} className="text-yellow-500" />
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-tight">
                {wins[currentIndex].reward}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="hidden md:flex items-center gap-4 shrink-0 text-white/20">
         <Terminal size={14} />
         <div className="h-4 w-px bg-white/5" />
         <Shield size={14} />
      </div>
    </div>
  );
};

export default LiveWinFeed;
