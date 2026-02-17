import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Gamepad2, Loader, Image as ImageIcon, ChevronDown, Settings, Shield, Info, AlertCircle, ArrowRight, Edit2 } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import ImageCropper from "../common/ImageCropper";
import { dataURLtoFile } from "../../utils/imageUtils";

const GameModal = ({
  showGameModal,
  setShowGameModal,
  categories,
  submitGame,
  loading,
  editingGame
}) => {
  const [form, setForm] = useState({
    title: "",
    gameKey: "",
    description: "",
    categoryId: "",
    showOnHome: false,
    imageFile: null,
    imagePreview: null,
    gameZip: null,
    zipName: "",
    previewUrl: "",
    integrationType: "local", // local or remote
    gameUrl: "" // For remote games
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  React.useEffect(() => {
    if (editingGame) {
      setForm({
        title: editingGame.title || "",
        gameKey: editingGame.gameKey || "",
        description: editingGame.description || "",
        categoryId: editingGame.categoryId || "",
        showOnHome: editingGame.showOnHome || false,
        imageFile: null,
        imagePreview: editingGame.image || null,
        gameZip: null,
        zipName: "",
        previewUrl: editingGame.previewUrl || "",
        integrationType: editingGame.integrationType || "local",
        gameUrl: editingGame.gameUrl || ""
      });
    } else {
      setForm({
        title: "",
        gameKey: "",
        description: "",
        categoryId: "",
        showOnHome: false,
        imageFile: null,
        imagePreview: null,
        gameZip: null,
        zipName: "",
        previewUrl: "",
        integrationType: "local",
        gameUrl: ""
      });
    }
  }, [editingGame, showGameModal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
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
        const croppedFile = dataURLtoFile(croppedImageDataUrl, 'game-asset.jpg');
        
        setForm(prev => ({
            ...prev,
            imagePreview: croppedImageDataUrl,
            imageFile: croppedFile
        }));
        setCropImage(null);
    } catch (e) {
        console.error("Error cropping image:", e);
    }
  };

  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        gameZip: file,
        zipName: file.name
      }));
    }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      submitGame(form);
  };

  if (!showGameModal) return null;

  return (
    <AnimatePresence>
      {showGameModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setShowGameModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0c0c0c] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="relative shrink-0 p-6 md:p-8 border-b border-white/5 bg-white/[0.02]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-600/10">
                           <Settings className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                {editingGame ? "Deployment Settings" : "System Ingress"}
                                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/5 text-[9px] text-gray-400">v2.0</span>
                            </h3>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                {editingGame ? "Modifying existing game protocol" : "Registering new hardware interface"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowGameModal(false)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Scrollable Form */}
            <div 
                className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 min-h-0"
                onWheel={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} id="game-settings-form" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Section 1: Identifying Data */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                    <Gamepad2 size={12} className="text-purple-500" /> Game Identity
                                </label>
                                <div className="space-y-4">
                                    <div className="relative group">
                                         <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-10 transition-opacity blur-sm" />
                                         <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                            className="relative w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-purple-500/50 transition-all font-bold text-white placeholder:text-gray-700"
                                            placeholder="e.g. VOID SLAYER"
                                        />
                                    </div>
                                    <div className="relative group">
                                         <input
                                            type="text"
                                            name="gameKey"
                                            value={form.gameKey}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3.5 outline-none font-mono text-sm text-yellow-500/80 placeholder:text-gray-800 focus:border-purple-500/50 transition-all"
                                            placeholder="unique-slug-key"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                            <Settings size={14} className="text-gray-700" />
                                            <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wider">ROUTING ID</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                    <Shield size={12} className="text-purple-500" /> Category Filter
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                        className={`w-full bg-white/[0.03] border ${isCategoryOpen ? 'border-purple-500/50 ring-1 ring-purple-500/20' : 'border-white/10'} rounded-xl px-4 py-3.5 outline-none transition-all flex items-center justify-between group`}
                                    >
                                        <span className={`text-sm font-bold uppercase tracking-tight ${form.categoryId ? 'text-white' : 'text-gray-600'}`}>
                                            {form.categoryId 
                                                ? categories.find(c => c._id === form.categoryId)?.name 
                                                : "Select protocol category"}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-purple-400' : 'group-hover:text-gray-300'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isCategoryOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                                className="absolute top-full left-0 right-0 mt-3 z-[200] origin-top"
                                            >
                                                <div className="bg-[#121212] border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden p-2">
                                                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-1 space-y-1">
                                                        {categories.map(cat => (
                                                            <button
                                                                key={cat._id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setForm(prev => ({ ...prev, categoryId: cat._id }));
                                                                    setIsCategoryOpen(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between
                                                                    ${form.categoryId === cat._id 
                                                                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/10' 
                                                                        : 'text-gray-500 hover:bg-white/5 hover:text-white border border-transparent'
                                                                    }`}
                                                            >
                                                                {cat.name}
                                                                {form.categoryId === cat._id && (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_purple]" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Visual & Logic Assets */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                    <ImageIcon size={12} className="text-purple-500" /> Static Visuals
                                </label>
                                <div className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl transition-all h-32 flex flex-col items-center justify-center bg-white/[0.01] overflow-hidden">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {form.imagePreview ? (
                                        <div className="relative w-full h-full group/preview">
                                            <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover/preview:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity gap-2">
                                                <span className="text-[9px] font-black text-white uppercase bg-black/60 px-3 py-2 rounded-lg border border-white/10 backdrop-blur-md">Swap Matrix</span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setCropImage(form.imagePreview);
                                                    }}
                                                    className="p-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
                                                    title="Edit Image"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2 group-hover:text-purple-400 transition-colors">
                                                <ImageIcon size={20} />
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Inject Thumbnail</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                    <Shield size={12} className="text-purple-500" /> Integration Method
                                </label>
                                <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, integrationType: 'local' }))}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.integrationType === 'local' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Local (ZIP)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, integrationType: 'remote' }))}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.integrationType === 'remote' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Remote (URL)
                                    </button>
                                </div>
                            </div>

                            {form.integrationType === 'local' ? (
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                        <Upload size={12} className="text-purple-500" /> Source Array (.zip)
                                    </label>
                                    <div className="relative group cursor-pointer border-2 border-dashed border-white/5 hover:border-green-500/50 rounded-2xl transition-all h-24 flex flex-col items-center justify-center bg-white/[0.01]">
                                        <input
                                            type="file"
                                            accept=".zip"
                                            onChange={handleZipChange}
                                            required={!editingGame && form.integrationType === 'local'}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <Upload className={`w-6 h-6 mb-2 transition-colors ${form.zipName ? 'text-green-500' : 'text-gray-700 group-hover:text-green-500'}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-tight ${form.zipName ? 'text-green-500' : 'text-gray-600'}`}>
                                            {form.zipName || (editingGame ? "Patch Build (.zip)" : "Primary Build Ingress")}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                        <Shield size={12} className="text-purple-500" /> External Resource (URL)
                                    </label>
                                    <div className="relative group">
                                         <input
                                            type="url"
                                            name="gameUrl"
                                            value={form.gameUrl}
                                            onChange={handleChange}
                                            required={form.integrationType === 'remote'}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-purple-500/50 transition-all font-bold text-white placeholder:text-gray-700"
                                            placeholder="https://external-game-host.com/game"
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wider ml-1 italic">
                                        * Must support GamerThred SDK v2.0 for live scoring.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                <Info size={12} className="text-purple-500" /> Telemetry Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500/50 transition-all h-28 resize-none font-bold placeholder:text-gray-800 text-xs leading-relaxed text-gray-300"
                                placeholder="..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-gray-500 ml-1">
                                <Upload size={12} className="text-purple-500" /> Motion Preview Protocol (URL)
                            </label>
                            <input
                                type="url"
                                name="previewUrl"
                                value={form.previewUrl}
                                onChange={handleChange}
                                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-purple-500/50 transition-all font-bold text-xs text-white placeholder:text-gray-800"
                                placeholder="https://cdn.protocol.com/preview.mp4"
                            />
                        </div>
                    </div>

                    {/* Deployment Flags */}
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between gap-6 group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${form.showOnHome ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/5 text-gray-700'}`}>
                                <Gamepad2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tighter">Live Deployment Ingress</h4>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1 italic">Immediately broadcast to discovery protocols</p>
                            </div>
                        </div>
                        <ToggleSwitch
                            enabled={form.showOnHome}
                            onChange={(val) => setForm(prev => ({ ...prev, showOnHome: val }))}
                            size="md"
                            color="purple"
                        />
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="shrink-0 p-6 md:p-8 border-t border-white/5 bg-white/[0.02] flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => setShowGameModal(false)}
                    className="flex-1 px-8 py-4 rounded-2xl font-black bg-white/5 text-gray-500 hover:text-white border border-white/5 hover:border-white/10 transition-all uppercase tracking-widest text-[10px]"
                >
                    Abort Ingress
                </button>
                <button
                    form="game-settings-form"
                    type="submit"
                    className="flex-[2] px-8 py-4 rounded-2xl font-black bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-[10px] disabled:opacity-50 flex items-center justify-center gap-3 group"
                    disabled={loading}
                >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : (
                        <>
                            {editingGame ? "Commit Protocol Update" : "Finalize Build Deployment"}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
            
            {/* Image Cropper Layer */}
            {cropImage && (
                <ImageCropper 
                    image={cropImage} 
                    onCancel={() => setCropImage(null)}
                    onCropComplete={onCropComplete}
                    initialAspect={16/9} // Default to Landscape for Games
                />
            )}

            {/* Re-import icons from earlier if missing */}
            {(() => {
                const ArrowRight = ({ size, className }) => (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                );
                return null;
            })()}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(168, 85, 247, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(168, 85, 247, 0.5);
                }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModal;
