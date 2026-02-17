import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Star, Gem, Coins, Loader } from "lucide-react";

const SeasonRewardModal = ({ isOpen, onClose, form, setForm, onSubmit, loading, isEditing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl overflow-hidden"
      >
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-red-600/10 border border-red-600/20 shadow-inner">
                {form.isMilestone ? <Star size={24} className="text-amber-400" /> : <Crown size={24} className="text-red-400" />}
             </div>
             <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                    {isEditing ? "Modify Reward" : "Initiate Tier"}
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mt-1">Sector Elevation Protocol</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Level & Milestone */}
            <div className="col-span-full flex flex-col md:flex-row gap-6 items-end border-b border-white/5 pb-8 mb-2">
                <div className="flex-1 w-full">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Reward Level</label>
                    <input
                        type="number"
                        required
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-red-600/30 transition-all"
                        placeholder="E.G. 15"
                    />
                </div>
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-6 py-4 rounded-2xl cursor-pointer hover:bg-amber-500/20 transition-all h-full" onClick={() => setForm({...form, isMilestone: !form.isMilestone})}>
                   <input 
                      type="checkbox" 
                      checked={form.isMilestone} 
                      onChange={() => {}} // Controlled via parent clic
                      className="w-4 h-4 rounded-lg bg-black text-amber-500 border-white/10"
                   />
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Flag as Milestone</span>
                </div>
            </div>

            {/* STANDARD PROTOCOL */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 shadow-inner">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Shield className="w-3 h-3 text-gray-500" /> Standard Protocol
                </h4>
                <div className="space-y-5">
                    <div>
                        <label className="flex items-center gap-2 text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2"><Gem size={10} className="text-cyan-400" /> Diamonds</label>
                        <input
                            type="number"
                            value={form.free.diamonds}
                            onChange={(e) => setForm({ ...form, free: { ...form.free, diamonds: parseInt(e.target.value) || 0 } })}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/30"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2"><Coins size={10} className="text-amber-400" /> GTC Credits</label>
                        <input
                            type="number"
                            value={form.free.gtc}
                            onChange={(e) => setForm({ ...form, free: { ...form.free, gtc: parseInt(e.target.value) || 0 } })}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-amber-500/30"
                        />
                    </div>
                </div>
            </div>

            {/* ELITE AUTHORIZATION */}
            <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 shadow-inner">
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Star className="w-3 h-3 animate-pulse" /> Elite Authorization
                </h4>
                <div className="space-y-5">
                    <div>
                        <label className="flex items-center gap-2 text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2"><Gem size={10} className="text-amber-400" /> Elite Diamonds</label>
                        <input
                            type="number"
                            value={form.elite.diamonds}
                            onChange={(e) => setForm({ ...form, elite: { ...form.elite, diamonds: parseInt(e.target.value) || 0 } })}
                            className="w-full bg-black/40 border border-amber-500/10 rounded-xl px-4 py-3 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500/40"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-[8px] font-black text-amber-600 uppercase tracking-widest mb-2"><Coins size={10} className="text-amber-400" /> Elite GTC</label>
                        <input
                            type="number"
                            value={form.elite.gtc}
                            onChange={(e) => setForm({ ...form, elite: { ...form.elite, gtc: parseInt(e.target.value) || 0 } })}
                            className="w-full bg-black/40 border border-amber-500/10 rounded-xl px-4 py-3 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500/40"
                        />
                    </div>
                </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white hover:bg-red-600 text-black hover:text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : isEditing ? "EXECUTE UPDATES" : "INITIALIZE TIER"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Simple Shield icon for the modal context
const Shield = ({ className, size = 16 }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
);

export default SeasonRewardModal;
