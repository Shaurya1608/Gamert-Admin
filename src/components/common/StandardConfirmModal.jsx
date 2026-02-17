import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  AlertTriangle,
  Info,
  ShieldAlert,
  Zap,
  ChevronRight
} from "lucide-react";

/**
 * StandardConfirmModal
 * A premium, gaming-themed alternative to window.confirm()
 * Optimizations: Keyboard accessibility, staggered animations, JIT-safe classes.
 */
const StandardConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?", 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    type = "warning", // danger, warning, info
    loading = false 
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && !loading) onConfirm();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onConfirm, loading]);

  if (typeof document === 'undefined') return null;

  const typeConfig = {
    danger: {
        icon: ShieldAlert,
        accent: "text-red-500",
        border: "border-red-500/20",
        bg: "bg-red-500/10",
        glow: "shadow-red-900/20",
        btn: "bg-red-600 hover:bg-red-500 shadow-red-600/20",
        strip: "via-red-500",
        ambient: "bg-red-600/10"
    },
    warning: {
        icon: AlertTriangle,
        accent: "text-purple-500",
        border: "border-purple-500/20",
        bg: "bg-purple-500/10",
        glow: "shadow-purple-900/20",
        btn: "bg-purple-600 hover:bg-purple-500 shadow-purple-600/20",
        strip: "via-purple-500",
        ambient: "bg-purple-600/10"
    },
    info: {
        icon: Info,
        accent: "text-blue-500",
        border: "border-blue-500/20",
        bg: "bg-blue-500/10",
        glow: "shadow-blue-900/20",
        btn: "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20",
        strip: "via-blue-500",
        ambient: "bg-blue-600/10"
    }
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 10,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden">
          {/* Layered Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 sm:bg-black/80 sm:backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-linear-to-b from-purple-500/5 via-transparent to-black/40 pointer-events-none"
          />

          {/* Modal Container */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] gpu-accelerated"
          >
            {/* Ambient Background Glows */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${config.ambient} rounded-full blur-[60px] pointer-events-none`} />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none" />

            {/* Header Identity Strip */}
            <div className={`h-1.5 w-full bg-linear-to-r from-transparent ${config.strip} to-transparent opacity-80`} />

            <div className="p-8 sm:p-10">
                {/* Icon Section */}
                <motion.div variants={itemVariants} className="flex flex-col items-center text-center mb-8">
                    <div className={`p-5 rounded-2xl ${config.bg} border ${config.border} mb-6 relative group`}>
                         <div className={`absolute inset-0 bg-white/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                         <Icon className={config.accent} size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-3 leading-none drop-shadow-lg">
                        {title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed px-4 italic">
                        {message}
                    </p>
                </motion.div>

                {/* Authorization Card with Flicker Animation */}
                <motion.div 
                    variants={itemVariants}
                    animate={{ 
                        opacity: [1, 0.8, 1, 0.9, 1],
                    }}
                    transition={{ 
                        duration: 0.2, 
                        times: [0, 0.2, 0.4, 0.6, 1],
                        repeat: 0
                    }}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-10 flex items-center gap-4 text-left relative overflow-hidden group/warn"
                >
                     <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/warn:translate-x-full transition-transform duration-1000" />
                     <div className="p-2.5 bg-yellow-500/10 rounded-xl shrink-0 border border-yellow-500/20">
                        <Zap size={14} className="text-yellow-500" fill="currentColor" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                           Confirmation
                        </p>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter italic">Please confirm to proceed.</p>
                     </div>
                </motion.div>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 relative h-14 rounded-2xl ${config.btn} text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group/confirm overflow-hidden flex items-center justify-center gap-2`}
                    >
                         <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/confirm:translate-x-full transition-transform duration-700 ease-in-out" />
                         <span className="relative z-10 flex items-center gap-2">
                            {loading ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                            ) : (
                                <>
                                    {confirmText}
                                    <ChevronRight size={14} className="group-hover/confirm:translate-x-1 transition-transform" />
                                </>
                            )}
                         </span>
                    </button>
                    
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/5 text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                </motion.div>
            </div>

            {/* Top Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all border border-white/5"
                disabled={loading}
            >
                <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default StandardConfirmModal;
