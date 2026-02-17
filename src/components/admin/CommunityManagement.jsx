import React from "react";
import { motion } from "framer-motion";
import { Plus, Users, Trash2 } from "lucide-react";
import { getSafeUserAvatar } from "../../utils/avatarUtils";

const CommunityManagement = ({
  communitiesArr,
  deleteCommunityAdmin,
  setShowCommunityModal
}) => {
  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Communities</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Social Architecture & Protocol Hubs</p>
        </div>
        <button
          onClick={() => setShowCommunityModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:scale-105 transition shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-3.5 h-3.5" /> Initialize Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communitiesArr.map((com) => (
          <div key={com._id} className="p-4 rounded-xl bg-[#080808] border border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 blur-[40px] pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <img 
                  src={getSafeUserAvatar(com)} 
                  alt={com.name} 
                  className="h-14 w-14 rounded-2xl object-cover border border-white/10 shadow-lg" 
              />
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{com.name}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">#{com.slug}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-8 line-clamp-2 h-10 leading-relaxed font-medium">{com.description}</p>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs text-gray-400 font-bold">{com.members?.length || 0} MEMBERS</span>
              </div>
              <button
                onClick={() => deleteCommunityAdmin(com._id)}
                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                title="Delete Community"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityManagement;
