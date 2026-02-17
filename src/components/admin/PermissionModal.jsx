import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Lock, AlertTriangle } from "lucide-react";
import { getSafeUserAvatar } from "../../utils/avatarUtils";
import ToggleSwitch from "./ToggleSwitch";

const PermissionModal = ({
  showPermissionModal,
  setShowPermissionModal,
  selectedUser,
  allPermissions,
  handlePermissionToggle
}) => {
  if (!showPermissionModal || !selectedUser) return null;

  return (
    <AnimatePresence>
      {showPermissionModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setShowPermissionModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="relative p-6 md:p-8 pb-6 border-b border-white/5 bg-white/[0.02]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/50">
                        <img 
                          src={getSafeUserAvatar(selectedUser)} 
                          alt={selectedUser.username}
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-black ${
                      selectedUser.status === 'active' && !selectedUser.isBanned 
                        ? 'bg-green-500 text-black' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {selectedUser.status === 'active' && !selectedUser.isBanned ? 'Active' : 'Restricted'}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                      {selectedUser.username}
                      {selectedUser.role === 'admin' && <Shield size={18} className="text-purple-500" />}
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                      ID: <span className="text-gray-400">{selectedUser._id}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {selectedUser.email}
                       </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPermissionModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors border border-white/5"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 min-h-0"
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-6">
                <Lock className="text-purple-500" size={16} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Access Control Matrix</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allPermissions.map((permission, index) => {
                  const hasPermission = selectedUser.permissions.includes(permission.id);
                  return (
                    <motion.div
                      key={permission.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handlePermissionToggle(permission.id)}
                      className={`
                        group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
                        ${hasPermission 
                          ? 'bg-purple-900/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className={`text-xs font-black uppercase tracking-wider mb-1 transition-colors ${
                            hasPermission ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                          }`}>
                            {permission.label}
                          </p>
                          <p className="text-[10px] text-gray-600 font-bold leading-relaxed">
                            {permission.description}
                          </p>
                        </div>
                        <div className="shrink-0 pt-0.5">
                          <ToggleSwitch 
                            enabled={hasPermission} 
                            onChange={() => {}} // Controlled by wrapper onClick
                            size="sm"
                            color="purple"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {selectedUser.role === 'admin' && (
                <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                  <AlertTriangle className="text-orange-500 shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-black text-orange-400 uppercase tracking-wider mb-1">Administrative Override</h4>
                    <p className="text-[10px] text-orange-500/80 font-bold leading-relaxed">
                      This user has global 'Admin' status. Some restrictions may be bypassed automatically by system protocols regardless of specific permission keys.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end gap-3">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors"
              >
                Close Panel
              </button>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all hover:scale-105 active:scale-95"
              >
                Save Protocols
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </AnimatePresence>
  );
};

export default PermissionModal;
