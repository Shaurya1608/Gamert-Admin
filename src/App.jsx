// src/App.jsx
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";
import { ReAuthProvider } from "./contexts/ReAuthContext";

const AdminPage = lazy(() => import("./pages/AdminPage"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <p className="text-purple-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Initializing Protocol...</p>
    </div>
  </div>
);

const App = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) {
    const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || "http://localhost:5173";
    window.location.href = `${mainSiteUrl}/auth/login?redirect=${encodeURIComponent(window.location.origin)}`;
    return null;
  }

  // Double check role
  if (user.role !== 'admin' && user.role !== 'moderator') {
    const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || "http://localhost:5173";
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-4">
                <h1 className="text-2xl font-black text-red-500 italic uppercase italic">Access Denied</h1>
                <p className="text-gray-400 text-sm">Your protocol clearance does not allow access to this terminal.</p>
                <button 
                  onClick={() => window.location.href = mainSiteUrl}
                  className="px-6 py-2 bg-red-600 rounded-lg text-xs font-black uppercase"
                >
                    Return to Base
                </button>
            </div>
        </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.1em"
          },
        }}
      />
      
      <ReAuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ReAuthProvider>
    </>
  );
};

export default App;
