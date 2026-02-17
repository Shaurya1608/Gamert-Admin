import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronRight, ChevronLeft, X, Menu } from "lucide-react";

const AdminSidebar = ({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  sidebarItems, 
  user, 
  activeTab, 
  setActiveTab, 
  navigate,
  logout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [activeTab, isMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMobile]);

  const filteredItems = sidebarItems.filter(tab => {
    if (user?.role === "admin") return true;
    
    const hasRole = tab.roles.includes(user?.role);
    if (!hasRole) return false;

    if (!tab.requiredPermission) return true;

    const requiredPairs = Array.isArray(tab.requiredPermission) 
      ? tab.requiredPermission 
      : [tab.requiredPermission];

    return requiredPairs.some(p => user?.permissions?.includes(p));
  });

  // Mobile Header with Hamburger
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-purple-500/20">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h1 className="text-base font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Control
                </h1>
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest leading-none">
                  Admin Panel
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 active:scale-95 transition-transform"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
              />

              {/* Drawer */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#0a0a0a] border-r border-purple-500/20 z-[70] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
              >
                {/* Drawer Header */}
                <div className="p-6 flex items-center justify-between border-b border-purple-500/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Control
                      </h1>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none">
                        Admin Panel
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white active:scale-95 transition-all"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav 
                    className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar"
                    onWheel={(e) => e.stopPropagation()}
                >
                  <div className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4 px-2">
                    Command & Control
                  </div>
                  
                  {filteredItems.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border ${
                          isActive
                            ? "bg-purple-600/10 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.05)]"
                            : "bg-transparent border-transparent hover:bg-white/[0.03] hover:border-white/5 active:scale-98"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? "bg-purple-600 text-white shadow-xl shadow-purple-600/20" 
                            : "bg-white/5 text-gray-600"
                        }`}>
                          <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </div>

                        <span className={`text-[11px] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${
                          isActive ? "text-white italic" : "text-gray-500"
                        }`}>
                          {tab.label}
                        </span>
                        
                        {isActive && (
                          <motion.div 
                            layoutId="mobileActiveDot"
                            className="absolute right-4 w-1 h-3 rounded-full bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-purple-500/10">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white active:scale-95 transition-all shadow-lg"
                  >
                    <X size={14} />
                    <span>Exit System</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Sidebar (unchanged from original, but with improvements)
  return (
    <aside 
      className={`h-screen sticky top-0 bg-[#0a0a0a] border-r border-purple-500/20 flex flex-col z-40 transition-all duration-300 ${
        isSidebarCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Sidebar Header */}
      <div className={`p-6 flex items-center justify-between border-b border-purple-500/10 ${isSidebarCollapsed ? "justify-center" : ""}`}>
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? "hidden" : ""}`}>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Control
            </h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Admin Panel</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Sidebar Tabs */}
      <nav 
        className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
        onWheel={(e) => e.stopPropagation()}
      >
        {filteredItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={isSidebarCollapsed ? tab.label : ""}
              className={`relative w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-purple-600/10 text-white shadow-[inset_0_0_20px_rgba(168,85,247,0.05)] border border-purple-500/20"
                  : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-300 border border-transparent"
              } ${isSidebarCollapsed ? "justify-center px-0 w-12 mx-auto" : ""}`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 scale-110" 
                  : "bg-white/5 text-gray-600 group-hover:text-gray-400"
              }`}>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {!isSidebarCollapsed && (
                <span className={`text-[11px] font-black uppercase tracking-[0.1em] transition-colors duration-300 ${
                    isActive ? "text-white italic" : "text-gray-500 group-hover:text-gray-400"
                }`}>
                  {tab.label}
                </span>
              )}
              
              {isActive && !isSidebarCollapsed && (
                <motion.div 
                    layoutId="desktopActiveDot"
                    className="ml-auto w-1 h-3 rounded-full bg-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]" 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-purple-500/10">
        <button
          onClick={logout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white active:scale-95 transition-all shadow-lg ${
            isSidebarCollapsed ? "px-0 w-12 mx-auto" : ""
          }`}
          title={isSidebarCollapsed ? "Exit Dashboard" : ""}
        >
          <X size={12} className="shrink-0" />
          {!isSidebarCollapsed && <span className="transition-opacity duration-300">Exit System</span>}
        </button>
      </div>
      {/* Custom Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.3);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;
