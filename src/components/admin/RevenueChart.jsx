import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

const RevenueChart = ({ data }) => {
  const chartHeight = 220;
  const chartWidth = 800;
  const padding = 40;
  const barWidth = 40;
  const gap = 20;

  // Mock data if none provided (for visualization during dev)
  const chartData = data || [
    { label: "Mon", value: 4500 },
    { label: "Tue", value: 5200 },
    { label: "Wed", value: 3800 },
    { label: "Thu", value: 6500 },
    { label: "Fri", value: 4900 },
    { label: "Sat", value: 7200 },
    { label: "Sun", value: 6100 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value), 100);
  const scaleY = (chartHeight - padding * 2) / maxValue;

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 lg:p-8 overflow-hidden relative group">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full -ml-20 -mt-20 group-hover:bg-green-500/10 transition-colors" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Revenue Stream</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Weekly Income Analytics</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20">
            <DollarSign size={14} className="text-green-500" />
            <span className="text-xs font-black text-green-400">Total: ₹{chartData.reduce((a, b) => a + b.value, 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="relative w-full h-[220px] flex items-end justify-between px-4 gap-2">
         {chartData.map((d, i) => {
             const height = d.value * scaleY;
             return (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                     <div className="relative w-full max-w-[40px] h-full flex items-end">
                         <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height }}
                            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                            className="w-full bg-linear-to-t from-green-600/20 to-green-500 rounded-t-lg relative overflow-hidden group-hover/bar:brightness-110 transition-all"
                         >
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                         </motion.div>
                         
                         {/* Tooltip */}
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                             ₹{d.value.toLocaleString()}
                             <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
                         </div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider group-hover/bar:text-green-500 transition-colors">{d.label}</span>
                 </div>
             )
         })}
      </div>
    </div>
  );
};

export default RevenueChart;
