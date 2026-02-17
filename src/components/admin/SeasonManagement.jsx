import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Trophy, Star, Gem, Coins } from "lucide-react";

const SeasonManagement = ({ rewards, loading, onEdit, onDelete, setShowModal, setEditingSeasonReward, setSeasonForm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Season Hub</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol Specification for Rewards Extraction</p>
        </div>
        <button
          onClick={() => {
            setEditingSeasonReward(null);
            setSeasonForm({
                level: 1,
                free: { diamonds: 0, gtc: 0 },
                elite: { diamonds: 0, gtc: 0 },
                isMilestone: false
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          <Plus size={16} /> Initialize Tier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.sort((a, b) => a.level - b.level).map((reward) => (
          <div
            key={reward._id}
            className={`group bg-white/[0.03] border ${reward.isMilestone ? 'border-amber-500/30' : 'border-white/10'} rounded-3xl p-6 relative overflow-hidden transition-all hover:border-red-600/30`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${reward.isMilestone ? 'bg-amber-500/10' : 'bg-red-600/10'} border border-white/10 shadow-inner`}>
                  {reward.isMilestone ? (
                    <Star size={24} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  ) : (
                    <Trophy size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(reward)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(reward._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Authorization Layer</p>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Level {reward.level}</h3>
                {reward.isMilestone && (
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest mt-1 block">Milestone Reached</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-3">Standard Protocol</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gem size={10} className="text-cyan-400" />
                      <span className="text-xs font-bold text-white tracking-tighter">{reward.free?.diamonds || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins size={10} className="text-amber-400" />
                      <span className="text-xs font-bold text-white tracking-tighter">{reward.free?.gtc || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-3">Elite Tier</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gem size={10} className="text-cyan-400" />
                      <span className="text-xs font-bold text-amber-500 tracking-tighter">{reward.elite?.diamonds || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins size={10} className="text-amber-400" />
                      <span className="text-xs font-bold text-amber-500 tracking-tighter">{reward.elite?.gtc || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${reward.isMilestone ? 'bg-amber-500/5' : 'bg-red-600/5'} blur-[60px] rounded-full -mr-16 -mt-16 group-hover:opacity-100 opacity-20 transition-opacity`} />
          </div>
        ))}
        {rewards.length === 0 && !loading && (
          <div className="col-span-full py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
            <Trophy size={48} className="text-gray-700 mb-4 opacity-20" />
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">No rewards initialized in the system</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SeasonManagement;
