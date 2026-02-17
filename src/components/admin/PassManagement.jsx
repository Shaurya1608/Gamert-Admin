import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Search, Users, Shield, Lock, Trash2, CreditCard, Sparkles, CheckCircle, XCircle, ChevronRight, Activity, Calendar, Filter, Edit2, Save, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import ToggleSwitch from "./ToggleSwitch";

const PassManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [tierFilter, setTierFilter] = useState("all");
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Subscription Config State
  const [subscriptionConfigs, setSubscriptionConfigs] = useState([]);
  const [editingConfig, setEditingConfig] = useState(null);
  const [activeTab, setActiveTab] = useState("configs"); // Default to 'configs' as per screenshot

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/subscribers", { 
        params: { search: searchQuery, tier: tierFilter } 
      });
      if (res.data.success) {
        setSubscribers(res.data.data);
      }
    } catch (err) {
      toast.error("Manifest Access Denied: Subscriptions unreachable");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionConfigs = async () => {
    try {
      const res = await api.get("/admin/subscription-configs");
      if (res.data.success) {
        setSubscriptionConfigs(res.data.configs);
      }
    } catch (err) {
      toast.error("Failed to load subscription configurations");
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchSubscriptionConfigs();
  }, [searchQuery, tierFilter]);

  const initiateUpdateTier = (userId, targetTier) => {
    setConfirmAction({ userId, targetTier });
  };

  const confirmUpdateTier = async () => {
    if (!confirmAction || isUpdating) return;
    const { userId, targetTier } = confirmAction;

    try {
      setIsUpdating(true);
      
      // Optimistic UI update - immediately update the local state
      setSubscribers(prevSubscribers => 
        prevSubscribers.map(sub => 
          sub._id === userId 
            ? { ...sub, subscriptionTier: targetTier, subscriptionExpiry: null }
            : sub
        )
      );
      
      const res = await api.patch(`/admin/users/${userId}/elite-pass`, { tier: targetTier });
      if (res.data.success) {
        toast.success(`Access Protocol Updated`);
        // Fetch fresh data from server to confirm
        await fetchSubscribers();
      }
    } catch (err) {
      toast.error("Authorization Override Failed");
      // Revert optimistic update on error
      await fetchSubscribers();
    } finally {
      setIsUpdating(false);
      setConfirmAction(null);
    }
  };

  const handleUpdateConfig = async (tier) => {
    try {
      const res = await api.put(`/admin/subscription-configs/${tier}`, editingConfig);
      if (res.data.success) {
        toast.success(`${tier.toUpperCase()} configuration updated!`);
        setEditingConfig(null);
        fetchSubscriptionConfigs();
      }
    } catch (err) {
      toast.error("Failed to update configuration");
    }
  };

  const handleEditConfig = (config) => {
    setEditingConfig({ ...config });
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...editingConfig.benefits];
    newBenefits[index] = value;
    setEditingConfig({ ...editingConfig, benefits: newBenefits });
  };

  const addBenefit = () => {
    setEditingConfig({ ...editingConfig, benefits: [...editingConfig.benefits, ""] });
  };

  const removeBenefit = (index) => {
    const newBenefits = editingConfig.benefits.filter((_, i) => i !== index);
    setEditingConfig({ ...editingConfig, benefits: newBenefits });
  };

  const getTierConfig = (tier) => {
    switch (tier) {
      case "premium": return { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "PREMIUM PASS", icon: <CreditCard size={10} />, accent: "from-blue-600 to-cyan-600" };
      case "elite": return { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "ELITE PASS", icon: <Sparkles size={10} />, accent: "from-purple-600 to-pink-600" };
      default: return { color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20", label: "NONE", icon: <XCircle size={10} /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <div className="relative">
            <Loader className="w-12 h-12 text-purple-500 animate-spin" />
            <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse" />
        </div>
        <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Membership Hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white p-6 lg:p-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Subscription <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 text-shadow-glow">Plans</span></h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Manage passes and user tiers</p>
            </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/10">
            {[
              { id: "subscribers", label: "SUBSCRIBERS" },
              { id: "configs", label: "PASS CONFIG" }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                      ? 'bg-white text-black shadow-lg shadow-white/10' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {activeTab === "subscribers" && (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto mb-8">
                <div className="relative flex-1 md:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-purple-500" />
                    <input 
                        type="text"
                        placeholder="SEARCH BY USERNAME..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-[11px] font-bold uppercase tracking-widest focus:border-purple-500/30 focus:bg-white/[0.05] outline-none transition-all shadow-inner placeholder:text-gray-800"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
                    {["all", "premium", "elite"].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTierFilter(t)}
                            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${tierFilter === t ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="bg-[#050505] border border-white/5 rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-500">User</th>
                                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-500">Current Tier</th>
                                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-500">Subscription Details</th>
                                <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {subscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-16 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <Users size={32} className="text-gray-600" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">No subscribers found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    subscribers.map((sub, idx) => {
                                        const config = getTierConfig(sub.subscriptionTier);
                                        return (
                                            <motion.tr 
                                                key={sub._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-black border border-white/10 overflow-hidden">
                                                            <img src={sub.avatar?.url || "/default-avatar.png"} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xs font-black text-white uppercase tracking-tight">@{sub.username}</h3>
                                                            <p className="text-[9px] text-gray-600 font-bold tracking-wider uppercase">{sub.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-2.5 py-1 rounded text-[9px] font-black border flex items-center gap-1.5 w-fit ${config.bg} ${config.color} ${config.border}`}>
                                                        {config.icon}
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                            <Calendar size={10} />
                                                            Joined: {new Date(sub.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                            <Activity size={10} />
                                                            Expires: {sub.subscriptionExpiry ? new Date(sub.subscriptionExpiry).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <button 
                                                        onClick={() => initiateUpdateTier(sub._id, "none")}
                                                        disabled={isUpdating}
                                                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20 rounded-lg transition-all flex items-center gap-2 ml-auto group/btn"
                                                    >
                                                        <Trash2 size={12} className="group-hover/btn:rotate-12 transition-transform" />
                                                        Revoke Pass
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {activeTab === "configs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {subscriptionConfigs.map((config, idx) => {
            const tierConfig = getTierConfig(config.tier);
            const isEditing = editingConfig?.tier === config.tier;
            const displayConfig = isEditing ? editingConfig : config;

            return (
              <motion.div
                key={config.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-[#050505] border ${tierConfig.border} rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all duration-500`}
              >
                {/* Header Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierConfig.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />
                
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${tierConfig.bg} border ${tierConfig.border}`}>
                         {tierConfig.icon}
                      </div>
                      <div>
                        <h3 className={`text-base font-black uppercase tracking-tight ${tierConfig.color}`}>
                          {displayConfig.displayName}
                        </h3>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                          Plan Settings
                        </p>
                      </div>
                    </div>
                    
                    {!isEditing ? (
                      <button
                        onClick={() => handleEditConfig(config)}
                        className="p-2.5 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all group/edit"
                      >
                        <Edit2 size={14} className="text-gray-500 group-hover/edit:text-white transition-colors" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateConfig(config.tier)}
                          className="p-2.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all"
                        >
                          <Save size={14} className="text-green-500" />
                        </button>
                        <button
                          onClick={() => setEditingConfig(null)}
                          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all"
                        >
                          <X size={14} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Stats Row: Price, Multiplier, Missions */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                            <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                            Price (INR)
                            </label>
                            {isEditing ? (
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-[10px]">₹</span>
                                <input
                                    type="number"
                                    value={displayConfig.priceInr}
                                    onChange={(e) => setEditingConfig({ ...editingConfig, priceInr: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-5 pr-2 py-2 text-white text-sm font-black focus:border-purple-500/50 outline-none transition-all"
                                />
                            </div>
                            ) : (
                            <p className="text-xl font-black text-white tracking-tighter">
                                ₹{displayConfig.priceInr}
                            </p>
                            )}
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                            <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                            Multiplier
                            </label>
                            {isEditing ? (
                            <div className="relative">
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-[10px]">x</span>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={displayConfig.xpMultiplier}
                                    onChange={(e) => setEditingConfig({ ...editingConfig, xpMultiplier: parseFloat(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-5 py-2 text-white text-sm font-black focus:border-purple-500/50 outline-none transition-all"
                                />
                            </div>
                            ) : (
                            <p className="text-xl font-black text-white tracking-tighter">
                                {displayConfig.xpMultiplier}x
                            </p>
                            )}
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                            <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-2 block">
                            Missions
                            </label>
                            {isEditing ? (
                            <input
                                type="number"
                                value={displayConfig.missionLimit}
                                onChange={(e) => setEditingConfig({ ...editingConfig, missionLimit: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-black focus:border-purple-500/50 outline-none transition-all"
                            />
                            ) : (
                            <p className="text-xl font-black text-white tracking-tighter">
                                {displayConfig.missionLimit}
                            </p>
                            )}
                        </div>
                    </div>

                    {/* Active Boost Benefit */}
                    <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl px-5 py-4 flex items-center justify-between">
                        <div>
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-purple-400">
                                Daily Reward Boost
                            </h4>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-wider mt-0.5">
                                Gives a daily 1-hour double reward period
                            </p>
                        </div>
                        <ToggleSwitch 
                            enabled={displayConfig.hasActiveBoost}
                            onChange={(val) => setEditingConfig({ ...editingConfig, hasActiveBoost: val })}
                            disabled={!isEditing}
                            color="purple"
                            size="sm"
                        />
                    </div>

                    {/* Benefits List - 2 Column Grid */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-600 mb-4 block flex justify-between items-center">
                            <span>Plan Benefits</span>
                            {isEditing && (
                             <button onClick={addBenefit} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                                <Plus size={10} /> ADD
                             </button>
                            )}
                        </label>
                        <div className={`grid ${isEditing ? 'grid-cols-1' : 'grid-cols-2'} gap-x-6 gap-y-3`}>
                        {displayConfig.benefits.map((benefit, bIdx) => (
                            <div key={bIdx} className="group flex items-center gap-2">
                            {isEditing ? (
                                <>
                                <input
                                    type="text"
                                    value={benefit}
                                    onChange={(e) => handleBenefitChange(bIdx, e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-[10px] font-bold focus:border-purple-500/50 outline-none transition-all"
                                />
                                <button
                                    onClick={() => removeBenefit(bIdx)}
                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                                >
                                    <X size={10} />
                                </button>
                                </>
                            ) : (
                                <div className="flex items-start gap-2 w-full">
                                    <CheckCircle size={12} className={`${tierConfig.color} mt-0.5 shrink-0 opacity-70`} />
                                    <span className="text-[10px] font-bold text-gray-400 leading-tight uppercase tracking-tight">{benefit}</span>
                                </div>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#0B0F1A] border border-white/10 p-8 rounded-[2rem] max-w-sm w-full shadow-2xl relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none" />
                    
                    <div className="mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-4">
                            <Shield size={24} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Confirm Tier Change</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 leading-relaxed">
                            Are you sure you want to change this user's plan to <span className="text-white">{confirmAction.targetTier.toUpperCase()}</span>?
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setConfirmAction(null)}
                            className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmUpdateTier}
                            className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-purple-600/20 transition-all"
                        >
                            {isUpdating ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PassManagement;
