import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Check, RotateCw, ZoomIn, Image as ImageIcon, Smartphone, Monitor 
} from "lucide-react";
import getCroppedImg from "../../utils/imageUtils";

const ASPECT_RATIOS = [
  { label: "Cinematic", value: 2.4 / 1, icon: Monitor }, // 21:9ish
  { label: "Landscape", value: 16 / 9, icon: Monitor },
  { label: "Portrait", value: 9 / 16, icon: Smartphone },
  { label: "Square", value: 1 / 1, icon: ImageIcon },
  { label: "Classic", value: 4 / 3, icon: ImageIcon },
];

const ImageCropper = ({ 
  image, 
  onCropComplete, 
  onCancel, 
  initialAspect = 2.4 / 1 
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onRotationChange = (rotation) => setRotation(rotation);

  const onCropAreaComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      if (!croppedAreaPixels) return;
      // Get the cropped image data URL using the utility function
      // We pass rotation as well now
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center sm:p-4 backdrop-blur-xl">
      <div className="relative w-full h-full max-w-5xl bg-[#050505] sm:border border-white/10 sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        
        {/* 1. Cropper Area (Main Canvas) */}
        <div className="relative flex-1 bg-[#0a0a0a] min-h-[50vh] lg:min-h-full">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={onCropChange}
                onCropComplete={onCropAreaComplete}
                onZoomChange={onZoomChange}
                onRotationChange={onRotationChange}
                classes={{
                    containerClassName: "bg-[#0a0a0a]",
                    mediaClassName: "",
                    cropAreaClassName: "border-2 border-white/50 shadow-[0_0_0_9999px_rgba(0,0,0,0.8)]"
                }}
            />
            
            {/* Mobile Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between lg:hidden z-50">
                <button 
                    onClick={onCancel}
                    className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md"
                >
                    <X size={20} />
                </button>
                <button 
                    onClick={handleConfirm}
                    className="px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs backdrop-blur-md"
                >
                    Save
                </button>
            </div>
        </div>

        {/* 2. Controls Sidebar/Bottom Bar */}
        <div className="w-full lg:w-96 bg-[#050505] border-t lg:border-t-0 lg:border-l border-white/5 p-6 flex flex-col gap-6 z-10 select-none">
            
            <div className="hidden lg:flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Image Studio</h3>
                <div className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-400 font-bold uppercase">
                    Beta
                </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aspect Ratio</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 gap-2">
                    {ASPECT_RATIOS.map((ratio) => {
                        const Icon = ratio.icon;
                        const isActive = aspect === ratio.value;
                        return (
                            <button
                                key={ratio.label}
                                onClick={() => setAspect(ratio.value)}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all
                                    ${isActive 
                                        ? 'bg-purple-600 text-white border-purple-500' 
                                        : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10 hover:text-gray-300'}
                                    `}
                            >
                                <Icon size={14} />
                                <span className="text-[9px] font-bold uppercase">{ratio.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sliders Group */}
            <div className="space-y-6 flex-1">
                {/* Zoom Control */}
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-2"><ZoomIn size={12}/> Zoom Level</span>
                        <span className="text-purple-400">{Math.round(zoom * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                    />
                </div>

                {/* Rotation Control */}
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-2"><RotateCw size={12}/> Rotation</span>
                        <span className="text-purple-400">{rotation}°</span>
                    </div>
                    <input
                        type="range"
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                    />
                </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex gap-3 mt-auto pt-6 border-t border-white/5">
                <button
                    onClick={onCancel}
                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/5 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    <Check size={16} />
                    Confirm Edits
                </button>
            </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageCropper;
