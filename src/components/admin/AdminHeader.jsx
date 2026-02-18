import React from "react";
import { motion } from "framer-motion";
import { LogOut, Shield, User as UserIcon } from "lucide-react";
import { getAvatarUrl } from "../../utils/avatarUtils";

const AdminHeader = ({ user, logout }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-purple-500/10 px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-purple-600/10 flex items-center justify-center border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
          <img 
            src="/logo/gamerthread-logo.png" 
            alt="GT" 
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/vite.svg";
            }}
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-black tracking-tighter italic bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent uppercase">
            GamerThred
          </h1>
          <p className="text-[8px] text-purple-500 font-bold uppercase tracking-[0.3em] leading-none mt-0.5">
            Command Center
          </p>
        </div>
      </div>

      {/* User Actions Section */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all group">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-white uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                {user.username}
              </p>
              <p className="text-[7px] text-gray-500 font-mono uppercase tracking-widest mt-0.5">
                SEC-ID: {user._id?.slice(-8).toUpperCase() || "ADMIN"}
              </p>
            </div>
            
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-purple-500/30 transition-all shadow-lg">
              <img 
                src={getAvatarUrl(user.avatar)} 
                alt={user.username} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=a855f7&color=fff`;
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 group shadow-lg"
          title="Exit System"
        >
          <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Exit</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
