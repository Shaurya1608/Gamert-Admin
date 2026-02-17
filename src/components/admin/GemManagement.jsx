import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Gem, CheckCircle2, XCircle } from "lucide-react";

const GemManagement = ({ packages, loading, onEdit, onDelete, onToggle, setShowModal, setEditingPackage, setPackageForm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Gem Packages</h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Configure premium crystal infusions</p>
        </div>
        <button
          onClick={() => {
            setEditingPackage(null);
            setPackageForm({ name: "", description: "", gemAmount: 100, priceInr: 400, isActive: true, displayOrder: 0 });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          <Plus size={16} /> Create Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className={`group bg-white/[0.03] border ${pkg.isActive ? 'border-white/10' : 'border-red-500/20'} rounded-3xl p-6 relative overflow-hidden transition-all hover:border-cyan-500/30`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${pkg.isActive ? 'bg-cyan-500/10' : 'bg-red-500/10'} border border-white/10`}>
                  <Gem size={24} className={pkg.isActive ? 'text-cyan-400' : 'text-red-400'} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(pkg)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => onDelete(pkg._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-white uppercase italic tracking-tight">{pkg.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{pkg.gemAmount} GEMS | ₹{pkg.priceInr}</p>
                  {pkg.showDiscount && (
                      <span className="text-[7px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border border-red-500/20">
                          {pkg.discountTag || "DISCOUNT"}
                      </span>
                  )}
              </div>
              
              <button
                onClick={() => onToggle(pkg._id, pkg.isActive)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all
                  ${pkg.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}
                `}
              >
                {pkg.isActive ? <><CheckCircle2 size={10} /> Active</> : <><XCircle size={10} /> Inactive</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GemManagement;
