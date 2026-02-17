import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, Loader, Crop } from "lucide-react";
import ImageCropper from "./ImageCropper";

const HeroSlideModal = ({
  showHeroModal,
  setShowHeroModal,
  editingHero,
  heroForm,
  setHeroForm,
  submitHeroSlide,
  loading
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);

  // Debug state changes
  useEffect(() => {
    console.log("🔍 State changed:", {
      showCropper,
      hasOriginalImage: !!originalImage,
      originalImageLength: originalImage?.length
    });
  }, [showCropper, originalImage]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    console.log("📸 Image selected:", file);
    
    if (file) {
      console.log("📂 File details:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const reader = new FileReader();
      reader.onload = () => {
        console.log("✅ FileReader loaded successfully");
        setOriginalImage(reader.result);
        setShowCropper(true);
        console.log("🎨 Cropper should open now");
      };
      reader.onerror = (error) => {
        console.error("❌ FileReader error:", error);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("⚠️ No file selected");
    }
  };

  const handleCropComplete = (croppedBlob) => {
    // Convert blob to file
    const croppedFile = new File([croppedBlob], "hero-image.jpg", {
      type: "image/jpeg",
    });
    
    setHeroForm(prev => ({
      ...prev,
      imageFile: croppedFile,
      imagePreview: URL.createObjectURL(croppedBlob)
    }));
    
    setShowCropper(false);
    setOriginalImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setOriginalImage(null);
  };

  return (
    <>
      <AnimatePresence>
        {showHeroModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowHeroModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-3xl bg-[#050505] border border-purple-500/30 w-full max-w-2xl p-8 shadow-2xl relative overflow-hidden my-auto"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-tighter italic">
                  {editingHero ? "Edit Hero Slide" : "Initialize New Slide"}
                </h2>
                <button
                  onClick={() => setShowHeroModal(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Title Top (White Text)</label>
                    <input
                      type="text"
                      value={heroForm.titleTop}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, titleTop: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-gray-700 font-bold uppercase"
                      placeholder="e.g. NEW MISSIONS"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Title Bottom (Gradient)</label>
                    <input
                      type="text"
                      value={heroForm.titleBottom}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, titleBottom: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-gray-700 font-bold uppercase"
                      placeholder="e.g. AVAILABLE NOW"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Badge Text</label>
                    <input
                      type="text"
                      value={heroForm.badge}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-gray-700 font-bold uppercase"
                      placeholder="e.g. LIMITED TIME"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Button CTA</label>
                    <input
                      type="text"
                      value={heroForm.cta}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, cta: e.target.value }))} 
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-gray-700 font-bold uppercase"
                      placeholder="e.g. EXPLORE MISSIONS"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Description</label>
                  <textarea
                    value={heroForm.description}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all placeholder:text-gray-700 h-24 resize-none font-medium text-sm"
                    placeholder="Enter a compelling description for this slide..."
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2">
                  <div className="space-y-1.5 flex flex-col justify-center col-span-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Background Image</label>
                    <div className="flex gap-2">
                      <div 
                        className="relative flex-1 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-all overflow-hidden"
                        onClick={() => document.getElementById('hero-image-input').click()}
                      >
                        {heroForm.imagePreview ? (
                          <img src={heroForm.imagePreview} className="w-full h-full object-cover opacity-50" alt="Preview" />
                        ) : (
                          <div className="flex items-center gap-2">
                            <Plus size={12} className="text-gray-500" />
                            <span className="text-[10px] font-black text-gray-500 uppercase">Upload</span>
                          </div>
                        )}
                        <input 
                          id="hero-image-input"
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageSelect}
                        />
                      </div>
                      {heroForm.imagePreview && (
                        <button
                          onClick={() => {
                            setOriginalImage(heroForm.imagePreview);
                            setShowCropper(true);
                          }}
                          className="px-4 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-400 transition-all flex items-center gap-2"
                        >
                          <Crop size={14} />
                          <span className="text-[10px] font-black uppercase">Crop</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Participants Count</label>
                    <input
                      type="text"
                      value={heroForm.participants}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, participants: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all font-mono text-sm"
                      placeholder="1,234"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Height (e.g. 400px)</label>
                    <input
                      type="text"
                      value={heroForm.height}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all font-mono text-sm"
                      placeholder="400px"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-purple-400/80 ml-1">Width (e.g. 100%)</label>
                    <input
                      type="text"
                      value={heroForm.width}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, width: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all font-mono text-sm"
                      placeholder="100%"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 ml-1">Display Order</label>
                    <input
                      type="number"
                      value={heroForm.order}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:outline-none transition-all font-mono text-sm"
                      placeholder="1"
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Visible on Site</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={heroForm.isActive}
                          onChange={(e) => setHeroForm(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10 relative z-10 pt-6 border-t border-white/5">
                <button
                  onClick={() => setShowHeroModal(false)}
                  className="flex-1 py-4 rounded-xl bg-transparent border border-white/10 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-white hover:bg-white/5 transition-all"
                >
                  Abort Changes
                </button>
                <button
                  onClick={submitHeroSlide}
                  disabled={loading}
                  className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-black text-white shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] disabled:opacity-50"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : (editingHero ? <><Edit2 size={12}/> Confirm Update</> : <><Plus size={12}/> Deploy Slide</>)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      {(() => {
        const shouldRender = showCropper && originalImage;
        console.log("🖼️ Cropper render check:", { showCropper, hasImage: !!originalImage, shouldRender });
        return shouldRender ? (
          <ImageCropper
            image={originalImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={16 / 9}
          />
        ) : null;
      })()}
    </>
  );
};

export default HeroSlideModal;


