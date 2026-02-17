import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Cpu, Wifi } from "lucide-react";

/**
 * Premium Game-Themed Loading Screen
 * Incorporates cyberpunk/sci-fi aesthetics with glitch effects and dynamic status updates.
 */
const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("INITIALIZING SYSTEM");
  const [progress, setProgress] = useState(0);

  // Dynamic loading status simulation
  useEffect(() => {
    const statuses = [
      "ESTABLISHING SECURE LINK...",
      "LOADING ASSETS...",
      "SYNCING PLAYER DATA...",
      "CALIBRATING SENSORS...",
      "OPTIMIZING SHADERS...",
      "CONNECTING TO SERVER...",
      "INTERFACING NEURAL LINK...",
      "SYSTEM READY"
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setLoadingText(statuses[currentIndex]);
    }, 300); // Faster status cycling

    return () => clearInterval(interval);
  }, []);

  // Progress bar simulation - Highly optimized speed
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        const jump = Math.random() * 25; // Bigger jumps
        return Math.min(prev + jump, 100);
      });
    }, 150); // Faster update frequency
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden font-sans select-none cursor-wait">
      
      {/* 1. Background Grid & Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_2px,transparent_2px),linear-gradient(90deg,rgba(18,18,18,0)_2px,transparent_2px)] bg-[size:40px_40px] [background-position:center] border-t border-purple-500/10" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_70%)]" />
      </div>

      {/* 2. Main Centerpiece */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Rotating Outer Ring */}
        <div className="relative flex items-center justify-center mb-12">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-8 rounded-full border border-dashed border-purple-500/20 w-40 h-40"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 -m-4 rounded-full border border-dotted border-white/10 w-32 h-32"
            />

            {/* Central Hexagon / Icon */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    repeat: Infinity, 
                    repeatType: "reverse" 
                }}
                className="relative w-24 h-24 bg-black/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
            >
                <div className="absolute inset-0 bg-purple-500/10 rounded-2xl animate-pulse" />
                <img 
                  src="/logo/gamerthread-logo.png" 
                  alt="GamerThred" 
                  className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] relative z-10" 
                />
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-purple-500" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-purple-500" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-purple-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-purple-500" />
            </motion.div>
        </div>

        {/* 3. Text & Status */}
        <div className="flex flex-col items-center gap-3">
            <motion.h2 
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl font-black tracking-[0.2em] text-white italic uppercase"
            >
                GAMER<span className="text-purple-500">THRED</span>
            </motion.h2>

            <div className="h-6 overflow-hidden flex items-center justify-center min-w-[200px]">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={loadingText}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="text-[10px] font-mono text-purple-300/80 tracking-widest uppercase"
                    >
                        {loadingText}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>

        {/* 4. Progress Bar */}
        <div className="mt-8 w-64 h-1.5 bg-gray-900 rounded-full overflow-hidden relative border border-white/5">
            <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50 }}
            />
            {/* Scanline effect over bar */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] w-1/2 h-full skew-x-[-20deg] animate-shimmer" />
        </div>
        
        <div className="mt-2 text-[9px] font-mono text-gray-600 flex justify-between w-64">
            <span>SYS_VER_2.4.0</span>
            <span>{Math.round(progress)}%</span>
        </div>

      </div>

      {/* 5. Footer Decor */}
      <div className="absolute bottom-8 flex gap-8 text-gray-700">
          <Cpu size={14} className="animate-pulse" />
          <Wifi size={14} className="animate-pulse delay-75" />
          <Zap size={14} className="animate-pulse delay-150" />
      </div>

    </div>
  );
};

export default LoadingScreen;
