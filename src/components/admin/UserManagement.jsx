import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, Search, Users, Shield, Lock, Trash2, Ban } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import StandardEmptyState from "../common/StandardEmptyState";
import { getSafeUserAvatar } from "../../utils/avatarUtils";


const UserManagement = ({
  loading,
  users,
  searchQuery,
  setSearchQuery,
  pagination,
  setPagination,
  handleRoleChange,
  handleStatusChange,
  formatDate,
  setSelectedUser,
  setShowPermissionModal,
  handleDeleteUser,
  roles,
  toggleUserBan,
  loadingActions,
  currentUser
}) => {
  const [toggleLoading, setToggleLoading] = useState({});
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
        setPagination && setPagination({ ...pagination, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleToggle = async (userId, type, currentValue) => {
      const key = `${userId}-${type}`;
      setToggleLoading(prev => ({ ...prev, [key]: true }));
      try {
          // If we passed a toggleUserBan function specifically for chat/join bans
          if (toggleUserBan) {
              await toggleUserBan(userId, type, currentValue);
          } else {
              // Fallback for role/status if needed, but primarily for the new toggles
              console.warn("toggleUserBan prop missing");
          }
      } finally {
          setToggleLoading(prev => ({ ...prev, [key]: false }));
      }
  };


  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic leading-none flex items-center gap-2">
             <div className="p-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Users className="text-purple-500" size={16} />
             </div>
             User Infrastructure
          </h2>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1.5 pl-1">
            Identity Control & Access Protocols
          </p>
        </div>
        
        {/* Search & Filter */}
        <div className="w-full md:w-auto relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="FILTER IDENTITIES..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
             className="w-full md:w-64 bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-[10px] font-black tracking-widest text-white placeholder-gray-600 focus:border-purple-500/50 outline-none uppercase transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0c0c0c]/80 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        <div 
          className="overflow-x-auto mobile-table-wrapper custom-scrollbar relative min-h-[400px]"
          onWheel={(e) => e.stopPropagation()}
        >
          <AnimatePresence>
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                    <Loader className="w-10 h-10 text-purple-500 animate-spin relative z-10" />
                  </div>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] animate-pulse">Syncing Database...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/5">
                <th className="px-6 py-3 text-left text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-6 py-3 text-left text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Role</th>
                <th className="px-6 py-3 text-center text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Access</th>
                <th className="px-6 py-3 text-center text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Chat</th>
                <th className="px-6 py-3 text-center text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Entry</th>
                <th className="px-6 py-3 text-center text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-2.5">
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
                        <div>
                          <p className="font-black text-[12px] text-white uppercase tracking-tight leading-none group-hover:text-purple-400 transition-colors">{user.username}</p>
                          <p className="text-[8px] text-gray-600 font-bold tracking-wider mt-0.5">{user.email.toLowerCase()}</p>
                          <p className="text-[7px] text-gray-700 font-bold tracking-wider mt-0.5">ID: {user._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {loadingActions[user._id] ? (
                         <div className="flex justify-center">
                            <Loader className="w-4 h-4 text-purple-400 animate-spin" />
                         </div>
                      ) : (
                          <select
                          value={user.role}
                          disabled={user.role === 'admin' || user._id === currentUser?._id}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] focus:outline-none focus:border-purple-500/50 transition w-full ${
                              user.role === 'admin' ? 'text-purple-400 opacity-80 cursor-not-allowed' : 
                              user._id === currentUser?._id ? 'text-blue-400 opacity-80 cursor-not-allowed' :
                              user.role === 'moderator' ? 'text-blue-400 cursor-pointer' : 
                              'text-green-400 cursor-pointer'
                          }`}
                          >
                          {roles.map((role) => (
                              <option key={role.id} value={role.id} className="bg-[#0c0c0c] text-gray-300">
                              {role.label}
                              </option>
                          ))}
                          </select>
                      )}
                    </td>

                    <td className="px-6 py-2.5">
                       <div className="flex flex-col items-center gap-1">
                         <ToggleSwitch
                           enabled={user.status === 'active' && !user.isBanned}
                           onChange={() => handleToggle(user._id, "isBanned", user.isBanned)}
                           disabled={user.role === 'admin' || user._id === currentUser?._id || toggleLoading[`${user._id}-isBanned`]}
                           color={user.status === 'active' && !user.isBanned ? "green" : "red"}
                           size="sm"
                         />
                         <span className={`text-[7px] font-black uppercase tracking-wider ${user.status === 'active' && !user.isBanned ? 'text-green-500/70' : 'text-red-500/70'}`}>
                           {user.status === 'active' && !user.isBanned ? 'Active' : 'Banned'}
                         </span>
                       </div>
                    </td>

                    <td className="px-6 py-2.5">
                       <div className="flex flex-col items-center gap-1">
                         <ToggleSwitch
                           enabled={!user.chatBan}
                           onChange={() => handleToggle(user._id, "chatBan", user.chatBan)}
                           disabled={user.role === 'admin' || user._id === currentUser?._id || toggleLoading[`${user._id}-chatBan`]}
                           color={!user.chatBan ? "blue" : "red"}
                           size="sm"
                         />
                         <span className={`text-[7px] font-black uppercase tracking-wider ${!user.chatBan ? 'text-blue-500/70' : 'text-orange-500/70'}`}>
                           {!user.chatBan ? 'Allowed' : 'Muted'}
                         </span>
                       </div>
                    </td>

                    <td className="px-6 py-2.5">
                       <div className="flex flex-col items-center gap-1">
                         <ToggleSwitch
                           enabled={!user.joinBan}
                           onChange={() => handleToggle(user._id, "joinBan", user.joinBan)}
                           disabled={user.role === 'admin' || user._id === currentUser?._id || toggleLoading[`${user._id}-joinBan`]}
                           color={!user.joinBan ? "purple" : "red"}
                           size="sm"
                         />
                         <span className={`text-[7px] font-black uppercase tracking-wider ${!user.joinBan ? 'text-emerald-500/70' : 'text-yellow-500/70'}`}>
                           {!user.joinBan ? 'Allowed' : 'Restricted'}
                         </span>
                       </div>
                    </td>

                    <td className="px-6 py-2.5 text-center">
                      <div className="flex gap-1.5 justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPermissionModal(true);
                          }}
                          disabled={user.role === 'admin' || user._id === currentUser?._id}
                          className="p-1.5 rounded-lg bg-white/[0.03] text-gray-500 hover:text-white hover:bg-white/[0.08] transition border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={user.role === 'admin' ? "Locked" : "Permissions"}
                        >
                          <Lock size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === 'admin' || user._id === currentUser?._id}
                          className="p-1.5 rounded-lg bg-red-500/5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition border border-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                          title={user.role === 'admin' ? "Protected" : "Delete"}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                    <td colSpan="6" className="py-12 px-6">
                        <StandardEmptyState 
                            title="No Operatives Found" 
                            subtitle="No agents match your filter criteria in the current sector."
                            icon={Users}
                        />
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user._id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-4">
                        {/* User Header */}
                        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                            <div className="relative shrink-0">
                                <img 
                                    src={getSafeUserAvatar(user)} 
                                    className="w-10 h-10 rounded-xl object-cover"
                                    alt={user.username}
                                />
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0c0c0c] ${user.status === 'active' || !user.isBanned ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-black text-sm text-white uppercase tracking-tight truncate">{user.username}</p>
                                <p className="text-[10px] text-gray-500 font-bold tracking-wider truncate">{user.email}</p>
                            </div>
                            {/* Actions Dropdown Trigger (Optional, or just inline buttons) */}
                            <div className="flex gap-2">
                                <button 
                                  disabled={user.role === 'admin' || user._id === currentUser?._id}
                                  onClick={() => { setSelectedUser(user); setShowPermissionModal(true); }} 
                                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={user.role === 'admin' ? "Locked" : "Permissions"}
                                >
                                  <Lock size={14}/>
                                </button>
                                <button 
                                  disabled={user.role === 'admin' || user._id === currentUser?._id}
                                  onClick={() => handleDeleteUser(user._id)} 
                                  className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                  title={user.role === 'admin' ? "Protected" : "Delete"}
                                >
                                  <Trash2 size={14}/>
                                </button>
                            </div>
                        </div>

                        {/* Controls Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Role Selector */}
                            <div className="col-span-2">
                                <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 block mb-1.5 ">Role Assignment</label>
                                {loadingActions[user._id] ? (
                                    <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/5 h-[34px]">
                                        <Loader className="w-3 h-3 text-purple-400 animate-spin" />
                                    </div>
                                ) : (
                                    <select
                                        value={user.role}
                                        disabled={user.role === 'admin' || user._id === currentUser?._id}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className={`w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-purple-500/50 ${user.role === 'admin' || user._id === currentUser?._id ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>{role.label}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Toggles */}
                            <div className="bg-white/[0.02] rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5">
                                <span className="text-[7px] font-black uppercase tracking-widest text-gray-600 mb-1">Global Access</span>
                                <ToggleSwitch
                                    enabled={user.status === 'active' && !user.isBanned}
                                    onChange={() => handleToggle(user._id, "isBanned", user.isBanned)}
                                    disabled={user.role === 'admin' || user._id === currentUser?._id || toggleLoading[`${user._id}-isBanned`]}
                                    color={user.status === 'active' && !user.isBanned ? "green" : "red"}
                                    size="sm"
                                />
                            </div>
                            <div className="bg-white/[0.02] rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5">
                                <span className="text-[7px] font-black uppercase tracking-widest text-gray-600 mb-1">Chat Rights</span>
                                <ToggleSwitch
                                    enabled={!user.chatBan}
                                    onChange={() => handleToggle(user._id, "chatBan", user.chatBan)}
                                    disabled={user.role === 'admin' || user._id === currentUser?._id || toggleLoading[`${user._id}-chatBan`]}
                                    color={!user.chatBan ? "blue" : "red"}
                                    size="sm"
                                />
                            </div>
                            <div className="col-span-2 bg-white/[0.02] rounded-lg p-2 flex items-center justify-between border border-white/5 px-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Protocol Entry</span>
                                <ToggleSwitch
                                    enabled={!user.joinBan}
                                    onChange={() => handleToggle(user._id, "joinBan", user.joinBan)}
                                    disabled={user.role === 'admin' || user._id === currentUser?._id || toggleLoading[`${user._id}-joinBan`]}
                                    color={!user.joinBan ? "purple" : "red"}
                                    size="md"
                                />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-8">
                    <StandardEmptyState 
                        title="No Operatives Found" 
                        subtitle="No agents match your filter criteria in the current sector."
                        icon={Users}
                    />
                </div>
            )}
        </div>
      </div>

      {/* Pagination bar compact padding */}
      {pagination && pagination.pages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-6 px-4">
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
            background: linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3));
            border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
