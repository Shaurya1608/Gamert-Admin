import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Globe, 
  Smartphone, 
  Monitor, 
  ShieldAlert, 
  LogOut, 
  User, 
  Clock,
  ShieldCheck,
  Search,
  RefreshCw
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const GlobalSessionMonitor = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchGlobalPulses = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/global-sessions");
            if (res.data.success) {
                setSessions(res.data.sessions);
            }
        } catch (err) {
            toast.error("Failed to sync with global pulse network");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGlobalPulses();
        // Periodic sync every 30 seconds
        const interval = setInterval(fetchGlobalPulses, 30000);
        return () => clearInterval(interval);
    }, []);

    const revokeSession = async (sessionId, username) => {
        if (!window.confirm(`Are you sure you want to terminate the session for ${username}?`)) return;
        
        try {
            const res = await api.delete(`/admin/global-sessions/${sessionId}`);
            if (res.data.success) {
                setSessions(prev => prev.filter(s => s._id !== sessionId));
                toast.success(`Protocol Terminated: ${username} has been disconnected.`);
            }
        } catch (err) {
            toast.error("Intervention failed: Connection remains active.");
        }
    };

    const filteredSessions = sessions.filter(s => 
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.ip.includes(searchQuery)
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-purple-500" />
                        Global Pulse
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold font-mono">
                        Real-time Administrative Command Center
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-500 transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="TRACE IP OR IDENTITY..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-black uppercase tracking-widest focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all outline-none w-full md:w-64"
                        />
                    </div>
                    
                    <button 
                        onClick={fetchGlobalPulses}
                        disabled={loading}
                        className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all disabled:opacity-50 active:scale-95"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Pulse Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredSessions.map((session) => (
                        <motion.div
                            key={session._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative p-[1px] rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-500"
                        >
                            <div className="bg-[#0f1117] rounded-2xl p-5 flex flex-col sm:flex-row gap-5">
                                {/* User Info */}
                                <div className="flex items-center gap-4 sm:border-r border-white/5 sm:pr-6">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                            {session.avatar ? (
                                                <img src={session.avatar} alt={session.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xl uppercase italic">
                                                    {session.username.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f1117] shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-black text-sm uppercase tracking-tighter truncate max-w-[120px]">
                                                {session.username}
                                            </h4>
                                            {session.role === 'admin' && (
                                                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                                            )}
                                        </div>
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest truncate max-w-[120px]">
                                            {session.role} access
                                        </p>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/5 rounded-lg">
                                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Address</p>
                                            <p className="text-[10px] text-white font-mono">{session.ip}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/5 rounded-lg">
                                            {session.userAgent.toLowerCase().includes('mobile') ? (
                                                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                                            ) : (
                                                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                                            )}
                                        </div>
                                        <div className="max-w-[100px] overflow-hidden">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest truncate">Machine</p>
                                            <p className="text-[10px] text-white font-mono truncate">{session.userAgent}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/5 rounded-lg">
                                            <Activity className="w-3.5 h-3.5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Heartbeat</p>
                                            <p className="text-[10px] text-white font-mono uppercase tracking-tighter">
                                                {new Date(session.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        {!session.isCurrent ? (
                                            <button
                                                onClick={() => revokeSession(session._id, session.username)}
                                                className="group/btn flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                            >
                                                <LogOut className="w-3.5 h-3.5 group-hover/btn:animate-pulse" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">Terminate</span>
                                            </button>
                                        ) : (
                                            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                                <span className="text-[9px] font-black uppercase tracking-widest italic">Current Node</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredSessions.length === 0 && !loading && (
                    <div className="col-span-full py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                        <ShieldAlert className="w-12 h-12 text-gray-700 mb-4" />
                        <h3 className="text-gray-500 font-black uppercase tracking-[0.3em] text-sm italic">
                            No Active Pulses Detected
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalSessionMonitor;
