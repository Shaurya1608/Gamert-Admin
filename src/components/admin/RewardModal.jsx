import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, X, Upload, Edit2 } from "lucide-react";
import ImageCropper from "../common/ImageCropper";
import { dataURLtoFile } from "../../utils/imageUtils";

const RewardModal = ({
  showRewardModal,
  setShowRewardModal,
  editingReward,
  rewardForm,
  setRewardForm,
  submitReward,
  loading
}) => {
  const [cropImage, setCropImage] = useState(null);

  const handleFileChange = (e) => {
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
    const file = dataURLtoFile(croppedImageDataUrl, 'reward-image.jpg');
    // We add a 'preview' property to the form to easily display the cropped result
    // Note: The parent component probably expects 'image' to be the File object
    setRewardForm({ 
        ...rewardForm, 
        image: file, 
        imagePreview: croppedImageDataUrl 
    });
    setCropImage(null);
  };

  const getImagePreview = () => {
    if (rewardForm.imagePreview) return rewardForm.imagePreview;
    if (rewardForm.image instanceof File) return URL.createObjectURL(rewardForm.image);
    if (typeof rewardForm.image === 'string') return rewardForm.image;
    return null;
  };

  const previewUrl = getImagePreview();

  return (
    <AnimatePresence>
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-gray-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingReward ? "Edit Reward" : "Create Reward"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={rewardForm.title}
                  onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none text-white"
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none text-white"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price (💎)</label>
                  <input
                    type="number"
                    value={rewardForm.priceDiamonds}
                    onChange={(e) => setRewardForm({ ...rewardForm, priceDiamonds: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                  <input
                    type="number"
                    value={rewardForm.stock}
                    onChange={(e) => setRewardForm({ ...rewardForm, stock: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                 <select
                    value={rewardForm.category}
                    onChange={(e) => setRewardForm({ ...rewardForm, category: e.target.value })}
                     className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 focus:border-purple-500 focus:outline-none text-white"
                 >
                   <option value="Daily">Daily</option>
                   <option value="Weekly">Weekly</option>
                   <option value="Special">Special</option>
                 </select>
              </div>
              
               <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image</label>
                  
                  {previewUrl ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 group mb-2">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                              <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer text-white transition-colors">
                                  <Upload size={20} />
                                  <input type="file" className="hidden" onChange={handleFileChange} />
                              </label>
                              <button 
                                  type="button"
                                  onClick={() => setCropImage(previewUrl)}
                                  className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors"
                              >
                                  <Edit2 size={20} />
                              </button>
                          </div>
                      </div>
                  ) : (
                    <div className="w-full h-32 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-500 hover:text-purple-400 transition-colors cursor-pointer relative">
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs font-bold uppercase">Upload Image</span>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                  )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowRewardModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitReward}
                disabled={loading}
                className="flex-1 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 hover:opacity-90 transition font-medium disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : (editingReward ? "Update" : "Create")}
              </button>
            </div>
          </motion.div>
          
          {/* Image Cropper Layer */}
           {cropImage && (
                <ImageCropper
                    image={cropImage}
                    onCancel={() => setCropImage(null)}
                    onCropComplete={onCropComplete}
                    initialAspect={1/1} // Rewards are typically square
                />
           )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default RewardModal;
