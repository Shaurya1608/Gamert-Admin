// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,            // 🔥 REQUIRED for cookies
});

// ⚡ REQUEST DEDUPLICATION & CACHING
const pendingRequests = new Map();
const responseCache = new Map();
let csrfToken = null; // 🛡️ In-memory CSRF token for cross-domain support

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes default
const CACHEABLE_METHODS = ['GET'];
const CACHE_EXCLUSIONS = [
  '/auth/refresh', '/auth/logout', '/auth/me', '/auth/streak-info', 
  '/api/notifications', '/admin', '/api/admin', '/api/arena', 
  '/api/missions', '/auth/daily-quests', '/api/weekend-missions', 
  '/auth/inventory', '/api/friends', '/api/orders', '/admin-rewards', 
  '/profile/me', '/api/system'
];

const getCacheKey = (config) => {
  const { method, url, params } = config;
  return `${method}:${url}:${JSON.stringify(params || {})}`;
};

const isCacheable = (config) => {
  if (CACHEABLE_METHODS.includes(config.method?.toUpperCase())) {
    const url = config.url || "";
    const isExcluded = CACHE_EXCLUSIONS.some(exclusion => {
        const normalizedExclusion = exclusion.startsWith('/') ? exclusion.slice(1) : exclusion;
        const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
        return normalizedUrl.includes(normalizedExclusion);
    });
    return !isExcluded;
  }
  return false;
};

const getCachedResponse = (key) => {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (import.meta.env.DEV) console.log(`📦 Cache HIT: ${key}`);
    return cached.data;
  }
  if (cached) responseCache.delete(key);
  return null;
};

const setCachedResponse = (key, data) => {
  responseCache.set(key, { data, timestamp: Date.now() });
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
};

api.interceptors.request.use(
  async (config) => {
    const cacheKey = getCacheKey(config);
    if (isCacheable(config)) {
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) {
        return Promise.reject({ config, response: cachedResponse, __fromCache: true });
      }
    }
    if (pendingRequests.has(cacheKey)) {
      if (import.meta.env.DEV) console.log(`🔄 Request DEDUPLICATED: ${cacheKey}`);
      await pendingRequests.get(cacheKey);
      const cachedResponse = getCachedResponse(cacheKey);
      if (cachedResponse) return Promise.reject({ config, response: cachedResponse, __fromCache: true });
      return config;
    }
    const pendingPromise = new Promise((resolve) => { config.__resolvePending = resolve; });
    pendingRequests.set(cacheKey, pendingPromise);

    // 🛡️ CSRF PROTECTION: Add token to mutating requests
    if (["post", "put", "delete", "patch"].includes(config.method?.toLowerCase())) {
        // First priority: In-memory token (Cross-domain safe)
        // Second priority: Document cookie (Same-domain fallback)
        const token = csrfToken || document.cookie
            .split("; ")
            .find((row) => row.startsWith("csrfToken="))
            ?.split("=")[1];
        
        if (token) {
            config.headers["x-csrf-token"] = token;
        }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshTimer = null;
const startTokenRefreshTimer = () => {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    try {
      await api.post("/auth/refresh", {}, { withCredentials: true });
      if (import.meta.env.DEV) console.log("Token refreshed proactively");
      startTokenRefreshTimer();
    } catch (error) {
      console.error("Proactive token refresh failed:", error);
    }
  }, 14 * 60 * 1000);
};

export const startAutoRefresh = () => startTokenRefreshTimer();
export const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    const cacheKey = getCacheKey(response.config);
    if (isCacheable(response.config)) setCachedResponse(cacheKey, response);
    if (response.config.__resolvePending) response.config.__resolvePending();
    pendingRequests.delete(cacheKey);

    // 🛡️ CAPTURE CSRF TOKEN FROM BODY
    if (response.data?.csrfToken) {
        csrfToken = response.data.csrfToken;
    }

    return response;
  },
  async (error) => {
    if (error.__fromCache) return Promise.resolve(error.response);
    const originalRequest = error.config;
    const cacheKey = getCacheKey(originalRequest);
    if (originalRequest?.__resolvePending) originalRequest.__resolvePending();
    pendingRequests.delete(cacheKey);

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh") {
      if (isRefreshing) {
        return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post("/auth/refresh", {}, { withCredentials: true });
        window.dispatchEvent(new CustomEvent("tokens-refreshed"));
        processQueue(null, null);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || "http://localhost:5173";
        window.location.href = `${mainSiteUrl}/auth/login?redirect=${encodeURIComponent(window.location.origin)}`;
        return Promise.reject(refreshError);
      }
    }
    // 🛡️ HANDLE CSRF FAILURES (Try once to refresh token)
    if (error.response?.data?.code === "CSRF_ERROR" && !originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;
        try {
            await api.get("/auth/csrf-token");
            return api(originalRequest);
        } catch (csrfErr) {
            return Promise.reject(csrfErr);
        }
    }

    return Promise.reject(error);
  }
);

export default api;
