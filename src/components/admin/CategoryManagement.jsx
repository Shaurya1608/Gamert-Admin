import React from "react";
import { motion } from "framer-motion";
import { Loader, Plus, Grid, Edit2, Trash2 } from "lucide-react";

const CategoryManagement = ({
  loadingCategories,
  categories,
  setEditingCategory,
  setCategoryForm,
  setShowCategoryModal,
  handleDeleteCategory
}) => {
  if (loadingCategories) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400">Categories</h2>
        <button
          onClick={() => {
            setEditingCategory(null);
            setCategoryForm({ name: "", order: 0, image: null, imagePreview: null });
            setShowCategoryModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 font-semibold hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-400 text-center">No categories found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="group relative p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <div className="aspect-square rounded-xl bg-gray-900 overflow-hidden mb-4 border border-white/5">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <Grid size={48} />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-lg">{cat.name}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryForm({ name: cat.name, order: cat.order, image: null, imagePreview: cat.image });
                      setShowCategoryModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
