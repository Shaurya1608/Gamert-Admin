// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../services/api";
import socketService from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async (retryCount = 0) => {
    const maxRetries = 2;
    const retryDelay = 2000; 

    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      if (err.response?.status === 401 && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchUser(retryCount + 1);
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      if (retryCount === 0 || retryCount === maxRetries) {
        setLoading(false);
      }
    }
  }, []);

  const refreshUser = useCallback(async (providedUser = null) => {
    if (providedUser) {
        setUser(providedUser);
        setIsAuthenticated(true);
        return;
    }
    try {
      const res = await api.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Profile refresh failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API call failed", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || "http://localhost:5173";
      window.location.href = mainSiteUrl;
    }
  }, []);

  const updateUser = useCallback((newData) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...newData };
    });
  }, []);

  useEffect(() => {
    // 🛡️ INITIALIZE CSRF TOKEN (Safe for cross-domain)
    const initCsrf = async () => {
        try {
            await api.get("/auth/csrf-token");
        } catch (err) {
            console.warn("CSRF Initialization failed. Mutating requests might fail.", err);
        }
    };
    initCsrf();

    fetchUser();
    
    const handleProfileRefresh = () => refreshUser();
    window.addEventListener("profileRefresh", handleProfileRefresh);

    const userId = user?._id || user?.id;
    if (userId) {
        socketService.connect();
        socketService.joinUserRoom(String(userId));

        const handleWalletUpdate = (data) => {
            if (data) {
                updateUser(data);
                setTimeout(refreshUser, 1000);
            }
        };

        socketService.on("wallet_update", handleWalletUpdate);
        
        return () => {
            window.removeEventListener("profileRefresh", handleProfileRefresh);
            socketService.off("wallet_update", handleWalletUpdate);
        };
    }

    return () => window.removeEventListener("profileRefresh", handleProfileRefresh);
  }, [fetchUser, refreshUser, user?._id, user?.id, updateUser]);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, refreshUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
