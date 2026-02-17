import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Gamepad2, Upload, Trash2, Edit2, XCircle, AlertCircle } from "lucide-react";
import api from "../../services/api";
import GameModal from "./GameModal";
import toast from "react-hot-toast";

const GamesManagement = ({
  games,
  fetchGames,
  categories,
  pagination,
  setPagination
}) => {
  const [loading, setLoading] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const handleSubmitGame = async (formData) => {
    setLoading(true);
    try {
      console.log("🚀 Submitting game form:", formData);
      
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("categoryId", formData.categoryId);
      data.append("showOnHome", formData.showOnHome);
      data.append("integrationType", formData.integrationType);
      
      if (formData.integrationType === 'remote') {
          console.log("🔗 Appending GameUrl:", formData.gameUrl);
          data.append("gameUrl", formData.gameUrl);
      }
      
      if (formData.gameZip) {
          console.log("📦 Appending GameZip:", formData.gameZip.name);
          data.append("gameZip", formData.gameZip);
      }
      if (formData.imageFile) {
          console.log("📸 Appending Image:", formData.imageFile.name);
          data.append("image", formData.imageFile);
      } else {
          console.log("⚠️ No image file in formData");
      }

      if (editingGame) {
        await api.put(`/admin/games/${editingGame._id}`, data);
        toast.success("Game updated successfully");
      } else {
        await api.post("/admin/games/upload", data);
        toast.success("Game uploaded successfully");
      }
      
      setShowGameModal(false);
      fetchGames();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save game");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game? This will also delete all files.")) return;
    try {
        await api.delete(`/admin/games/${id}`);
        toast.success("Game deleted");
        fetchGames();
    } catch (err) {
        toast.error("Failed to delete game");
    }
  };

  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // For now, we reuse the Modal for drops by setting it to create mode
      setEditingGame(null);
      setShowGameModal(true);
      // Note: Ideally we would pass the dropped file to the modal
    }
  };

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">Game Matrix</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Live Infrastructure & Payload Routing</p>
        </div>
        <div className="px-3 py-1.5 bg-white/5 rounded border border-white/10 text-[10px] text-gray-600 font-black uppercase tracking-widest">
          Nodes: <span className="text-purple-500 ml-1">{games.length}</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 mb-6 transition-all ${
          dragActive ? "border-purple-500 bg-purple-500/10" : "border-white/10 bg-white/5"
        }`}
      >
        <button 
          onClick={() => {
            setEditingGame(null);
            setShowGameModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all text-white"
        >
          <Plus size={16} /> Deploy New Game
        </button>
      </div>

      {/* Games Grid */}
      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Gamepad2 className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400 font-medium">No games found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col p-4 rounded-xl bg-[#080808] border border-white/5 hover:border-purple-500/20 hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[50px] pointer-events-none group-hover:bg-purple-600/20 transition-colors" />

              <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10 mb-4 group/img">
                {game.image ? (
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gamepad2 className="text-white/10" size={40} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                        onClick={() => {
                            setEditingGame(game);
                            setShowGameModal(true);
                        }}
                        className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:bg-purple-600 transition-all text-white"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                        onClick={() => handleDeleteGame(game._id)}
                        className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:bg-red-600 transition-all text-white"
                    >
                      <Trash2 size={12} />
                    </button>
                </div>
              </div>

              <div className="flex items-start justify-between mb-4 z-10">
                <div className="flex flex-col">
                  <h3 className="font-black text-sm text-white uppercase tracking-tight line-clamp-1">{game.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {game.categoryName || "Uncategorized"}
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${
                  game.showOnHome 
                  ? "bg-green-500/10 text-green-400 border-green-500/20" 
                  : "bg-gray-800 text-gray-500 border-gray-700"
                }`}>
                  {game.showOnHome ? "Live" : "Dev"}
                </div>
              </div>

              <div className="mt-auto pt-3 border-t border-white/5 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Global Route</span>
                  <div className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${game.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {game.isActive ? 'Active' : 'Offline'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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

      {/* Primary Game Modal (Logic shared for New/Edit) */}
      <GameModal 
        showGameModal={showGameModal}
        setShowGameModal={setShowGameModal}
        categories={categories}
        submitGame={handleSubmitGame}
        loading={loading}
        editingGame={editingGame}
      />
    </div>
  );
};

export default GamesManagement;
