import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Edit2, Loader } from "lucide-react";

const CategoryModal = ({
  showCategoryModal,
  setShowCategoryModal,
  editingCategory,
  categoryForm,
  setCategoryForm,
  submitCategory,
  loading
}) => {
  return (
    <AnimatePresence>
      {showCategoryModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCategoryModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-3xl bg-[#0a0a0a] border border-purple-500/30 w-full max-w-lg p-6 sm:p-8 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">
                {editingCategory ? "Update Category" : "New Category"}
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => document.getElementById('cat-image-input').click()}>
                      <div className="w-32 h-32 rounded-2xl bg-gray-900 border-2 border-dashed border-gray-700 overflow-hidden flex items-center justify-center group-hover:border-purple-500/50 transition-all">
                          {categoryForm.imagePreview ? (
                              <img src={categoryForm.imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                              <div className="text-center">
                                  <Plus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                  <span className="text-[10px] text-gray-600 font-bold uppercase">Upload</span>
                              </div>
                          )}
                      </div>
                      <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Edit2 className="w-6 h-6 text-white" />
                      </div>
                  </div>
                  <input 
                      id="cat-image-input"
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              setCategoryForm(prev => ({ 
                                  ...prev, 
                                  image: file, 
                                  imagePreview: URL.createObjectURL(file) 
                              }));
                          }
                      }}
                  />
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Category Icon / Image</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400 ml-1">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 text-gray-300 focus:border-purple-500/40 focus:outline-none transition-all placeholder:text-gray-700"
                  placeholder="Enter category name..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-bold text-gray-400 ml-1">Sort Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, order: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-gray-700 text-gray-300 focus:border-purple-500/40 focus:outline-none transition-all font-mono"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-transparent border border-gray-700 text-gray-400 font-semibold hover:text-white hover:border-gray-500 transition-all uppercase tracking-wider text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCategory}
                  disabled={loading}
                  className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : (editingCategory ? "Update" : "Create")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
