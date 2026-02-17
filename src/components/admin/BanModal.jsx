import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Loader } from "lucide-react";

const BanModal = ({
  showBanModal,
  setShowBanModal,
  banForm,
  setBanForm,
  confirmToggleBan,
  loading
}) => {
  return (
    <AnimatePresence>
      {showBanModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setShowBanModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0a0a0a] border border-red-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <Ban size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Restrict Access</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Target: {banForm.username}</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Restriction Reason</label>
                  <textarea
                    value={banForm.banReason}
                    onChange={(e) => setBanForm({ ...banForm, banReason: e.target.value })}
                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-red-500/50 transition-all h-24 resize-none font-medium placeholder:text-gray-800 text-sm"
                    placeholder="VIOLATION OF PROTOCOL..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Restoration Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '24H', days: 1 },
                        { label: '7D', days: 7 },
                        { label: '30D', days: 30 },
                        { label: 'PERM', days: null }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            if (preset.days === null) {
                              setBanForm({ ...banForm, banExpires: "" });
                            } else {
                              const date = new Date();
                              date.setDate(date.getDate() + preset.days);
                              setBanForm({ ...banForm, banExpires: date.toISOString().split('T')[0] });
                            }
                          }}
                          className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${
                            (preset.days === null && !banForm.banExpires) || 
                            (preset.days !== null && banForm.banExpires === new Date(new Date().setDate(new Date().getDate() + (preset.days || 0))).toISOString().split('T')[0])
                            ? "bg-red-500/20 border-red-500 text-red-500"
                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 ml-1">Custom Restoration Date</label>
                    <input
                      type="date"
                      value={banForm.banExpires}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBanForm({ ...banForm, banExpires: e.target.value })}
                      className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-red-500/50 transition-all font-mono text-sm text-gray-300"
                    />
                    <p className="text-[9px] text-gray-600 font-medium ml-1 italic leading-relaxed">
                      {banForm.banExpires 
                        ? `Protocol will be restored automatically on ${new Date(banForm.banExpires).toLocaleDateString()}.`
                        : "Leave empty for permanent termination of access."
                      }
                    </p>
                  </div>
                </div>
            </div>

            <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest text-[10px]"
                >
                  Abort
                </button>
                <button
                  onClick={confirmToggleBan}
                  disabled={loading}
                  className="flex-[2] px-6 py-4 rounded-xl font-black bg-red-600 text-white shadow-lg shadow-red-900/30 hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-[10px] disabled:opacity-50"
                >
                   {loading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Authorize Restriction"}
                </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BanModal;
