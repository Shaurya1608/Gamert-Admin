import React from "react";
import { motion } from "framer-motion";
import { Loader, Users, Activity, Shield, AlertCircle, TrendingUp, CheckCircle2, Plus, Gamepad2, CreditCard, Sparkles, ShoppingBag, ArrowUpRight, DollarSign } from "lucide-react";
import AnalyticsGraph from "./AnalyticsGraph";
import RevenueChart from "./RevenueChart";
import RecentUsersTable from "./RecentUsersTable";
import StandardEmptyState from "../common/StandardEmptyState";

const AdminDashboard = ({ 
  loading, 
  stats, 
  analyticsData, 
  activityLogs = [], 
  formatDate, 
  setShowCreateMission, 
  setActiveTab,
  users 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    );
  }

  // Calculate revenue breakdown
  const revenueBreakdown = stats?.revenue?.breakdown || { PASS: 0, GEMS: 0, ADS: 0 };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Command Center</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Live Infrastructure Monitoring • Ecosystem Control</p>
        </div>
        <div className="flex gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
                    {stats?.onlineUsers || 0} Players Online
                </span>
             </div>
             <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                 Export Logs
             </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Players",
              value: (stats.totalUsers || 0).toLocaleString(),
              subtext: `${stats.usersThisMonth || 0} recently recruited`,
              icon: Users,
              trend: "+12%",
              color: "from-blue-500 to-indigo-500",
              text: "text-blue-400",
              bg: "bg-blue-500/10"
            },
            {
              label: "Active Sessions",
              value: (stats.onlineUsers || 0).toLocaleString(),
              subtext: "Concurrent connections",
              icon: Activity,
              trend: "Live",
              color: "from-green-500 to-emerald-500",
              text: "text-green-400",
              bg: "bg-green-500/10"
            },
            {
              label: "Pending Approvals",
              value: stats.pendingGames || 0,
              subtext: "Games waiting verification",
              icon: Gamepad2,
              trend: stats.pendingGames > 0 ? "Alert" : "Stable",
              color: stats.pendingGames > 0 ? "from-yellow-500 to-orange-500" : "from-gray-500 to-gray-600",
              text: stats.pendingGames > 0 ? "text-yellow-400" : "text-gray-400",
              bg: stats.pendingGames > 0 ? "bg-yellow-500/10" : "bg-white/5"
            },
            {
              label: "Incident Reports",
              value: stats.activeReports || 0,
              subtext: "Cheating / Abuse flags",
              icon: AlertCircle,
              trend: stats.activeReports > 0 ? "Critical" : "Clear",
              color: stats.activeReports > 0 ? "from-red-500 to-rose-500" : "from-gray-500 to-gray-600",
              text: stats.activeReports > 0 ? "text-red-400" : "text-gray-400",
              bg: stats.activeReports > 0 ? "bg-red-500/10" : "bg-white/5"
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0a] border border-white/5 p-6 group hover:border-white/10 transition-all duration-300 shadow-xl"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.08] blur-2xl group-hover:opacity-[0.15] transition-opacity`} />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className={`p-3 rounded-2xl ${stat.bg} ${stat.text} border border-white/5 shadow-inner`}>
                      <Icon className="w-5 h-5" />
                   </div>
                   <div className={`flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5`}>
                        <span className={`text-[9px] font-black ${stat.text}`}>{stat.trend}</span>
                   </div>
                </div>

                <div className="relative z-10">
                    <p className="text-3xl font-black text-white tracking-tighter mb-1 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-[9px] text-gray-600 font-medium mt-2 border-t border-dashed border-gray-800 pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {stat.subtext}
                    </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Control Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
               <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Revenue Breakdown</h3>
                    <TrendingUp size={14} className="text-purple-500" />
               </div>
               <div className="space-y-4">
                   <div className="flex justify-between items-end">
                       <div>
                           <p className="text-2xl font-black text-white italic">₹{stats?.revenue?.total?.toLocaleString() || 0}</p>
                           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">30-Day Protocol Income</p>
                       </div>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                       <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
                           <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Pass</p>
                           <p className="text-xs font-black text-blue-400">₹{revenueBreakdown.PASS.toLocaleString()}</p>
                       </div>
                       <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
                           <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Gems</p>
                           <p className="text-xs font-black text-purple-400">₹{revenueBreakdown.GEMS.toLocaleString()}</p>
                       </div>
                       <div className="bg-white/[0.02] p-2 rounded-xl border border-white/5">
                           <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Ads</p>
                           <p className="text-xs font-black text-green-400">₹{revenueBreakdown.ADS.toLocaleString()}</p>
                       </div>
                   </div>
               </div>
           </div>

           <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Economy Control</h3>
                    <Sparkles size={14} className="text-yellow-500" />
               </div>
               <div className="flex items-center gap-6">
                    <div className="flex-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500 mb-2">
                            <span>Minted</span>
                            <span className="text-yellow-500">{stats?.economy?.gemsMinted || 0}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '100%' }} />
                        </div>
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500 mt-4 mb-2">
                            <span>Spent</span>
                            <span className="text-purple-500">{stats?.economy?.gemsSpent || 0}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${Math.min((stats?.economy?.gemsSpent / stats?.economy?.gemsMinted) * 100, 100) || 0}%` }} />
                        </div>
                    </div>
               </div>
           </div>

           <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <ShoppingBag className="text-orange-500" size={16} />
                    </div>
                    <div>
                        <p className="text-lg font-black text-white tracking-tighter">{stats?.pendingOrders || 0} PENDING</p>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Shop Fulfillment Queue</p>
                    </div>
                    <button onClick={() => setActiveTab("orders")} className="ml-auto p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                    </button>
                </div>
           </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-6">
              <AnalyticsGraph data={analyticsData} />
              <div className="hidden lg:block">
                 <RevenueChart />
              </div>
          </div>

          {/* Side Column */}
          <div className="space-y-6 flex flex-col">
              {/* Quick Actions - STICKY */}
              <div className="sticky top-24 z-20 space-y-6">
                <div className="bg-linear-to-b from-purple-900/20 to-[#0a0a0a] border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
                    <h3 className="text-lg font-bold text-white mb-4 relative z-10 flex items-center gap-2">
                        <Shield size={18} className="text-purple-400" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3 relative z-10">
                        <button onClick={() => setShowCreateMission(true)} className="p-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex flex-col items-center gap-2 group shadow-lg shadow-purple-600/20 active:scale-95">
                            <Plus className="group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] uppercase tracking-widest">New Mission</span>
                        </button>
                        <button onClick={() => setActiveTab("users")} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold transition flex flex-col items-center gap-2 border border-white/5 active:scale-95">
                            <Users size={20} />
                            <span className="text-[9px] uppercase tracking-widest">Manage Users</span>
                        </button>
                        <button onClick={() => setActiveTab("games")} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold transition flex flex-col items-center gap-2 border border-white/5 active:scale-95">
                            <Gamepad2 size={20} />
                            <span className="text-[9px] uppercase tracking-widest">Update Games</span>
                        </button>
                        <button onClick={() => setActiveTab("orders")} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold transition flex flex-col items-center gap-2 border border-white/5 active:scale-95">
                            <ShoppingBag size={20} />
                            <span className="text-[9px] uppercase tracking-widest">View Orders</span>
                        </button>
                    </div>
                </div>

                {/* Recent Users Widget */}
                <div className="flex-1">
                    <RecentUsersTable users={users ? users.slice(0, 5) : []} />
                </div>
              </div>
          </div>
      </div>
          
      {/* Activity Logs (Full Width) */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#0a0a0a] border border-white/5 p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Infrastructure Audit Logs
              </h3>
              <button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                  System History
                  <ArrowUpRight size={10} />
              </button>
          </div>
          
          <div className="space-y-3">
              {activityLogs.length > 0 ? (
                activityLogs.map((activity, i) => (
                    <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                    >
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/10 group-hover:border-purple-500/30 transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-black uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors">
                                    {activity.action}
                                </p>
                                <span className="text-[9px] font-mono text-gray-600">
                                    {formatDate(activity.time)}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                Identity: {activity.user}
                            </p>
                        </div>
                    </motion.div>
                ))
              ) : (
                <StandardEmptyState 
                    title="No Signals Detected" 
                    subtitle="Neural monitoring is active, but no significant events have been logged in the current cycle."
                    icon={Activity}
                />
              )}
          </div>
        </motion.div>
      </div>

      {/* Mobile only Revenue Chart */}
      <div className="lg:hidden">
         <RevenueChart />
      </div>

    </div>
  );
};

export default AdminDashboard;
