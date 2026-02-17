import { motion, AnimatePresence } from "framer-motion";
import { X, Gem, Loader } from "lucide-react";

const GemModal = ({ isOpen, onClose, form, setForm, onSubmit, loading, isEditing }) => {
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
        className="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Gem size={20} className="text-cyan-400" />
             </div>
             <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">
                    {isEditing ? "Update Package" : "Create Package"}
                </h3>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-0.5">Gem Hub Configuration</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Package Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all uppercase tracking-wide"
                placeholder="E.G. GEM INFUSION"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Gem Amount</label>
                  <input
                    type="number"
                    required
                    value={form.gemAmount}
                    onChange={(e) => setForm({ ...form, gemAmount: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all"
                  />
               </div>
               <div>
                  <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={form.priceInr}
                    onChange={(e) => setForm({ ...form, priceInr: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all"
                  />
               </div>
            </div>

            <div>
              <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-cyan-500/30 transition-all h-24 resize-none"
                placeholder="Brief supply description..."
              />
            </div>
            
            <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5 mb-2">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="showDiscount"
                        checked={form.showDiscount}
                        onChange={(e) => setForm({ ...form, showDiscount: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/20"
                    />
                    <label htmlFor="showDiscount" className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer">Show Discount Badge</label>
                </div>

                {form.showDiscount && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                    >
                        <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Discount Tag (e.g. 20% OFF)</label>
                        <input
                            type="text"
                            value={form.discountTag}
                            onChange={(e) => setForm({ ...form, discountTag: e.target.value.toUpperCase() })}
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xs font-bold text-cyan-400 focus:outline-none focus:border-cyan-500/30 transition-all placeholder:text-gray-700"
                            placeholder="BEST VALUE"
                        />
                    </motion.div>
                )}
            </div>

            <div className="flex items-center gap-2 px-1">
                <input 
                    type="checkbox" 
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/20"
                />
                <label htmlFor="isActive" className="text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer">Active in Season Pass</label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white hover:bg-cyan-500 text-black hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : isEditing ? "EXECUTE UPDATE" : "CREATE PACKAGE"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default GemModal;
