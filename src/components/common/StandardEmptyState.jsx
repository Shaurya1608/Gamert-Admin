// src/components/common/StandardEmptyState.jsx
import React from "react";
import { motion } from "framer-motion";
import { Search, Inbox, AlertCircle } from "lucide-react";

/**
 * A standard empty state component with theme consistency.
 * @param {Object} props
 * @param {string} props.title - Main error/empty message
 * @param {string} props.subtitle - Descriptive guidance
 * @param {React.ElementType} props.icon - Lucide icon component
 * @param {string} props.actionLabel - Label for the CTA button
 * @param {Function} props.onAction - Action handler
 */
const StandardEmptyState = ({ 
  title = "No Data Found", 
  subtitle = "We couldn't find any records matching your criteria.", 
  icon: Icon = Search, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01] relative overflow-hidden group">
        <div className="absolute inset-0 bg-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="p-6 rounded-full bg-purple-500/5 border border-purple-500/10 mb-6 relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
            <Icon size={40} className="text-purple-500/40 relative z-10" />
        </div>
        
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 italic">{title}</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-8 text-center max-w-[280px] leading-relaxed">
            {subtitle}
        </p>

        {actionLabel && onAction && (
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAction}
                className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-purple-600/20 flex items-center gap-3"
            >
                {actionLabel}
            </motion.button>
        )}
    </div>
  );
};

export default StandardEmptyState;
