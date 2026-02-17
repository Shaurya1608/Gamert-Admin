import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Zap, 
  Database, 
  TrendingUp,
  X,
  Skull,
  Check,
  ShieldAlert,
  Lock
} from "lucide-react";
import api from "../../services/api";

const CachePurgeModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [selectedScopes, setSelectedScopes] = useState([
    "leaderboards", 
    "rate_limits", 
    "sessions"
  ]);
  const [status, setStatus] = useState({ isWeekendMissionActive: false });

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/admin/system/cache-status");
      if (res.data.success) {
        setStatus(res.data.data);
        // If weekend mission is NOT active, it's safer to include by default
        if (!res.data.data.isWeekendMissionActive) {
           setSelectedScopes(prev => [...new Set([...prev, "weekend_missions"])]);
        } else {
           // If it IS active, remove it from default selection to prevent accidental reset
           setSelectedScopes(prev => prev.filter(s => s !== "weekend_missions"));
        }
      }
    } catch (err) {
      console.error("Failed to fetch cache status", err);
    }
  };

  const toggleScope = (scopeId) => {
    if (selectedScopes.includes(scopeId)) {
      setSelectedScopes(selectedScopes.filter(s => s !== scopeId));
    } else {
      setSelectedScopes([...selectedScopes, scopeId]);
    }
  };

  const risks = [
    {
      id: "weekend_missions",
      title: "Weekend Mission Progress",
      desc: "CRITICAL: Wipes all live squad goal counters. Progress returns to 0/50 for all groups.",
      icon: <Skull size={18} />,
      risk: "high",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      activeIndicator: status.isWeekendMissionActive ? "LIVE EVENT DETECTED" : "NO ACTIVE EVENT"
    },
    {
      id: "sessions",
      title: "User Auth Tokens",
      desc: "MEDIUM: Forces all users to re-login on their next visit. Immediate token expiration.",
      icon: <Lock size={18} />,
      risk: "medium",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      id: "leaderboards",
      title: "Global Leaderboards",
      desc: "LOW: Ranks will re-calculate from DB on next view. Safe but temporary load increase.",
      icon: <TrendingUp size={18} />,
      risk: "low",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      id: "rate_limits",
      title: "Traffic Inhibitors",
      desc: "LOW: Resets IP-based rate limiting. Used to clear accidental bans.",
      icon: <ShieldAlert size={18} />,
      risk: "low",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    }
  ];

  const handleConfirm = () => {
    onConfirm(selectedScopes);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-5 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Tactical Cache Purge</h3>
                  <p className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5 sm:mt-1 italic">Action: Selective Neural Wipe</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed">
                Select the tactical scopes to include in the purge sequence. Unchecked items will remain cached.
              </p>

              <div className="grid grid-cols-1 gap-4">
                {risks.map((risk) => (
                  <div 
                    key={risk.id}
                    onClick={() => toggleScope(risk.id)}
                    className={`flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        selectedScopes.includes(risk.id) 
                        ? `${risk.bg} ${risk.border} scale-[1.01]` 
                        : "bg-transparent border-white/5 opacity-40 hover:opacity-100 hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Tactical Checkbox */}
                    <div className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        selectedScopes.includes(risk.id)
                        ? `${risk.bg} ${risk.border.replace('border-', 'text-')}`
                        : "border-zinc-800 bg-black/40"
                    }`}>
                      {selectedScopes.includes(risk.id) && <Check size={12} className="sm:w-3.5 sm:h-3.5 stroke-[4px]" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                           <span className={risk.color}>{risk.icon}</span>
                           <span className="text-[11px] sm:text-[12px] font-black text-white uppercase tracking-wider">{risk.title}</span>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-1.5 sm:gap-1">
                            {risk.activeIndicator && (
                                <span className={`text-[7px] sm:text-[8px] font-black px-1.2 py-0.3 sm:px-1.5 sm:py-0.5 rounded border animate-pulse ${
                                    status.isWeekendMissionActive ? "bg-red-500/20 border-red-500/40 text-red-500" : "bg-green-500/20 border-green-500/40 text-green-500"
                                }`}>
                                    {risk.activeIndicator}
                                </span>
                            )}
                            <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1.5 py-0.3 sm:px-2 sm:py-0.5 rounded ${risk.bg} ${risk.color}`}>
                            {risk.risk} Risk
                            </span>
                        </div>
                      </div>
                      <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 leading-normal italic sm:pr-20">
                        {risk.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 sm:p-8 bg-black border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 flex-1 py-3 sm:py-4 rounded-xl text-zinc-500 font-black text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all text-center"
              >
                Abort Protocol
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || selectedScopes.length === 0}
                className="order-1 sm:order-2 flex-[2] py-3 sm:py-4 rounded-xl bg-amber-500 text-black font-black text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.2)] disabled:opacity-30 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-black/30 border-t-black rounded-full" />
                    Executing Selection...
                  </>
                ) : (
                  <>Execute Selection ({selectedScopes.length})</>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CachePurgeModal;
