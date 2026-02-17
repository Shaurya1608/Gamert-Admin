import React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Shield, User, Users } from "lucide-react";
import { getAvatarUrl } from "../../utils/avatarUtils";
import StandardEmptyState from "../common/StandardEmptyState";

const RecentUsersTable = ({ users = [] }) => {
  return (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div>
           <h3 className="text-lg font-bold text-white mb-0.5">Recent Operatives</h3>
           <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Latest Network Joins</p>
        </div>
        <button className="text-[10px] font-black text-purple-500 hover:text-purple-400 uppercase tracking-widest transition-colors">View All</button>
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left">
              <thead className="bg-white/[0.02]">
                  <tr>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Agent</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                      <th className="px-6 py-4 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.length > 0 ? (
                    users.map((user, i) => (
                        <motion.tr 
                            key={user._id || i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="hover:bg-white/[0.02] transition-colors group"
                        >
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={user.avatar?.url || getAvatarUrl(user.username)} 
                                        className="w-8 h-8 rounded-lg object-cover bg-white/5" 
                                        alt=""
                                    />
                                    <div>
                                        <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">{user.username}</p>
                                        <p className="text-[9px] text-gray-600 font-mono">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                                    user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                    user.role === 'moderator' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 
                                    'bg-gray-500/10 text-gray-500 border border-white/5'
                                }`}>
                                    {user.role === 'admin' && <Shield size={10} />}
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                     <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                     <span className="text-[9px] font-bold text-gray-500 uppercase">Active</span>
                                </div>
                            </td>
                        </motion.tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="px-6 py-12">
                            <StandardEmptyState 
                                title="No New Recruits" 
                                subtitle="Network recruitment is stable, but no new operatives have registered in this window."
                                icon={Users}
                            />
                        </td>
                    </tr>
                )}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default RecentUsersTable;
