import React from "react";
import { motion } from "framer-motion";
import { Loader, Plus, Flame, Edit2, Trash2 } from "lucide-react";

const HeroManagement = ({
  loadingHero,
  heroSlides,
  setEditingHero,
  setHeroForm,
  setShowHeroModal,
  deleteHeroSlide
}) => {
  if (loadingHero) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-400 uppercase tracking-tighter italic">Hero Swiper Management</h2>
        <button
          onClick={() => {
            setEditingHero(null);
            setHeroForm({
              titleTop: "",
              titleBottom: "",
              description: "",
              cta: "Explore Now",
              badge: "",
              participants: "0",
              order: 0,
              isActive: true,
              height: "400px",
              width: "100%",
            });
            setShowHeroModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-3 h-3" />
          Add New Slide
        </button>
      </div>

      {heroSlides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
           <Flame className="w-12 h-12 text-gray-600 mb-4" />
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No slides found in the system</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroSlides.map((slide) => (
            <div key={slide._id} className="group relative p-5 rounded-2xl bg-[#050505] border border-white/5 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${slide.isActive ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                      {slide.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Order: {slide.order}</span>
              </div>
              <div className="mb-4 flex gap-4">
                  {slide.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-lg">
                          <img src={slide.image} className="w-full h-full object-cover" alt="bg" />
                      </div>
                  )}
                  <div>
                      <h3 className="font-black text-white text-lg uppercase tracking-tighter italic leading-none">{slide.titleTop}</h3>
                      <h2 className="font-black text-purple-400 text-lg uppercase tracking-tighter italic leading-none mb-2">{slide.titleBottom}</h2>
                      <p className="text-[10px] text-gray-500 line-clamp-2 uppercase font-bold tracking-tight">{slide.description}</p>
                  </div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <div className="flex flex-col">
                     <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Badge</span>
                     <span className="text-[10px] font-black text-white uppercase tracking-tighter">{slide.badge || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingHero(slide);
                      setHeroForm({
                        titleTop: slide.titleTop,
                        titleBottom: slide.titleBottom,
                        description: slide.description,
                        cta: slide.cta,
                        badge: slide.badge,
                        participants: slide.participants,
                        order: slide.order,
                        isActive: slide.isActive,
                        image: slide.image,
                        height: slide.height || "400px",
                        width: slide.width || "100%",
                        imageFile: null,
                        imagePreview: slide.image,
                      });
                      setShowHeroModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteHeroSlide(slide._id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
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

export default HeroManagement;
