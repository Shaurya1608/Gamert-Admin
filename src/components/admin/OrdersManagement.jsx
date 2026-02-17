import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Package, Truck, CheckCircle, XCircle, Search, Filter, ExternalLink, MapPin, ShieldAlert, AlertCircle, Send, ChevronRight, Activity } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getSafeUserAvatar } from "../../utils/avatarUtils";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // { title, message, onConfirm, type: 'danger' | 'info' }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
        setSearchQuery(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const fetchOrders = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await api.get("/api/admin-orders");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error("Manifest access failed");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const executeStatusUpdate = async (orderId, newStatus) => {
      try {
        setIsUpdating(true);
        setConfirmModal(null);
        const res = await api.patch(`/api/admin-orders/${orderId}/status`, { deliveryStatus: newStatus });
        if (res.data.success) {
          toast.success(`Protocol: ${newStatus} Activated`);
          if (selectedOrder && selectedOrder._id === orderId) {
              setSelectedOrder({ ...selectedOrder, deliveryStatus: newStatus });
          }
          await fetchOrders();
        }
      } catch (err) {
        toast.error("Authorization check failed");
      } finally {
        setIsUpdating(false);
      }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (isUpdating) return;
    
    if (newStatus === "Rejected") {
        setConfirmModal({
            title: "Confirm Termination",
            message: "This will permanently terminate the manifest protocol and refund the client. Proceed?",
            type: "danger",
            onConfirm: () => executeStatusUpdate(orderId, newStatus)
        });
        return;
    }
    
    executeStatusUpdate(orderId, newStatus);
  };

  const executeCancelRequest = async (orderId, action) => {
      try {
        setIsUpdating(true);
        setConfirmModal(null);
        const res = await api.post(`/api/admin-orders/${orderId}/cancel-request`, { action });
        if (res.data.success) {
          toast.success(`Request ${action}d successfully`);
          await fetchOrders();
          setSelectedOrder(null);
        }
      } catch (err) {
        toast.error("Protocol override failed");
      } finally {
        setIsUpdating(false);
      }
  };

  const handleCancelRequest = async (orderId, action) => {
    if (isUpdating) return;
    
    setConfirmModal({
        title: `Confirm ${action}`,
        message: `Are you sure you want to ${action.toLowerCase()} this cancellation protocol?`,
        type: action === "Approve" ? "danger" : "info",
        onConfirm: () => executeCancelRequest(orderId, action)
    });
  };

  const executeDelete = async (orderId) => {
      try {
        setIsUpdating(true);
        setConfirmModal(null);
        const res = await api.delete(`/api/admin-orders/${orderId}`);
        if (res.data.success) {
          toast.success("Manifest Purged Permanently");
          await fetchOrders();
          setSelectedOrder(null);
        }
      } catch (err) {
        toast.error("Manifest purge failed");
      } finally {
        setIsUpdating(false);
      }
  };

  const deleteOrder = async (orderId) => {
    if (isUpdating) return;
    
    setConfirmModal({
        title: "CRITICAL PURGE",
        message: "This action will permanently delete the order manifest from the database. DATA LOSS IS IRREVERSIBLE. Are you sure?",
        type: "danger",
        onConfirm: () => {
            setConfirmModal({
                title: "FINAL CONFIRMATION",
                message: "This is your LAST chance to abort. Purge manifest #..." + orderId.slice(-6) + "?",
                type: "danger",
                onConfirm: () => executeDelete(orderId)
            });
        }
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         o.reward?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         o._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.deliveryStatus === statusFilter;
    const matchesCancel = statusFilter === "Requests" ? o.cancellationRequested : true;
    return matchesSearch && matchesStatus && matchesCancel;
  });

  const getStatusConfig = (status, cancellationRequested) => {
    if (cancellationRequested) return {
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
        glow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]",
        label: "CANCEL REQ",
        icon: <AlertCircle size={10} />
    };
    switch (status) {
      case "Pending": return { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", glow: "shadow-[0_0_15px_rgba(250,204,21,0.1)]", label: "PENDING", icon: <Package size={10} /> };
      case "Processing": return { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", glow: "shadow-[0_0_15px_rgba(96,165,250,0.1)]", label: "PACKING", icon: <Activity size={10} /> };
      case "Shipped": return { color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", glow: "shadow-[0_0_15px_rgba(192,132,252,0.1)]", label: "SHIPPED", icon: <Truck size={10} /> };
      case "Out for Delivery": return { color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20", glow: "shadow-[0_0_15px_rgba(34,211,238,0.1)]", label: "ON ROUTE", icon: <Send size={10} /> };
      case "Delivered": return { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", glow: "shadow-[0_0_15px_rgba(74,222,128,0.1)]", label: "DELIVERED", icon: <CheckCircle size={10} /> };
      case "Cancelled": return { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", glow: "", label: "CANCELLED", icon: <XCircle size={10} /> };
      case "Rejected": return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", glow: "", label: "REJECTED", icon: <ShieldAlert size={10} /> };
      default: return { color: "text-gray-400", bg: "bg-gray-400/10", border: "border-gray-400/20", glow: "", label: "UNKNOWN", icon: <Package size={10} /> };
    }
  };

  const statusOrder = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  const getCurrentStep = (status) => statusOrder.indexOf(status);


  return (
    <div className="px-6 py-10 lg:px-12 bg-[#020202] min-h-screen selection:bg-purple-500/30">
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-10 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-2">Fulfillment <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">Center</span></h2>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Central Logistics Hub • V0.9B</p>
                </div>
            </div>

            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-purple-500" />
                <input 
                    type="text"
                    placeholder="SCAN MANIFEST ID OR USER..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-[11px] font-bold uppercase tracking-widest focus:border-purple-500/30 focus:bg-white/[0.05] outline-none transition-all shadow-inner"
                />
            </div>
        </div>

        {/* High-Fidelity Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar max-w-full -mx-2 px-2">
            {[
                { id: "All", label: "All", count: orders.length },
                { id: "Requests", label: "Requests", count: orders.filter(o => o.cancellationRequested).length, color: "text-orange-500", border: "border-orange-500/20" },
                { id: "Pending", label: "Pending", count: orders.filter(o => o.deliveryStatus === "Pending").length },
                { id: "Processing", label: "Packing", count: orders.filter(o => o.deliveryStatus === "Processing").length },
                { id: "Shipped", label: "Shipped", count: orders.filter(o => o.deliveryStatus === "Shipped").length },
                { id: "Out for Delivery", label: "On Route", count: orders.filter(o => o.deliveryStatus === "Out for Delivery").length },
                { id: "Delivered", label: "Delivered", count: orders.filter(o => o.deliveryStatus === "Delivered").length },
                { id: "Cancelled", label: "Cancelled", count: orders.filter(o => o.deliveryStatus === "Cancelled").length },
                { id: "Rejected", label: "Rejected", count: orders.filter(o => o.deliveryStatus === "Rejected").length },
            ].map((f) => {
                const isActive = statusFilter === f.id;
                return (
                    <button
                        key={f.id}
                        onClick={() => setStatusFilter(f.id)}
                        className={`relative shrink-0 px-3 md:px-4 py-2 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 ${
                            isActive 
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                            : `bg-white/[0.02] ${f.color || "text-gray-500"} ${f.border || "border-white/5"} hover:bg-white/[0.05] hover:text-white`
                        }`}
                    >
                        {f.id === "Requests" && <AlertCircle size={f.id === "Requests" ? 9 : 10} className={isActive ? "text-black" : "text-orange-500"} />}
                        <span>{f.label}</span>
                        <span className={`px-1 py-0.5 rounded-md text-[7px] md:text-[8px] font-bold ${isActive ? "bg-black/10 text-black/60" : "bg-white/5 text-gray-700"}`}>
                            {f.count}
                        </span>
                        {isActive && <motion.div layoutId="filter-glow" className="absolute inset-0 bg-white/10 blur-lg -z-10 rounded-xl" />}
                    </button>
                );
            })}
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence>
            {loading && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-0 top-0 flex flex-col items-center justify-center py-32 z-10 bg-[#020202]/80 backdrop-blur-md"
                >
                    <div className="relative mb-8">
                        {/* Orbiting Ring */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 rounded-full border-2 border-purple-500/30 border-t-purple-500"
                        />
                        
                        {/* Inner Pulsing Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Package className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 blur-2xl bg-purple-500/20 animate-pulse pointer-events-none" />
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">
                            Accessing Supply Lines
                        </h3>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                            Retrieving Order Data...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 transition-opacity duration-300 ${loading ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
            <div className="relative w-16 h-16 mx-auto mb-6">
                <Package className="w-full h-full text-gray-800" />
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            </div>
            <p className="text-gray-600 font-extrabold text-[11px] uppercase tracking-[0.5em]">System Idle: No Active Protocols</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const config = getStatusConfig(order.deliveryStatus, order.cancellationRequested);
            return (
                <motion.div 
                layoutId={order._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`group relative bg-[#080808]/40 backdrop-blur-md border ${order.cancellationRequested ? 'border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.05)]' : 'border-white/5'} rounded-[2rem] overflow-hidden hover:border-purple-500/30 transition-all cursor-pointer`}
                >
                <div className="p-5">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex gap-5">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black shrink-0 relative shadow-2xl transition-transform group-hover:scale-105 duration-500">
                            <img src={order.reward?.imageUrl} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <h3 className="text-xs font-black text-white uppercase tracking-tight">{order.reward?.title}</h3>
                                <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border flex items-center gap-2 ${config.bg} ${config.color} ${config.border} ${config.glow}`}>
                                    {config.icon}
                                    {config.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest italic opacity-60">
                                <span className="flex items-center gap-1.5"><Package size={10} /> #{order._id.slice(-6)}</span>
                                <span className="w-1 h-1 bg-gray-800 rounded-full" />
                                <span>{order.quantity || 1} UNIT(S)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 sm:text-right border-t sm:border-t-0 sm:border-l border-white/5 pt-6 sm:pt-0 sm:pl-8">
                        <div className="hidden sm:block">
                            <p className="text-[9px] text-gray-700 font-black uppercase mb-2 tracking-tighter">CLIENT ENTITY</p>
                            <div className="flex items-center lg:justify-end gap-3 translate-x-1">
                                <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest group-hover:text-purple-400 transition-colors">@{order.user?.username}</span>
                                <div className="h-8 w-8 rounded-xl overflow-hidden border border-white/20 p-0.5 bg-black shadow-xl">
                                    <img src={getSafeUserAvatar(order.user)} alt="" className="w-full h-full object-cover rounded-lg" />
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="text-gray-800 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" size={20} />
                    </div>
                    </div>
                </div>
                </motion.div>
            );
          })
        )}
      </div>
    </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/98 backdrop-blur-3xl" 
                onClick={() => !isUpdating && setSelectedOrder(null)} 
              />
              
              <motion.div 
                layoutId={selectedOrder._id}
                initial={{ opacity: 0, y: 100, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                className="relative bg-[#050505] border border-white/5 rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-[0_0_150px_rgba(168,85,247,0.15)] overflow-hidden"
              >
                 <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-cyan-500 to-pink-600 z-[60]" />
                 
                 {/* State Locking Overlay */}
                 {isUpdating && (
                     <div className="absolute inset-0 z-[70] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center rounded-[3rem] animate-in fade-in duration-300">
                        <div className="relative mb-8">
                             {/* Orbiting Ring */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500"
                            />
                            
                            {/* Inner Pulsing Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Activity className="w-6 h-6 text-purple-400" />
                                </motion.div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 blur-2xl bg-purple-500/20 animate-pulse pointer-events-none" />
                        </div>
                        <div className="text-center space-y-2">
                             <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">
                                 Syncing Protocols
                             </h3>
                             <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest animate-pulse">
                                 Processing Request...
                             </p>
                         </div>
                     </div>
                 )}

                 {/* Fixed Header */}
                 <div className="shrink-0 p-6 md:p-8 lg:p-10 pb-4 md:pb-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-start">
                    <div>
                        <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3 md:gap-4 group">
                            MANIFEST <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">LOCK</span>
                            <div className="hidden sm:block h-[2px] w-12 bg-white/5 group-hover:w-24 transition-all duration-700" />
                        </h3>
                        <div className="flex items-center gap-3 mt-3 md:mt-4">
                            <span className="bg-white/5 text-gray-500 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-white/5 truncate max-w-[150px] md:max-w-none">
                                LOG IDENTITY: {selectedOrder._id}
                            </span>
                        </div>
                    </div>
                    <button 
                        disabled={isUpdating}
                        onClick={() => setSelectedOrder(null)} 
                        className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-gray-500 hover:text-white transition-all hover:bg-red-500/20 hover:border-red-500/30 border border-transparent disabled:opacity-20"
                    >
                        <XCircle size={20} md:size={24} />
                    </button>
                 </div>

                 {/* Scrollable Body */}
                 <div 
                    className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 lg:p-12 space-y-10 md:space-y-16 min-h-0"
                    onWheel={(e) => e.stopPropagation()}
                 >
                    <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
                        <div className="space-y-10 md:space-y-12">
                            {/* Product Profile */}
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/10 to-cyan-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                <div className="relative flex gap-8 items-center">
                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black transform -rotate-3 group-hover:rotate-0 transition-transform duration-700">
                                        <img src={selectedOrder.reward?.imageUrl} alt="" className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000" />
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xl font-black text-white uppercase tracking-tight italic leading-tight">{selectedOrder.reward?.title}</h4>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.2em] italic">Authorized Unit</span>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
                                                    <span className="text-white font-black text-[13px]">💎 {selectedOrder.priceDiamonds}</span>
                                                    <span className="text-gray-600 text-[9px] font-black">COST</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lifecycle Timeline */}
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Activity size={80} className="text-purple-500" />
                                </div>
                                <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-8 italic flex items-center gap-2">
                                    <div className="h-[1px] w-5 bg-purple-500/50" />
                                    Protocol Lifecycle Status
                                </h5>
                                
                                <div className="space-y-6 relative">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-yellow-500/30 via-blue-500/30 to-gray-800" />
                                    
                                    {statusOrder.map((step, idx) => {
                                        const currentStepIdx = getCurrentStep(selectedOrder.deliveryStatus);
                                        const isCompleted = idx < currentStepIdx || selectedOrder.deliveryStatus === "Delivered";
                                        const isActive = step === selectedOrder.deliveryStatus;
                                        
                                        return (
                                            <div key={step} className={`flex items-start gap-4 transition-all duration-500 ${isActive ? 'scale-105' : idx > currentStepIdx ? 'opacity-30' : 'opacity-80'}`}>
                                                <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                                                    isActive ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 
                                                    isCompleted ? 'bg-gray-400 border-gray-300' : 'bg-black border-gray-800'
                                                }`}>
                                                    {isCompleted ? <CheckCircle size={12} className="text-black" /> : <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-gray-800'}`} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-500'}`}>{step === "Processing" ? "Packing Manifest" : step}</span>
                                                    {isActive && <span className="text-[8px] text-purple-400 font-bold uppercase tracking-tight italic mt-0.5">Manifest Active</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {selectedOrder.cancellationRequested ? (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-8 bg-orange-600/[0.03] border border-orange-500/30 rounded-[2.5rem] space-y-6 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                                        <XCircle size={70} className="text-orange-500" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                                        <h4 className="text-[11px] font-black text-orange-400 uppercase tracking-widest italic">
                                            Priority: Termination Req
                                        </h4>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed italic relative z-10">
                                        Client <span className="text-white">@{selectedOrder.user?.username}</span> has requested a full manifest termination.
                                    </p>
                                    <div className="grid grid-cols-1 gap-3 pt-4 relative z-10">
                                        <button 
                                            onClick={() => handleCancelRequest(selectedOrder._id, "Approve")}
                                            disabled={isUpdating}
                                            className="py-4 px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all disabled:opacity-30 active:scale-95"
                                        >
                                            APPROVE CANCEL & REFUND <ChevronRight size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleCancelRequest(selectedOrder._id, "Reject")}
                                            disabled={isUpdating}
                                            className="py-4 px-6 bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all disabled:opacity-30"
                                        >
                                            REJECT CANCEL PROTOCOL
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-12">
                                    <div>
                                        <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 italic flex items-center gap-3">
                                            Command Center <div className="h-[1px] flex-1 bg-white/5" />
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                              onClick={() => updateStatus(selectedOrder._id, "Processing")}
                                              disabled={isUpdating || selectedOrder.deliveryStatus !== "Pending"}
                                              className={`relative group overflow-hidden py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                                                selectedOrder.deliveryStatus === "Pending"
                                                ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:bg-blue-500 hover:scale-[1.02] active:scale-95'
                                                : 'bg-white/5 text-gray-800 opacity-30 cursor-not-allowed border border-white/5'
                                              }`}
                                            >
                                              {selectedOrder.deliveryStatus === "Pending" ? "APPROVE MANIFEST" : "MANIFEST AUTHORIZED"}
                                            </button>
                                            
                                            <button
                                              onClick={() => {
                                                if (window.confirm("Complete protocol termination?")) {
                                                    updateStatus(selectedOrder._id, "Rejected");
                                                }
                                              }}
                                              disabled={isUpdating || ["Shipped", "Out for Delivery", "Delivered", "Cancelled", "Rejected"].includes(selectedOrder.deliveryStatus)}
                                              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                                                ["Rejected", "Cancelled"].includes(selectedOrder.deliveryStatus)
                                                ? 'border-red-500/20 bg-red-500/5 text-red-900 opacity-40' 
                                                : 'border-white/5 bg-white/[0.02] text-gray-700 hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5'
                                              }`}
                                            >
                                              {["Rejected", "Cancelled"].includes(selectedOrder.deliveryStatus) ? "CANCELLED" : "CANCEL ORDER"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4">
                                        <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4 italic text-center">Fulfillment Progression</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { id: "Shipped", icon: <Truck size={14} /> },
                                                { id: "Out for Delivery", icon: <Send size={14} /> },
                                                { id: "Delivered", icon: <CheckCircle size={14} /> }
                                            ].map((status) => {
                                                const currentIdx = getCurrentStep(selectedOrder.deliveryStatus);
                                                const targetIdx = getCurrentStep(status.id);
                                                const canAdvance = targetIdx > currentIdx && statusOrder[currentIdx] !== "Pending" && !["Cancelled", "Rejected"].includes(selectedOrder.deliveryStatus);
                                                const isCurrent = selectedOrder.deliveryStatus === status.id;

                                                return (
                                                    <button
                                                    key={status.id}
                                                    disabled={isUpdating || !canAdvance}
                                                    onClick={() => updateStatus(selectedOrder._id, status.id)}
                                                    className={`group relative overflow-hidden py-3.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-between ${
                                                        isCurrent 
                                                        ? 'bg-white text-black shadow-xl scale-[1.02]' 
                                                        : canAdvance 
                                                            ? 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10' 
                                                            : 'bg-white/[0.01] text-gray-800 opacity-20 cursor-not-allowed'
                                                    }`}
                                                    >
                                                    <span className="flex items-center gap-4">
                                                        {status.icon}
                                                        {status.id}
                                                    </span>
                                                    {isCurrent && <div className="absolute left-0 bottom-0 top-0 w-1 bg-purple-500" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Destination Identity */}
                            {selectedOrder.shippingDetails && (
                                <div className="p-8 bg-[#080808] border border-white/5 rounded-[2.5rem] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <MapPin size={70} className="text-cyan-500" />
                                    </div>
                                    <h5 className="text-[9px] font-black text-cyan-500/50 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="h-[1px] w-5 bg-cyan-500/30" />
                                        Destination Metadata
                                    </h5>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[9px] text-gray-700 font-extrabold uppercase tracking-widest mb-1">RECIPIENT</p>
                                            <p className="text-sm text-white font-black uppercase tracking-tight">{selectedOrder.shippingDetails.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-700 font-extrabold uppercase tracking-widest mb-1">COMMS</p>
                                            <p className="text-[12px] text-gray-300 font-black tracking-widest">{selectedOrder.shippingDetails.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-700 font-extrabold uppercase tracking-widest mb-1">SECTOR ADDRESS</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 leading-relaxed italic">
                                                {selectedOrder.shippingDetails.address?.line1}<br/>
                                                {selectedOrder.shippingDetails.address?.city} • {selectedOrder.shippingDetails.address?.state} • {selectedOrder.shippingDetails.address?.postal_code}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>

                 {/* Fixed Footer */}
                 <div className="shrink-0 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row gap-4 md:justify-between items-center border-t border-white/5 md:px-12">
                    <button 
                        disabled={isUpdating}
                        onClick={() => deleteOrder(selectedOrder._id)} 
                        className="w-full md:w-auto text-[9px] md:text-[10px] font-black text-red-900/60 uppercase tracking-[0.2em] hover:text-red-500 transition-all disabled:opacity-20 flex items-center justify-center gap-2 group"
                    >
                        <XCircle size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                        DELETE MANIFEST
                    </button>
                    
                    <button 
                        disabled={isUpdating}
                        onClick={() => setSelectedOrder(null)} 
                        className="w-full md:w-auto text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] md:tracking-[0.5em] hover:text-white transition-all disabled:opacity-20 md:translate-x-3"
                    >
                        TERMINATE SESSION
                    </button>
                 </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md bg-[#080808] border ${confirmModal.type === 'danger' ? 'border-red-500/30' : 'border-white/10'} rounded-[2.5rem] p-10 shadow-2xl overflow-hidden`}
            >
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${confirmModal.type === 'danger' ? 'from-red-600 to-orange-600' : 'from-purple-600 to-cyan-500'}`} />
              
              <div className="relative z-10 text-center space-y-6">
                 <div className={`mx-auto w-16 h-16 rounded-2xl ${confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'} border flex items-center justify-center mb-8`}>
                    {confirmModal.type === 'danger' ? <ShieldAlert size={32} /> : <AlertCircle size={32} />}
                 </div>

                 <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
                    {confirmModal.title}
                 </h3>
                 
                 <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed tracking-wide italic">
                    {confirmModal.message}
                 </p>

                 <div className="grid grid-cols-2 gap-4 pt-8">
                    <button 
                        onClick={() => setConfirmModal(null)}
                        className="py-4 px-6 bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all"
                    >
                        ABORT
                    </button>
                    <button 
                        onClick={confirmModal.onConfirm}
                        className={`py-4 px-6 ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'} text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95`}
                    >
                        CONFIRM
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.4);
        }
      `}</style>
    </div>
  );
};

export default OrdersManagement;
