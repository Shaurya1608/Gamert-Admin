import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Server, AlertCircle, Trash2, Lock, Activity, Save, ToggleLeft, ToggleRight, Edit2, LifeBuoy, Loader2, RefreshCw, Database, AlertTriangle, ShieldCheck } from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import CachePurgeModal from "./CachePurgeModal";
import SystemSettingsTab from "./SystemSettingsTab";

const SettingsManagement = () => {
  const [config, setConfig] = useState({
    isActive: true,
    version: "",
    message: "",
    details: []
  });
  const [initialConfig, setInitialConfig] = useState(null);
  const [supportConfig, setSupportConfig] = useState({
    bugLink: "https://discord.gg/gamerthred",
    helplineEmail: "support@gamerthred.com",
    communityLink: "https://discord.gg/gamerthred",
    faqLink: "#"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSupport, setSavingSupport] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [showCacheModal, setShowCacheModal] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
        const [betaRes, supportRes] = await Promise.all([
            api.get("/api/system/settings/beta_banner_config"),
            api.get("/api/system/settings/platform_support_config")
        ]);
        
        if (betaRes.data.success && betaRes.data.value) {
            setConfig(betaRes.data.value);
            setInitialConfig(betaRes.data.value);
        }
        if (supportRes.data.success && supportRes.data.value) {
            setSupportConfig(supportRes.data.value);
        }
    } catch (err) {
        console.error("Failed to load settings", err);
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
        setSaving(true);
        await api.put("/admin/settings/beta_banner_config", {
            value: config,
            description: "Global Beta Banner Configuration"
        });
        toast.success("Beta settings updated successfully");
    } catch (err) {
        toast.error("Failed to update settings");
    } finally {
        setSaving(false);
    }
  };

  const handleSaveSupport = async () => {
    try {
        setSavingSupport(true);
        await api.put("/admin/settings/platform_support_config", {
            value: supportConfig,
            description: "Platform Support & Contact Configuration"
        });
        toast.success("Support settings updated successfully");
    } catch (err) {
        toast.error("Failed to update support settings");
    } finally {
        setSavingSupport(false);
    }
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...config.details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setConfig({ ...config, details: newDetails });
  };

  const addDetail = () => {
    setConfig({
      ...config,
      details: [...config.details, { type: "info", title: "", content: "" }]
    });
  };

  const removeDetail = (index) => {
    setConfig({
      ...config,
      details: config.details.filter((_, i) => i !== index)
    });
  };

  const hasUnsavedChanges = initialConfig && JSON.stringify(config) !== JSON.stringify(initialConfig);

  const handleClearCache = async (scopes) => {
    try {
        setClearing(true);
        const res = await api.post("/admin/system/clear-cache", { scopes });
        if (res.data.success) {
            toast.success(res.data.message);
            setShowCacheModal(false);
        }
    } catch (err) {
        toast.error("Cache purge protocol failed");
    } finally {
        setClearing(false);
    }
  };

  const handleBackupDB = async () => {
    try {
        setBackingUp(true);
        const response = await api.get("/admin/system/backup", { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `GamerThred_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Database Backup Initialized");
    } catch (err) {
        toast.error("Backup transmission failed");
    } finally {
        setBackingUp(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">System Settings</h2>
            <p className="text-xs sm:text-sm text-gray-400">Monitor system health and perform maintenance tasks.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ticket & Economy Settings */}
        <SystemSettingsTab />

        {/* Cache Management */}
        <div className="bg-black/40 rounded-2xl border border-white/5 p-6 h-fit">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-400" /> Cache Management
            </h3>
            <div className="space-y-4">
                <button 
                    onClick={() => setShowCacheModal(true)}
                    className="w-full py-3 rounded-xl bg-orange-600 text-white font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
                    disabled={clearing}
                >
                    {clearing ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 size={16} />}
                    {clearing ? "Purging Cache..." : "Purge Cache"}
                </button>
            </div>
        </div>
        
        {/* Beta Banner Configuration */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="col-span-1 rounded-[2rem] sm:rounded-3xl bg-[#0a0a0a] border border-white/10 p-4 sm:p-6 shadow-xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <AlertTriangle size={100} className="text-amber-500" />
            </div>

            {/* Header - Responsive Stack */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 relative z-10">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> 
                    Beta Banner Configuration
                </h3>
                <div className="flex items-center gap-2 sm:gap-3">
                    {hasUnsavedChanges && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[9px] sm:text-[10px] font-black text-amber-400 uppercase tracking-wider">Unsaved</span>
                        </motion.div>
                    )}
                    <button 
                        onClick={() => setConfig({ ...config, isActive: !config.isActive })}
                        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border transition-all touch-manipulation ${
                            config.isActive 
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-500" 
                            : "bg-gray-800 border-gray-700 text-gray-400"
                        }`}
                    >
                        {config.isActive ? <ToggleRight size={18} className="sm:w-5 sm:h-5" /> : <ToggleLeft size={18} className="sm:w-5 sm:h-5" />}
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                            {config.isActive ? "Active" : "Disabled"}
                        </span>
                    </button>
                </div>
            </div>

            <div className="space-y-5 sm:space-y-6 relative z-10">
                {/* Version & Message - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Version String</label>
                        <input 
                            type="text" 
                            value={config.version}
                            onChange={(e) => setConfig({ ...config, version: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            placeholder="e.g. v0.9.2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Banner Message</label>
                        <input 
                            type="text" 
                            value={config.message}
                            onChange={(e) => setConfig({ ...config, message: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            placeholder="e.g. Core functionality testing"
                        />
                    </div>
                </div>

                {/* Detail Columns - Enhanced Mobile Layout */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">Detail Columns</label>
                        <button
                            onClick={addDetail}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all text-[10px] font-black uppercase tracking-wider"
                        >
                            <span className="text-sm">+</span>
                            <span className="hidden sm:inline">Add Detail</span>
                        </button>
                    </div>
                    <div className="space-y-3">
                        {config.details?.map((detail, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 sm:p-4 bg-white/5 rounded-xl border border-white/5 space-y-2.5 sm:space-y-3 hover:bg-white/[0.07] transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <select 
                                        value={detail.type}
                                        onChange={(e) => handleDetailChange(index, "type", e.target.value)}
                                        className="w-full sm:w-auto bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-500/50 transition-colors"
                                    >
                                        <option value="performance">⚡ Performance</option>
                                        <option value="security">🛡️ Security</option>
                                        <option value="bug">🐛 Bug</option>
                                        <option value="info">ℹ️ Info</option>
                                    </select>
                                    <input 
                                        type="text"
                                        value={detail.title}
                                        onChange={(e) => handleDetailChange(index, "title", e.target.value)}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                                        placeholder="Title"
                                    />
                                    <button
                                        onClick={() => removeDetail(index)}
                                        className="w-full sm:w-auto px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-xs font-bold uppercase tracking-wider"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <textarea 
                                    value={detail.content}
                                    onChange={(e) => handleDetailChange(index, "content", e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-400 focus:outline-none focus:border-amber-500/50 resize-none h-16 sm:h-20 transition-colors"
                                    placeholder="Content description..."
                                />
                            </motion.div>
                        ))}
                        {config.details?.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-xs">
                                No details added yet. Click "Add Detail" to create one.
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button - Enhanced with Sticky on Mobile */}
                <div className="sticky bottom-0 left-0 right-0 pt-4 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 sm:pb-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent sm:static sm:mx-0 sm:px-0 sm:bg-none">
                    <button 
                        onClick={handleSave}
                        disabled={saving || !hasUnsavedChanges}
                        className="w-full py-3 sm:py-3.5 rounded-xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg sm:shadow-none touch-manipulation"
                    >
                        {saving ? <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" /> : <Save size={16} />}
                        {saving ? "Saving Changes..." : hasUnsavedChanges ? "Update Configuration" : "No Changes"}
                    </button>
                </div>
            </div>
        </motion.div>

        {/* Platform Support Configuration */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="col-span-1 rounded-[2rem] sm:rounded-3xl bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 shadow-xl relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold flex items-center gap-2 text-blue-400">
                    <LifeBuoy className="w-5 h-5" /> 
                    Platform Support Control
                </h3>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bug Report Discord Link</label>
                        <input 
                            type="text" 
                            value={supportConfig.bugLink}
                            onChange={(e) => setSupportConfig({ ...supportConfig, bugLink: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Helpline Email</label>
                        <input 
                            type="text" 
                            value={supportConfig.helplineEmail}
                            onChange={(e) => setSupportConfig({ ...supportConfig, helplineEmail: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Community Discord Invite</label>
                        <input 
                            type="text" 
                            value={supportConfig.communityLink}
                            onChange={(e) => setSupportConfig({ ...supportConfig, communityLink: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Knowledge Base / FAQ URL</label>
                        <input 
                            type="text" 
                            value={supportConfig.faqLink}
                            onChange={(e) => setSupportConfig({ ...supportConfig, faqLink: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleSaveSupport}
                    disabled={savingSupport}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 "
                >
                    {savingSupport ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Save size={16} />}
                    {savingSupport ? "Securing Encrypted Data..." : "Broadcast Support Protocol"}
                </button>
            </div>
        </motion.div>

        {/* System Health */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="col-span-1 rounded-[2rem] sm:rounded-3xl bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 shadow-xl"
            >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" /> System Health
            </h3>
            <div className="space-y-4">
                {[
                { name: "Database", status: "Healthy", icon: "dw", color: "text-green-400", bg: "bg-green-500/10" },
                { name: "Redis Cache", status: "Running", icon: "⚡", color: "text-blue-400", bg: "bg-blue-500/10" },
                { name: "Email Service", status: "Operational", icon: "@", color: "text-purple-400", bg: "bg-purple-500/10" },
                ].map((item) => (
                <div
                    key={item.name}
                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5"
                >
                    <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${item.bg} ${item.color}`}>
                        {item.icon}
                    </div>
                    <span className="font-medium text-gray-300 text-sm">{item.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${item.bg} ${item.color}`}>
                    {item.status}
                    </span>
                </div>
                ))}
            </div>
        </motion.div>

        {/* Maintenance */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          className="col-span-1 rounded-[2rem] sm:rounded-3xl bg-[#0a0a0a] border border-white/10 p-5 sm:p-6 shadow-xl"
            >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Maintenance
            </h3>
            <div className="space-y-3">
                <button 
                  onClick={() => setShowCacheModal(true)}
                  disabled={clearing}
                  className="w-full p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 transition flex items-center justify-between group text-sm disabled:opacity-50"
                >
                <span className="font-semibold">{clearing ? "Purging..." : "Clear Cache"}</span>
                {clearing ? <Activity size={14} className="animate-spin" /> : <Trash2 size={14} className="group-hover:text-yellow-300" />}
                </button>
                <button 
                  onClick={handleBackupDB}
                  disabled={backingUp}
                  className="w-full p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-orange-400 hover:bg-orange-500/10 transition flex items-center justify-between group text-sm disabled:opacity-50"
                >
                <span className="font-semibold">{backingUp ? "Extracting..." : "Backup DB"}</span>
                {backingUp ? <Activity size={14} className="animate-spin" /> : <Server size={14} className="group-hover:text-orange-300" />}
                </button>
            </div>
        </motion.div>

      </div>

      <CachePurgeModal 
        isOpen={showCacheModal}
        onClose={() => setShowCacheModal(false)}
        onConfirm={handleClearCache}
        loading={clearing}
      />
    </div>
  );
};

export default SettingsManagement;
