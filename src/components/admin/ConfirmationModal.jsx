import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmationModal = ({
  confirmModal,
  setConfirmModal
}) => {
  return (
    <AnimatePresence>
      {confirmModal.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
          >
             {/* Glow effect based on type */}
             <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] pointer-events-none opacity-20 ${
                 confirmModal.type === 'danger' ? 'bg-red-500' : (confirmModal.type === 'warning' ? 'bg-yellow-500' : 'bg-purple-500')
             }`} />

            <h3 className="text-xl font-bold mb-2 relative z-10 text-white">{confirmModal.title}</h3>
            <p className="text-gray-400 mb-6 relative z-10 text-sm leading-relaxed">{confirmModal.message}</p>

            <div className="flex justify-end gap-3 relative z-10">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className={`px-4 py-2 rounded-lg font-bold text-white transition text-sm shadow-lg ${
                    confirmModal.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
                    : (confirmModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-black' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/20')
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
