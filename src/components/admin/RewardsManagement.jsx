import React from "react";
import { motion } from "framer-motion";
import { Loader, Plus, Trash2 } from "lucide-react";

const RewardsManagement = ({
  loadingRewards,
  rewards,
  setEditingReward,
  setRewardForm,
  setShowRewardModal,
  handleToggleReward,
  handleDeleteReward,
  pagination,
  setPagination
}) => {
  if (loadingRewards) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rewards Management</h2>
        <button
          onClick={() => {
            setEditingReward(null);
            setRewardForm({ title: "", description: "", priceDiamonds: "", stock: "", category: "Daily", isActive: true });
            setShowRewardModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
        >
          <Plus className="w-4 h-4" /> Create Reward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rewards.map((reward) => (
          <div key={reward._id} className="bg-purple-900/10 border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition flex flex-col">
            <img src={reward.imageUrl} alt={reward.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{reward.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${reward.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {reward.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{reward.description}</p>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                <span className="text-cyan-400">💎 {reward.priceDiamonds} Gtc</span>
                <span>📦 {reward.stock} left</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingReward(reward);
                    setRewardForm({
                        title: reward.title,
                        description: reward.description || "",
                        priceDiamonds: reward.priceDiamonds || "",
                        stock: reward.stock,
                        category: reward.category,
                        isActive: reward.isActive
                    });
                    setShowRewardModal(true);
                  }}
                  className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm font-medium"
                >
                  Edit
                </button>
                 <button
                  onClick={() => handleToggleReward(reward._id)}
                  className={`flex-1 py-2 rounded-lg transition text-sm font-medium ${reward.isActive ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                >
                  {reward.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDeleteReward(reward._id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from(
            { length: pagination.pages },
            (_, i) => i + 1,
          ).map((page) => (
            <button
              key={page}
              onClick={() => setPagination({ ...pagination, page })}
              className={`w-10 h-10 rounded-xl transition font-bold text-xs ${
                pagination.page === page
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                  : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsManagement;
