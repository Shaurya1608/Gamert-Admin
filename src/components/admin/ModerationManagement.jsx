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
  toggleUserBan
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter italic leading-none flex items-center gap-3">
             <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <Users className="text-purple-500" size={20} />
             </div>
             User Management
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-2 pl-1">
            Account Controls & Chat Bans
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#0c0c0c]/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="relative max-w-lg group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="SEARCH FOR A USER..." 
              className="block w-full rounded-xl lg:rounded-2xl border border-white/10 bg-black/40 pl-11 pr-4 py-3 text-xs font-bold text-gray-300 placeholder-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 focus:text-white transition-all outline-none uppercase tracking-wider"
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
            {/* Table content remains same */}
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-4 sm:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">Identity</th>
                <th className="px-4 sm:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-32 sm:w-48">User ID</th>
                <th className="px-4 sm:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-32 sm:w-40">Account Access</th>
                <th className="px-4 sm:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-28 sm:w-40">Chat Permission</th>
                <th className="px-4 sm:px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 text-center w-28 sm:w-40">Game Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {modUsers.filter(u => u.username.toLowerCase().includes(modSearch.toLowerCase())).length > 0 ? (
                modUsers.filter(u => u.username.toLowerCase().includes(modSearch.toLowerCase())).map((user) => (
                  <tr key={user._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500/30 transition-colors">
                            <img 
                              src={getSafeUserAvatar(user)} 
                              className="w-full h-full object-cover"
                              alt={user.username}
                            />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0c0c0c] ${user.status === 'active' || !user.isBanned ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-sm text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors truncate">
                              {user.username}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-md w-fit mt-1 ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                              {user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="font-mono text-[10px] text-gray-500 tracking-wider">
                          {user._id.slice(-8).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                       <div className="flex flex-col items-center gap-2">
                         <ToggleSwitch
                           enabled={!user.isBanned}
                           onChange={() => handleToggle(user._id, "isBanned", user.isBanned)}
                           label="Account Access"
                           disabled={loadingStates[`${user._id}-isBanned`]}
                           color={!user.isBanned ? "green" : "red"}
                           size="md"
                         />
                         <span className={`text-[8px] font-black uppercase tracking-wider ${!user.isBanned ? 'text-green-400' : 'text-red-400'}`}>
                           {!user.isBanned ? 'Active' : 'Banned'}
                         </span>
                       </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                       <div className="flex flex-col items-center gap-2">
                         <ToggleSwitch
                           enabled={!user.chatBan}
                           onChange={() => handleToggle(user._id, "chatBan", user.chatBan)}
                           label="Chat Permission"
                           disabled={loadingStates[`${user._id}-chatBan`]}
                           color={!user.chatBan ? "blue" : "red"}
                           size="md"
                         />
                         <span className={`text-[8px] font-black uppercase tracking-wider ${!user.chatBan ? 'text-blue-400' : 'text-orange-400'}`}>
                           {!user.chatBan ? 'Allowed' : 'Muted'}
                         </span>
                       </div>
                    </td>

                    <td className="px-4 sm:px-6 py-4">
                       <div className="flex flex-col items-center gap-2">
                         <ToggleSwitch
                           enabled={!user.joinBan}
                           onChange={() => handleToggle(user._id, "joinBan", user.joinBan)}
                           label="Game Access"
                           disabled={loadingStates[`${user._id}-joinBan`]}
                           color={!user.joinBan ? "purple" : "red"}
                           size="md"
                         />
                         <span className={`text-[8px] font-black uppercase tracking-wider ${!user.joinBan ? 'text-emerald-400' : 'text-yellow-400'}`}>
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
                          subtitle="No users match your filter criteria in this sector."
                          icon={Users}
                        />
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3));
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to right, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5));
        }
      `}</style>
    </div>
  );
};

export default ModerationManagement;
