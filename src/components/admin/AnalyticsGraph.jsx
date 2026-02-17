import React, { useMemo } from "react";
import { motion } from "framer-motion";

const AnalyticsGraph = ({ data }) => {
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 40;

  const points = useMemo(() => {
    if (!data || data.length < 2) return [];

    const maxCount = Math.max(...data.map((d) => d.count), 5);
    const xStep = (chartWidth - padding * 2) / (data.length - 1);
    const yScale = (chartHeight - padding * 2) / maxCount;

    return data.map((d, i) => ({
      x: padding + i * xStep,
      y: chartHeight - padding - d.count * yScale,
      count: d.count,
      date: d.date,
    }));
  }, [data, chartWidth, chartHeight]);

  const linePath = useMemo(() => {
    if (points.length < 2) return "";
    return points.reduce((acc, point, i) => {
      return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
    }, "");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length < 2) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x},${chartHeight - padding} L ${first.x},${chartHeight - padding} Z`;
  }, [linePath, points, chartHeight]);

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500 bg-white/5 rounded-3xl border border-white/5">
        No analytical data available
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 lg:p-8 overflow-hidden relative group">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-purple-500/10 transition-colors" />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">User Growth</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Protocol Registration Trends (30D)</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registrations</span>
            </div>
        </div>
      </div>

      <div className="relative w-full h-[200px] mt-4">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grids */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => {
            const y = padding + p * (chartHeight - padding * 2);
            return (
              <line
                key={p}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="white"
                strokeOpacity="0.03"
                strokeWidth="1"
              />
            );
          })}

          {/* Area under the curve */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Line Chart */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={linePath}
            fill="none"
            stroke="#A855F7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.4))" }}
          />

          {/* Interaction Points */}
          {points.map((point, i) => (
            <g key={i} className="cursor-pointer group/point">
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * (i / points.length) * 10 }}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#0a0a0a"
                stroke="#A855F7"
                strokeWidth="2"
                className="hover:r-6 transition-all"
              />
              
              {/* Tooltip on hover (Custom logic or simple title) */}
              <title>{`${point.date}: ${point.count} users`}</title>
            </g>
          ))}
        </svg>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between mt-4 px-[40px]">
          {data.filter((_, i) => i % 5 === 0).map((d, i) => (
              <span key={i} className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">
                  {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
          ))}
      </div>
    </div>
  );
};

export default AnalyticsGraph;
