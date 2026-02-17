import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader } from "lucide-react";

const CommunityModal = ({
  showCommunityModal,
  setShowCommunityModal,
  communityForm,
  setCommunityForm,
  submitCommunity,
  loading
}) => {
  return (
    <AnimatePresence>
      {showCommunityModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCommunityModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#0c0c0c] rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden p-6 sm:p-8"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">New Community</h3>
              <button
                onClick={() => setShowCommunityModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Community Name</label>
                <input
                  type="text"
                  value={communityForm.name}
                  onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-bold placeholder:text-gray-800"
                  placeholder="E.G. VALORANT PROS"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Objective / Description</label>
                <textarea
                  value={communityForm.description}
                  onChange={(e) => setCommunityForm({ ...communityForm, description: e.target.value })}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all h-28 resize-none font-medium placeholder:text-gray-800"
                  placeholder="DESCRIBE THE CORE OF THIS COMMUNITY..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Visual Identity (Icon URL)</label>
                <input
                  type="text"
                  value={communityForm.icon}
                  onChange={(e) => setCommunityForm({ ...communityForm, icon: e.target.value })}
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-mono text-xs placeholder:text-gray-800"
                  placeholder="HTTPS://IMAGE-HOST.COM/ICON.PNG"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowCommunityModal(false)}
                className="flex-1 px-6 py-4 rounded-xl font-bold bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-xs"
              >
                Discard
              </button>
              <button
                onClick={submitCommunity}
                className="flex-[2] px-6 py-4 rounded-xl font-black bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                disabled={loading || !communityForm.name}
              >
                {loading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Deploy Community"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommunityModal;
