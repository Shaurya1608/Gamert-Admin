import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Users } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import StandardEmptyState from "../common/StandardEmptyState";
import { getSafeUserAvatar } from "../../utils/avatarUtils";

const ModerationManagement = ({
  modUsers,
  modSearch,
  setModSearch,
  toggleUserBan,
  pagination,
  setPagination,
  loading
}) => {
  const [loadingStates, setLoadingStates] = useState({});

  const handleToggle = async (userId, type, currentValue) => {
    const key = `${userId}-${type}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    try {
        await toggleUserBan(userId, type, currentValue);
    } finally {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic leading-none flex items-center gap-2">
             <div className="p-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Users className="text-purple-500" size={16} />
             </div>
             User Moderation
          </h2>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1.5 pl-1">
            Account Controls & Chat Bans
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#0c0c0c]/80 backdrop-blur-xl rounded-xl lg:rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-white/5 bg-white/[0.02]">
          <div className="relative max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="SEARCH OPERATIVE..." 
              className="block w-full rounded-lg lg:rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-2 text-[10px] font-bold text-gray-300 placeholder-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 focus:text-white transition-all outline-none uppercase tracking-wider"
              onChange={(e) => setModSearch(e.target.value)}
              value={modSearch}
            />
          </div>
        </div>

        {/* Content Table */}
        <div 
          className="overflow-x-auto mobile-table-wrapper custom-scrollbar"
          onWheel={(e) => e.stopPropagation()}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-4 sm:px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Identity</th>
                <th className="px-4 sm:px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-24 sm:w-32">User ID</th>
                <th className="px-4 sm:px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-28 sm:w-40">Account</th>
                <th className="px-4 sm:px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-28 sm:w-40">Chat</th>
                <th className="px-4 sm:px-6 py-3 text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-28 sm:w-40">Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {modUsers.length > 0 ? (
                modUsers.map((user) => (
                  <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 group-hover:border-purple-500/30 transition-colors">
                            <img 
                              src={getSafeUserAvatar(user)} 
                              className="w-full h-full object-cover"
                              alt={user.username}
                            />
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0c0c0c] ${user.status === 'active' || !user.isBanned ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-[12px] text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors truncate">
                              {user.username}
                          </span>
                          <span className={`text-[7px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded w-fit mt-0.5 ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                              {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-2.5 text-center">
                      <span className="font-mono text-[9px] text-gray-600 tracking-wider bg-white/[0.02] px-2 py-0.5 rounded border border-white/5">
                          {user._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-2.5">
                       <div className="flex flex-col items-center gap-1">
                         <ToggleSwitch
                           enabled={!user.isBanned}
                           onChange={() => handleToggle(user._id, "isBanned", user.isBanned)}
                           disabled={loadingStates[`${user._id}-isBanned`]}
                           color={!user.isBanned ? "green" : "red"}
                           size="sm"
                         />
                         <span className={`text-[7px] font-black uppercase tracking-wider ${!user.isBanned ? 'text-green-500/70' : 'text-red-500/70'}`}>
                           {!user.isBanned ? 'Active' : 'Banned'}
                         </span>
                       </div>
                    </td>

                    <td className="px-4 sm:px-6 py-2.5">
                       <div className="flex flex-col items-center gap-1">
                         <ToggleSwitch
                           enabled={!user.chatBan}
                           onChange={() => handleToggle(user._id, "chatBan", user.chatBan)}
                           disabled={loadingStates[`${user._id}-chatBan`]}
                           color={!user.chatBan ? "blue" : "red"}
                           size="sm"
                         />
                         <span className={`text-[7px] font-black uppercase tracking-wider ${!user.chatBan ? 'text-blue-500/70' : 'text-orange-500/70'}`}>
                           {!user.chatBan ? 'Allowed' : 'Muted'}
                         </span>
                       </div>
                    </td>

                    <td className="px-4 sm:px-6 py-2.5">
                       <div className="flex flex-col items-center gap-1">
                         <ToggleSwitch
                           enabled={!user.joinBan}
                           onChange={() => handleToggle(user._id, "joinBan", user.joinBan)}
                           disabled={loadingStates[`${user._id}-joinBan`]}
                           color={!user.joinBan ? "purple" : "red"}
                           size="sm"
                         />
                         <span className={`text-[7px] font-black uppercase tracking-wider ${!user.joinBan ? 'text-emerald-500/70' : 'text-yellow-500/70'}`}>
                           {!user.joinBan ? 'Allowed' : 'Restricted'}
                         </span>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-12">
                        <StandardEmptyState 
                          title="No Users Found" 
                          subtitle="No users match your filter criteria."
                          icon={Users}
                        />
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar compact padding */}
        {pagination && pagination.pages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 p-4 border-t border-white/5 bg-white/[0.01]">
            {(() => {
              const current = pagination.page;
              const total = pagination.pages;
              const delta = 1;
              const range = [];
              const rangeWithDots = [];
              let l;

              for (let i = 1; i <= total; i++) {
                if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                  range.push(i);
                }
              }

              for (let i of range) {
                if (l) {
                  if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                  } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                  }
                }
                rangeWithDots.push(i);
                l = i;
              }

              return rangeWithDots.map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? setPagination({ ...pagination, page }) : null}
                  disabled={page === '...'}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded sm:rounded-lg transition font-black text-[9px] uppercase tracking-tighter ${
                    page === '...' 
                      ? "cursor-default text-gray-700"
                      : pagination.page === page
                        ? "bg-purple-600 text-white shadow-lg border border-purple-500/50"
                        : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {page}
                </button>
              ));
            })()}
          </div>
        )}
      </div>
      
      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3));
            border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ModerationManagement;
