import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Activity } from 'lucide-react';

const TacticalLoader = ({ message = "Calibrating Sector...", subtext = "Initializing Tactical Uplink" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-full border-2 border-dashed border-purple-500/30"
        />
        
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-purple-500/50 border-t-purple-400"
        />

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="text-purple-400 animate-pulse" size={24} />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white italic">
          {message}
        </h3>
        <div className="flex items-center gap-2 justify-center">
            <Activity size={10} className="text-purple-500/50" />
            <p className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                {subtext}
            </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <motion.div
          animate={{ 
            x: ["-100%", "100%"] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="h-full w-24 bg-linear-to-r from-transparent via-purple-500 to-transparent rounded-full"
        />
      </div>
    </div>
  );
};

export default TacticalLoader;
