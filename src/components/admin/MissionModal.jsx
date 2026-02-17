import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, Loader, Edit2, Plus, Gamepad2, Flag, Flame, 
    Clock, Trophy, Minus, Plus as PlusIcon, Calendar, Check, Crop, ChevronDown, Gem, Activity, Ticket
} from "lucide-react";
import ImageCropper from "../common/ImageCropper";
import { dataURLtoFile } from "../../utils/imageUtils";

// --- Internal Helper Components ---
// Removed inline helpers in favor of reusable utils

const NumericStepper = ({ label, value, onChange, name, min = 0, step = 1, icon: Icon, colorClass = "text-purple-400" }) => {
    const handleIncrement = () => onChange({ target: { name, value: Number(value || 0) + step } });
    const handleDecrement = () => onChange({ target: { name, value: Math.max(min, Number(value || 0) - step) } });

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 space-y-1 hover:border-white/10 transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" style={{ color: 'currentColor' }} />
            <label className={`text-[6px] font-black ${colorClass} uppercase tracking-[0.2em] block ml-1 opacity-70 group-hover:opacity-100 transition-opacity`}>{label}</label>
            <div className="flex items-center justify-between gap-2 relative z-10 px-0.5">
                <div className="flex items-center gap-1">
                    {Icon && <Icon size={12} className="text-gray-600 group-hover:text-inherit transition-colors" />}
                    <input
                        type="number"
                        name={name}
                        value={value}
                        onChange={onChange}
                        className="bg-transparent border-none text-base font-black text-white w-14 outline-none italic scrollbar-hide"
                    />
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        type="button"
                        onClick={handleDecrement}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all active:scale-90 border border-white/5"
                    >
                        <Minus size={12} />
                    </button>
                    <button 
                        type="button"
                        onClick={handleIncrement}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all active:scale-90 border border-white/5"
                    >
                        <PlusIcon size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- End Internal Helper Components ---

const MissionModal = ({
  showCreateMission,
  setShowCreateMission,
  editingMission,
  setEditingMission,
  missionForm,
  setMissionForm,
  handleMissionChange,
  games,
  submitMission,
  creatingMission
}) => {
  const [cropImage, setCropImage] = useState(null);
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setCropImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedImageDataUrl) => {
    try {
        const croppedFile = dataURLtoFile(croppedImageDataUrl, 'mission-intel.jpg');
        
        setMissionForm(prev => ({
            ...prev,
            imagePreview: croppedImageDataUrl,
            imageFile: croppedFile
        }));
        setCropImage(null);
    } catch (e) {
        console.error("Error cropping image:", e);
    }
  };

  const submitMissionWithValidation = () => {
    if (!missionForm.startsAt || !missionForm.expiresAt) {
        toast.error("Please define the temporal window (Launch & Expiry)");
        return;
    }

    const start = new Date(missionForm.startsAt);
    const end = new Date(missionForm.expiresAt);

    if (end <= start) {
        toast.error("Mission error: Expiry date must be after Launch date");
        return;
    }

    submitMission();
  };

  return (
    <AnimatePresence>
      {showCreateMission && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCreateMission(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-[1.5rem] lg:rounded-[2.5rem] bg-[#050505] border border-white/10 p-1 shadow-2xl relative flex flex-col lg:flex-row h-[95vh] lg:h-[85vh] lg:max-h-[850px] overflow-y-auto lg:overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 blur-[120px] pointer-events-none" />

            {/* Global Close Button (Pinned to Top Right) */}
            <button
                onClick={() => {
                    setShowCreateMission(false);
                    setEditingMission(null);
                    setMissionForm({
                        title: "",
                        gameId: "",
                        minScore: "",
                        rewardGtc: "",
                        entryFeeTickets: 0,
                        maxAttempts: 5,
                        startsAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
                        expiresAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 72 * 60 * 60 * 1000).toISOString().slice(0, 16),
                        image: "",
                        imageFile: null,
                        imagePreview: null,
                        isTrending: false,
                        missionType: "regular",
                        difficulty: "medium",
                        category: "general",
                        minTime: 0,
                        rewardLoyalty: 0,
                        aspect: "landscape"
                    });
                }}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 z-[120] p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-xl hover:bg-white/10 border border-white/5"
            >
                <X size={20} />
            </button>
            
            {/* Sidebar / Image Section */}
            <div className="w-full lg:w-[32%] bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/5 p-3 lg:p-6 flex flex-col items-center justify-start relative z-10">
                <div className="text-center mb-2 lg:mb-8 w-full">
                    <div className="inline-flex items-center gap-2 mb-1 lg:mb-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[7px] font-black text-purple-400 uppercase tracking-[0.3em]">Operational Config</span>
                    </div>
                    <h2 className="text-lg lg:text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                        {editingMission ? "Re-sync" : "Establish"} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Mission</span>
                    </h2>
                </div>

                {/* Cyber Image Upload (Ultra-Wide Cinematic) */}
                <div 
                    className={`relative w-full rounded-3xl overflow-hidden bg-black/40 border border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:border-purple-500/40 transition-all shadow-2xl group ${
                        missionForm.aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-video'
                    }`}
                >
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Scanning Animation Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-scan-line" />
                    </div>

                    {missionForm.imagePreview || missionForm.image ? (
                        <div className="relative w-full h-full">
                            <img 
                                src={missionForm.imagePreview || missionForm.image} 
                                alt="Mission Preview" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                        </div>
                    ) : (
                        <div className="text-gray-600 flex flex-col items-center transition-all group-hover:text-purple-400 group-hover:scale-110">
                            <Plus size={28} strokeWidth={3} className="mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Upload Intel</span>
                            <p className="text-[7px] mt-1 text-gray-700 font-bold uppercase tracking-widest">
                                {missionForm.aspect === 'portrait' ? '3:4 Portrait' : '16:9 Landscape'}
                            </p>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        onClick={(e) => { e.target.value = null; }}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                        <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                             <div className="p-3 rounded-2xl bg-black/60 border border-white/10 shadow-2xl text-white hover:bg-purple-600 transition-colors pointer-events-none">
                                <Edit2 size={20}/>
                             </div>
                             {(missionForm.imagePreview || missionForm.image) && (
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCropImage(missionForm.imagePreview || missionForm.image);
                                    }}
                                    className="p-3 rounded-2xl bg-black/60 border border-white/10 shadow-2xl text-white hover:bg-purple-600 transition-colors z-30"
                                >
                                    <Crop size={20}/>
                                </button>
                             )}
                        </div>
                    </div>
                </div>
                <div className="mt-2 lg:mt-6 space-y-2 lg:space-y-3 w-full">
                    <div className="flex items-center gap-3 p-2 lg:p-2.5 rounded-xl bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.05]">
                        <div className={`p-2 rounded-xl transition-colors ${missionForm.isTrending ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-gray-800 text-gray-500'}`}>
                            <Flame size={18} fill={missionForm.isTrending ? "currentColor" : "none"} />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-[9px] text-white uppercase tracking-wider">Trending</p>
                            <p className="text-[7px] text-gray-500 font-bold uppercase tracking-tight">Home Featured</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer scale-[0.8]">
                            <input 
                                type="checkbox" 
                                name="isTrending"
                                checked={missionForm.isTrending} 
                                onChange={(e) => setMissionForm(prev => ({ ...prev, isTrending: e.target.checked }))}
                                className="sr-only peer" 
                            />
                            <div className="w-10 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>

                    <div className="p-2.5 lg:p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Flag size={8} className="text-blue-400" />
                             </div>
                             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Deployment Model</span>
                         </div>
                         <div className="relative">
                             <button
                                 type="button"
                                 onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                 className="w-full bg-black/60 border border-white/5 rounded-xl px-3 py-2 text-[9px] font-black text-white outline-none focus:border-purple-500/40 transition-all flex items-center justify-between group uppercase italic"
                             >
                                 <span>
                                     {missionForm.missionType === 'regular' ? 'Regular Link' : 
                                      missionForm.missionType === 'special' ? 'Special Protocol' : 
                                      missionForm.missionType === 'daily' ? 'Daily Vector' : 'Squad Protocol'}
                                 </span>
                                 <ChevronDown className={`w-2.5 h-2.5 text-purple-400 transition-transform duration-500 ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                             </button>
                             <AnimatePresence mode="wait">
                                 {isTypeDropdownOpen && (
                                     <motion.div
                                         initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                         animate={{ opacity: 1, y: 0, scale: 1 }}
                                         exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                         style={{ zIndex: 110 }}
                                         onWheel={(e) => e.stopPropagation()}
                                         className="absolute top-full left-0 right-0 mt-2 origin-top"
                                     >
                                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl p-1">
                                             {['regular', 'special'].map((type) => (
                                                 <button
                                                     key={type}
                                                     type="button"
                                                     onClick={() => {
                                                         handleMissionChange({ target: { name: 'missionType', value: type } });
                                                         setIsTypeDropdownOpen(false);
                                                     }}
                                                     className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-between
                                                         ${missionForm.missionType === type ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                                 >
                                                     {type === 'regular' ? 'Regular Mission' : 'Special Mission'}
                                                     {missionForm.missionType === type && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                                                 </button>
                                             ))}
                                        </div>
                                     </motion.div>
                                 )}
                             </AnimatePresence>
                         </div>
                    </div>

                    <div className="p-2.5 lg:p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-4 h-4 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                <Crop size={8} className="text-cyan-400" />
                             </div>
                             <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Frame Aspect</span>
                         </div>
                         <div className="flex gap-2">
                             {[
                                { id: 'landscape', label: '16:9', ratio: 16/9 },
                                { id: 'portrait', label: '3:4', ratio: 3/4 }
                             ].map((opt) => (
                                 <button
                                     key={opt.id}
                                     type="button"
                                     onClick={() => setMissionForm(prev => ({ ...prev, aspect: opt.id }))}
                                     className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border 
                                         ${missionForm.aspect === opt.id 
                                             ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                                             : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'}`}
                                 >
                                     {opt.label}
                                 </button>
                             ))}
                         </div>
                    </div>
                </div>
            </div>

            {/* Main Form Section */}
            <div className="flex-1 flex flex-col h-full lg:overflow-hidden relative z-10">
                {/* Header with Close Button placeholder */}
                <div className="hidden lg:flex items-center justify-between px-6 py-4 lg:px-8 lg:pt-6">
                    <div className="flex-1" />
                    <div className="w-10 h-10" /> {/* Space for the absolute button */}
                </div>

                {/* Scrollable Form Area */}
                <div 
                    className="flex-1 lg:overflow-y-auto px-4 md:px-10 pb-20 lg:pb-6 custom-scrollbar space-y-6 overscroll-contain"
                    onWheel={(e) => e.stopPropagation()}
                >
                    {/* Basic Info Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-0.5 w-8 bg-purple-500 rounded-full" />
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Strategic Data</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] uppercase tracking-widest font-black text-gray-500 ml-1">Mission Title</label>
                                <input
                                    name="title"
                                    value={missionForm.title}
                                    onChange={handleMissionChange}
                                    placeholder="DESIGNATE MISSION..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-xs font-black italic text-white placeholder:text-gray-700 outline-none focus:border-purple-500/40 transition-all uppercase tracking-tight"
                                />
                            </div>
                            {missionForm.missionType !== 'weekend' && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Target Protocol (Game)</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-sm font-black italic text-white outline-none focus:border-purple-500/40 transition-all uppercase tracking-tight flex items-center justify-between group"
                                    >
                                        <span className={!missionForm.gameId ? "text-gray-500" : ""}>
                                            {missionForm.gameId ? games.find(g => g._id === missionForm.gameId)?.title : "-- SELECT PROTOCOL --"}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${isGameDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                     <AnimatePresence mode="wait">
                                         {isGameDropdownOpen && (
                                             <motion.div
                                                 initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                                 exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                                 style={{ zIndex: 110 }}
                                                 onWheel={(e) => e.stopPropagation()}
                                                 className="absolute top-full left-0 right-0 mt-2 origin-top"
                                             >
                                                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">
                                                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                                        {games.map((game) => (
                                                            <button
                                                                key={game._id}
                                                                type="button"
                                                                onClick={() => {
                                                                    handleMissionChange({ target: { name: 'gameId', value: game._id } });
                                                                    setIsGameDropdownOpen(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between
                                                                    ${missionForm.gameId === game._id 
                                                                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20' 
                                                                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                                                            >
                                                                {game.title}
                                                                {missionForm.gameId === game._id && <Gamepad2 size={14} />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Difficulty & Category Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Difficulty Tier</label>
                                <div className="flex gap-2">
                                    {['easy', 'medium', 'hard'].map((diff) => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => handleMissionChange({ target: { name: 'difficulty', value: diff } })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border 
                                                ${missionForm.difficulty === diff 
                                                    ? diff === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                                                      diff === 'medium' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 
                                                      'bg-red-500/20 text-red-400 border-red-500/30'
                                                    : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/10'}`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Strategic Category</label>
                                <input
                                    name="category"
                                    value={missionForm.category}
                                    onChange={handleMissionChange}
                                    placeholder="e.g. Combat, Speed..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-black italic text-white placeholder:text-gray-700 outline-none focus:border-purple-500/40 transition-all uppercase tracking-tight"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs Group */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-0.5 w-8 bg-blue-500 rounded-full" />
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Tactical Specs</span>
                        </div>

                        {missionForm.missionType === 'weekend' ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <NumericStepper 
                                    label="Squad Goal"
                                    name="targetMissions"
                                    value={missionForm.targetMissions}
                                    onChange={handleMissionChange}
                                    icon={Trophy}
                                    colorClass="text-yellow-400"
                                    step={5}
                                />
                                <NumericStepper 
                                    label="Guaranteed Reward"
                                    name="baseGems"
                                    value={missionForm.baseGems}
                                    onChange={handleMissionChange}
                                    icon={Gem}
                                    colorClass="text-blue-400"
                                    step={5}
                                />
                                <NumericStepper 
                                    label="Bonus Per Game"
                                    name="perMissionGems"
                                    value={missionForm.perMissionGems}
                                    onChange={handleMissionChange}
                                    icon={Gem}
                                    colorClass="text-purple-400"
                                />
                                <NumericStepper 
                                    label="Max Personal Limit"
                                    name="capGems"
                                    value={missionForm.capGems}
                                    onChange={handleMissionChange}
                                    icon={Trophy}
                                    colorClass="text-red-400"
                                    step={5}
                                />
                             </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <NumericStepper 
                                    label="Min Score"
                                    name="minScore"
                                    value={missionForm.minScore}
                                    onChange={handleMissionChange}
                                    icon={Trophy}
                                    colorClass="text-blue-400"
                                />
                                <NumericStepper 
                                    label="Min Time (min)"
                                    name="minTime"
                                    value={missionForm.minTime ? (missionForm.minTime / 60).toFixed(1) : 0}
                                    onChange={(e) => {
                                        const mins = parseFloat(e.target.value) || 0;
                                        handleMissionChange({
                                            target: {
                                                name: 'minTime',
                                                value: Math.round(mins * 60)
                                            }
                                        });
                                    }}
                                    icon={Clock}
                                    colorClass="text-purple-400"
                                    step={0.5}
                                />
                                <NumericStepper 
                                    label="GTC Reward"
                                    name="rewardGtc"
                                    value={missionForm.rewardGtc}
                                    onChange={handleMissionChange}
                                    icon={Trophy}
                                    colorClass="text-yellow-400"
                                />
                                {missionForm.missionType === 'special' && (
                                    <NumericStepper 
                                        label="Loyalty Credits"
                                        name="rewardLoyalty"
                                        value={missionForm.rewardLoyalty}
                                        onChange={handleMissionChange}
                                        icon={Gem}
                                        colorClass="text-emerald-400"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Operational Details */}
                    <div className="grid grid-cols-1 gap-8">
                        {missionForm.missionType !== 'weekend' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Activity size={10} className="text-pink-400" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Deployment Costs</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <NumericStepper 
                                    label="Entry Fee (Tickets)"
                                    name="entryFeeTickets"
                                    value={missionForm.entryFeeTickets}
                                    onChange={handleMissionChange}
                                    colorClass="text-pink-400"
                                    icon={Ticket}
                                />
                                <NumericStepper 
                                    label="Max Attempts"
                                    name="maxAttempts"
                                    value={missionForm.maxAttempts}
                                    onChange={handleMissionChange}
                                    colorClass="text-blue-400"
                                />
                            </div>
                        </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Activity size={12} className="text-cyan-400" />
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Temporal Window</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group space-y-2 relative">
                                    <label className="text-[7px] font-black text-gray-600 uppercase tracking-widest ml-1">Launch Sequence</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            name="startsAt"
                                            value={missionForm.startsAt}
                                            onChange={handleMissionChange}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-black text-white outline-none focus:border-cyan-500/40 transition-all custom-datetime-input appearance-none italic tracking-tight"
                                        />
                                    </div>
                                </div>
                                <div className="group space-y-2 relative">
                                    <label className="text-[7px] font-black text-gray-600 uppercase tracking-widest ml-1">Expiry Overload</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            name="expiresAt"
                                            value={missionForm.expiresAt}
                                            onChange={handleMissionChange}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-[11px] font-black text-white outline-none focus:border-pink-500/40 transition-all custom-datetime-input appearance-none italic tracking-tight"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer Actions */}
                <div className="px-6 py-4 lg:px-8 lg:pb-8 border-t border-white/5 bg-[#050505] backdrop-blur-md flex flex-col sm:flex-row gap-4 relative z-20">
                   <button
                        onClick={() => {
                            setShowCreateMission(false);
                            setEditingMission(null);
                            setMissionForm({
                                title: "",
                                gameId: "",
                                minScore: "",
                                rewardGtc: "",
                                entryFeeTickets: 0,
                                maxAttempts: 5,
                                startsAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
                                expiresAt: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 72 * 60 * 60 * 1000).toISOString().slice(0, 16),
                                image: "",
                                imageFile: null,
                                imagePreview: null,
                                isTrending: false,
                                difficulty: "medium",
                                category: "general",
                                minTime: 0,
                                rewardLoyalty: 0,
                                aspect: "landscape"
                            });
                        }}
                        className="flex-1 h-14 lg:h-12 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-500 font-black uppercase tracking-[0.2em] text-xs lg:text-[10px] hover:bg-white/5 hover:text-white transition-all active:scale-95 italic"
                   >
                        Abort Protocol
                   </button>
                   <button
                        onClick={submitMissionWithValidation}
                        disabled={creatingMission}
                        className="flex-[2] h-14 lg:h-12 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-right font-black text-white shadow-[0_10px_30px_rgba(147,51,234,0.3)] hover:shadow-[0_15px_40px_rgba(147,51,234,0.4)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs lg:text-[10px] disabled:opacity-50 disabled:cursor-not-allowed group italic"
                   >
                        {creatingMission ? (
                            <Loader className="animate-spin" size={18} />
                        ) : (
                            <>
                                 <span>{editingMission ? "Commit Changes" : "Authorize Deployment"}</span>
                             </>
                         )}
                   </button>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Cropper Modal Layer */}
      {cropImage && (
          <ImageCropper 
            image={cropImage} 
            onCancel={() => setCropImage(null)}
            onCropComplete={onCropComplete}
            initialAspect={missionForm.aspect === 'portrait' ? 3/4 : 2.4/1}
          />
      )}

      {/* Global CSS for Date Inputs */}
      <style >{`
        @keyframes scan-line {
            0% { transform: translateY(0); }
            100% { transform: translateY(112px); }
        }
        .animate-scan-line {
            animation: scan-line 3s linear infinite;
        }
        
        .custom-datetime-input::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
            opacity: 0.2;
            transition: opacity 0.3s;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
        }
        
        .custom-datetime-input:hover::-webkit-calendar-picker-indicator {
            opacity: 0.8;
        }
        
        .scrollbar-hide::-webkit-inner-spin-button,
        .scrollbar-hide::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        
        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2));
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </AnimatePresence>
  );
};

export default MissionModal;
