import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BarChart3,
  Users,
  Lock,
  Settings,
  Flag,
  Gamepad2,
  Gift,
  Grid,
  MessageSquare,
  Flame,
  Ban,
  ShoppingBag,
  CreditCard,
  Gem,
  Sparkles,
  Trophy,
  ShieldAlert
} from "lucide-react";

import api from "../services/api";
import { getAvatarUrl } from "../utils/avatarUtils";
import "../styles/admin-responsive.css";
import { useAuth } from "../contexts/AuthContext";

// Extracted Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import UserManagement from "../components/admin/UserManagement";
import PermissionsManagement from "../components/admin/PermissionsManagement";
import SettingsManagement from "../components/admin/SettingsManagement";
import MissionsManagement from "../components/admin/MissionsManagement";
import GamesManagement from "../components/admin/GamesManagement";
import RewardsManagement from "../components/admin/RewardsManagement";
import CategoryManagement from "../components/admin/CategoryManagement";
import CommunityManagement from "../components/admin/CommunityManagement";
import ModerationManagement from "../components/admin/ModerationManagement";
import HeroManagement from "../components/admin/HeroManagement";
import OrdersManagement from "../components/admin/OrdersManagement";
import PassManagement from "../components/admin/PassManagement";
import GemManagement from "../components/admin/GemManagement";
import SeasonManagement from "../components/admin/SeasonManagement";
import SecurityManagement from "../components/admin/SecurityManagement";
import GlobalSessionMonitor from "../components/admin/GlobalSessionMonitor";

// Modals
import MissionModal from "../components/admin/MissionModal";
import RewardModal from "../components/admin/RewardModal";
import CategoryModal from "../components/admin/CategoryModal";
import CommunityModal from "../components/admin/CommunityModal";
import HeroSlideModal from "../components/admin/HeroSlideModal";
import PermissionModal from "../components/admin/PermissionModal";
import BanModal from "../components/admin/BanModal";
import ConfirmationModal from "../components/admin/ConfirmationModal";
import GemModal from "../components/admin/GemModal";
import SeasonRewardModal from "../components/admin/SeasonRewardModal";



const toLocalDateTimeInput = (dateString = new Date()) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const local = new Date(date.getTime() - offset);
    return local.toISOString().slice(0, 16);
};

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get active tab from URL or fallback to null (Initialization logic will handle default)
  const activeTab = searchParams.get("tab");
  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- States ---
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActions, setLoadingActions] = useState({}); // Track loading state for specific actions per user
  
  // Users State
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Missions State
  const [missions, setMissions] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [creatingMission, setCreatingMission] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [missionForm, setMissionForm] = useState({
    title: "",
    gameId: "",
    minScore: "",
    minTime: 0,
    rewardGtc: "",
    entryFeeTickets: 0,
    maxAttempts: 5,
    startsAt: toLocalDateTimeInput(),
    expiresAt: toLocalDateTimeInput(new Date(Date.now() + 72 * 60 * 60 * 1000)),
    image: "",
    imageFile: null,
    imagePreview: null,
    isTrending: false,
    missionType: "regular",
    rewardLoyalty: 0,
    aspect: "landscape", // Added for aspect ratio fix
    // Weekend Mission Specifics
    targetMissions: 50,
    baseGems: 10,
    capGems: 30,
    perMissionGems: 1
  });


  // Games State
  const [games, setGames] = useState([]);

  // Rewards State
  const [rewards, setRewards] = useState([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [rewardForm, setRewardForm] = useState({
    title: "",
    description: "",
    priceDiamonds: "",
    stock: "",
    category: "Daily",
    image: null,
  });

  // Categories State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    order: 0,
    image: null,
    imagePreview: null,
  });

  // Communities State
  const [communitiesArr, setCommunitiesArr] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [communityForm, setCommunityForm] = useState({
    name: "",
    description: "",
    icon: "",
    imageFile: null,
    iconPreview: null,
  });

  // Moderation State
  const [modUsers, setModUsers] = useState([]);
  const [loadingMod, setLoadingMod] = useState(false);
  const [modSearch, setModSearch] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const [banForm, setBanForm] = useState({
    userId: "",
    username: "",
    banExpires: "",
    banReason: "Violation of Protocol",
  });

  // Hero Swiper State
  const [heroSlides, setHeroSlides] = useState([]);
  const [loadingHero, setLoadingHero] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editingHero, setEditingHero] = useState(null);
  const [heroForm, setHeroForm] = useState({
    titleTop: "",
    titleBottom: "",
    description: "",
    cta: "Explore Now",
    badge: "",
    participants: "0",
    order: 0,
    isActive: true,
    image: "",
    imageFile: null,
    imagePreview: null,
  });

  // Gems State
  const [gemPackages, setGemPackages] = useState([]);
  const [loadingGems, setLoadingGems] = useState(false);
  const [showGemModal, setShowGemModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    gemAmount: 100,
    priceInr: 400,
    showDiscount: false,
    discountTag: "",
    isActive: true,
    displayOrder: 0
  });

  // Season Rewards State
  const [seasonRewards, setSeasonRewards] = useState([]);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [editingSeasonReward, setEditingSeasonReward] = useState(null);
  const [seasonForm, setSeasonForm] = useState({
    level: 1,
    free: { diamonds: 0, gtc: 0 },
    elite: { diamonds: 0, gtc: 0 },
    isMilestone: false
  });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    type: "danger",
    onConfirm: null,
  });

  // --- Effects ---

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, roles: ["admin", "moderator"], requiredPermission: "view_analytics" },
    { id: "security", label: "Security", icon: ShieldAlert, roles: ["admin"], requiredPermission: "manage_settings" },
    { id: "global-pulse", label: "Global Pulse", icon: ShieldAlert, roles: ["admin"], requiredPermission: "manage_sessions" },
    { id: "users", label: "User Management", icon: Users, roles: ["admin", "moderator"], requiredPermission: "manage_users" },
    { id: "permissions", label: "Permissions", icon: Lock, roles: ["admin", "moderator"], requiredPermission: "manage_users" },
    { id: "settings", label: "Settings", icon: Settings, roles: ["admin", "moderator"], requiredPermission: "manage_settings" },
    { id: "missions", label: "Missions", icon: Flag, roles: ["admin", "moderator"], requiredPermission: ["manage_missions", "manage_weekend_missions"] },
    { id: "games", label: "Games", icon: Gamepad2, roles: ["admin", "moderator"], requiredPermission: "manage_games" },
    { id: "rewards", label: "Rewards", icon: Gift, roles: ["admin", "moderator"], requiredPermission: "manage_rewards" },
    { id: "categories", label: "Categories", icon: Grid, roles: ["admin", "moderator"], requiredPermission: "manage_games" },
    { id: "communities", label: "Communities", icon: MessageSquare, roles: ["admin", "moderator"], requiredPermission: "moderate_chat" },
    { id: "hero", label: "Hero Swiper", icon: Flame, roles: ["admin", "moderator"], requiredPermission: "manage_content" },
    { id: "orders", label: "Orders", icon: ShoppingBag, roles: ["admin", "moderator"], requiredPermission: "manage_orders" },
    { id: "passes", label: "Pass Management", icon: CreditCard, roles: ["admin", "moderator"], requiredPermission: "manage_payments" },
    { id: "gems", label: "Gem Hub", icon: Gem, roles: ["admin", "moderator"], requiredPermission: "manage_payments" },
    { id: "season_rewards", label: "Season Hub", icon: Trophy, roles: ["admin", "moderator"], requiredPermission: "manage_rewards" },
    { id: "moderation", label: "Moderation", icon: Ban, roles: ["admin", "moderator"], requiredPermission: "moderate_content" },
  ];

  // Auto-redirect if tab is restricted
  useEffect(() => {
    if (user) {
        const hasAccess = (item) => {
            if (user.role === "admin") return true;
            const itemPerms = Array.isArray(item.requiredPermission) ? item.requiredPermission : [item.requiredPermission];
            return item.roles.includes(user.role) && 
                   (!item.requiredPermission || itemPerms.some(p => user.permissions?.includes(p)));
        };

        const allowedTabs = sidebarItems
            .filter(hasAccess)
            .map(item => item.id);
            
        // If activeTab is null or not allowed, set to the first allowed tab
        if (!activeTab || !allowedTabs.includes(activeTab)) {
            if (allowedTabs.length > 0) {
                // Prioritize "dashboard" or the first allowed tab
                const defaultTab = allowedTabs.includes("dashboard") ? "dashboard" : allowedTabs[0];
                setActiveTab(defaultTab);
            } else {
                navigate("/");
            }
        }
    }
  }, [user, activeTab, navigate]);

  // Auth fetch removed as it's handled by AuthContext


  // Tab change феtchers
  useEffect(() => {
    if (!user || !activeTab) return;

    const currentItem = sidebarItems.find(item => item.id === activeTab);
    const itemPerms = currentItem && (Array.isArray(currentItem.requiredPermission) ? currentItem.requiredPermission : [currentItem.requiredPermission]);
    const hasPermission = user.role === "admin" || (currentItem && (!currentItem.requiredPermission || itemPerms.some(p => user.permissions?.includes(p))));

    if (!hasPermission) return;

    if (activeTab === "dashboard") {
      fetchStats();
      fetchActivityLogs();
      fetchAnalytics();
    }
    if (activeTab === "users") fetchUsers();
    if (activeTab === "missions") {
        fetchMissions();
        fetchCategories();
        fetchGames();
    }
    if (activeTab === "games") {
        fetchGames();
        fetchCategories();
    }
    if (activeTab === "rewards") fetchRewards();
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "communities") fetchCommunitiesAdmin();
    if (activeTab === "moderation") fetchModerationUsers();
    if (activeTab === "hero") fetchHeroSlides();
    if (activeTab === "gems") fetchGemPackagesAdmin();
    if (activeTab === "season_rewards") fetchSeasonRewardsAdmin();
  }, [activeTab, searchQuery, pagination?.page, user]);

  // --- API Functions ---

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/stats");
      if (response.data.success) setStats(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await api.get("/admin/logs?limit=5");
      if (response.data.success) setActivityLogs(response.data.data || []);
    } catch (error) {
      console.error("Logs fetch error:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics");
      if (res.data.success) setAnalyticsData(res.data.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    }
  };

  // Handle Google OAuth re-authentication success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('oauth') === 'success') {
      toast.success("IDENTITY VERIFIED. ACCESS GRANTED.");
      
      // 🚀 Check for pending action to auto-resume
      const pendingAction = localStorage.getItem('pendingAdminAction');
      if (pendingAction) {
        try {
          const action = JSON.parse(pendingAction);
          localStorage.removeItem('pendingAdminAction');
          
          // Only resume if action is recent (within 10 minutes)
          const isRecent = action.timestamp && (Date.now() - action.timestamp < 10 * 60 * 1000);
          
          if (isRecent && action.type === 'DELETE_USER' && action.payload) {
             const toastId = toast.loading("Resuming deletion protocol...");
             executeUserDeletion(action.payload, toastId);
          }
        } catch (e) {
          console.error("Failed to parse pending action:", e);
        }
      }

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (urlParams.get('error') === 'reauth_mismatch') {
      toast.error("IDENTITY MISMATCH: Please sign into the SAME Google account used for your current session.");
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users", {
        params: { page: pagination.page, limit: 10, search: searchQuery },
      });
      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination || { page: 1, pages: 1 });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (permissionId) => {
    if (!selectedUser) return;
    try {
      const updatedPermissions = selectedUser.permissions.includes(permissionId)
        ? selectedUser.permissions.filter((p) => p !== permissionId)
        : [...selectedUser.permissions, permissionId];
      const response = await api.put(
        `/admin/users/${selectedUser._id}/permissions`,
        { permissions: updatedPermissions }
      );
      if (response.data.success) {
        setSelectedUser(response.data.data);
        setUsers(users.map((u) => (u._id === selectedUser._id ? response.data.data : u)));
        toast.success("Permission updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update permission");
    }
  };

  const executeUserDeletion = async (userId, existingToastId = null) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        if (existingToastId) {
          toast.success("Identity verified. User deleted successfully.", { id: existingToastId });
        } else {
          toast.success("User deleted successfully");
        }
      }
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.code === "REAUTH_REQUIRED") {
        localStorage.setItem('pendingAdminAction', JSON.stringify({
          type: 'DELETE_USER',
          payload: userId,
          timestamp: Date.now()
        }));
      }

      const message = error.response?.data?.message || "Failed to delete user";
      if (existingToastId) {
        toast.error(message, { id: existingToastId });
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete User?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: () => executeUserDeletion(userId)
    });
  };

  const handleRoleChange = (userId, newRole) => {
    setConfirmModal({
      isOpen: true,
      title: "Update User Role?",
      message: `Are you sure you want to change this user's role to ${newRole.toUpperCase()}? This will update their permissions immediately.`,
      confirmText: "Update Role",
      type: "warning",
      onConfirm: async () => {
        try {
          setLoadingActions(prev => ({ ...prev, [userId]: true }));
          const response = await api.put(
            `/admin/users/${userId}/role`,
            { role: newRole }
          );
          if (response.data.success) {
            setUsers(users.map((u) => (u._id === userId ? response.data.data : u)));
            if (selectedUser?._id === userId) setSelectedUser(response.data.data);
            toast.success("Role updated successfully");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update role");
        } finally {
          setLoadingActions(prev => ({ ...prev, [userId]: false }));
        }
      }
    });
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (newStatus === "banned") {
      const targetUser = users.find(u => u._id === userId);
      setBanForm({ userId, username: targetUser?.username || "User", banExpires: "", banReason: "Violation of Protocol" });
      setShowBanModal(true);
      return;
    }
    try {
      const response = await api.put(
        `/admin/users/${userId}/status`,
        { status: newStatus }
      );
      if (response.data.success) {
        setUsers(users.map((u) => (u._id === userId ? response.data.data : u)));
        if (selectedUser?._id === userId) setSelectedUser(response.data.data);
        toast.success(`User status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const toggleUserBan = async (userId, type, currentValue) => {
    // 🛡️ Helper function to execute the API call
    const executeToggle = async () => {
        try {
            let endpoint = "";
            let data = {};

            if (type === "isBanned") {
                endpoint = `/admin/users/${userId}/status`;
                data = { status: "active" };
            } else if (type === "chatBan") {
                endpoint = `/admin/users/${userId}/chat-ban`;
                data = { chatBan: !currentValue };
            } else if (type === "joinBan") {
                endpoint = `/admin/users/${userId}/join-ban`;
                data = { joinBan: !currentValue };
            }

            // set local loading state for immediate feedback if needed, 
            // but relying on AdminPage's global loading/toast is usually enough.
            // However, UserManagement has local loading state 'toggleLoading'.
            // The prop passed down is 'toggleUserBan'.
            
            const response = await api.put(endpoint, data);
            if (response.data.success) {
                // FORCE UPDATE STATE properly
                const updatedUser = response.data.data;
                setUsers(prevUsers => prevUsers.map(u => u._id === userId ? updatedUser : u));
                if (selectedUser && selectedUser._id === userId) {
                    setSelectedUser(updatedUser);
                }
                toast.success("Protocol updated successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
            // If failed, we might want to revert the toggle in UI if we were optimistic, 
            // but here we didn't optimistic update.
        }
    };

    if (type === "isBanned" && !currentValue) {
        // 🛑 BANNING FLOW (Special Modal)
        const targetUser = users.find(u => u._id === userId);
        setBanForm({ userId, username: targetUser?.username || "User", banExpires: "", banReason: "Violation of Protocol" });
        setShowBanModal(true);
        return;
    }

    // 🛑 CONFIRMATION FLOW for Unban, Chat Ban, Join Ban
    const actionLabel = 
        type === "isBanned" ? "Restore Global Access" :
        type === "chatBan" ? (!currentValue ? "Revoke Chat Rights" : "Restore Chat Rights") :
        (!currentValue ? "Revoke Protocol Entry" : "Restore Protocol Entry");

    setConfirmModal({
      isOpen: true,
      title: `${actionLabel}?`,
      message: `Are you sure you want to perform this action on this user?`,
      confirmText: "Confirm",
      type: !currentValue ? "danger" : "warning", // Red for banning/revoking, Orange for restoring
      onConfirm: executeToggle
    });
  };


  const confirmToggleBan = async () => {
    try {
      setLoading(true);
      const response = await api.put(
        `/admin/users/${banForm.userId}/status`,
        { status: "banned", banExpires: banForm.banExpires || null, banReason: banForm.banReason }
      );
      if (response.data.success) {
        // FORCE UPDATE STATE properly (Functional Update)
        const updatedUser = response.data.data;
        setUsers(prevUsers => prevUsers.map((u) => (u._id === banForm.userId ? updatedUser : u)));
        
        // Also update selectedUser if it's the one being banned
        if (selectedUser && selectedUser._id === banForm.userId) {
            setSelectedUser(updatedUser);
        }
        
        setShowBanModal(false);
        toast.success(`Protocol Terminated: ${banForm.username} has been banned.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to ban user");
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/games", {
        params: { page: pagination.page, limit: 12 }
      });
      if (res.data.success) {
        setGames(res.data.games);
        setPagination(res.data.pagination || { page: 1, pages: 1 });
      }
    } catch (err) {
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const toggleGameVisibility = async (id, current) => {
    try {
      await api.put(`/admin/games/${id}`, { isVisible: !current });
      toast.success("Game visibility updated");
      fetchGames();
    } catch {
      toast.error("Update failed");
    }
  };

  const toggleHomeGame = async (id, current) => {
    try {
      await api.put(`/admin/games/${id}/home`, { onHomePage: !current });
      toast.success("Homepage status updated");
      fetchGames();
    } catch {
      toast.error("Update failed");
    }
  };

  const fetchMissions = async () => {
    try {
      setMissionsLoading(true);
      const [regularRes, weekendRes] = await Promise.all([
          api.get("/admin-missions/missions"),
          api.get("/api/weekend-missions")
      ]);
      
      const regularMissions = regularRes.data.missions || [];
      const weekendMissions = (weekendRes.data.missions || []).map(m => ({
          ...m,
          missionType: 'weekend',
          isActive: m.status === 'active',
          rewardGtc: m.rewardConfig?.capGems || 0, // Using cap as "Payout" for display parity
          minScore: m.targetMissions
      }));
      
      setMissions([...regularMissions, ...weekendMissions]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load missions");
    } finally {
      setMissionsLoading(false);
    }
  };

  const handleCreateNewMission = () => {
    setEditingMission(null);
    setMissionForm({
        title: "",
        gameId: "",
        minScore: "",
        rewardGtc: "",
        entryFeeTickets: 0,
        maxAttempts: 5,
        startsAt: toLocalDateTimeInput(),
        expiresAt: toLocalDateTimeInput(new Date(Date.now() + 72 * 60 * 60 * 1000)),
        image: "",
        imageFile: null,
        imagePreview: null,
        isTrending: false,
        missionType: "regular",
        rewardLoyalty: 0,
        aspect: "landscape",
        targetMissions: 50,
        baseGems: 10,
        capGems: 30,
        perMissionGems: 1
    });
    setShowCreateMission(true);
  };

  const disableMission = async (id, type) => {
    setConfirmModal({
      isOpen: true,
      title: "Disable Mission?",
      message: "This will hide the mission from users.",
      confirmText: "Disable",
      type: "warning",
      onConfirm: async () => {
        try {
          if (type === 'weekend') {
            await api.patch(`/api/weekend-missions/${id}/status`, { status: "pending" });
          } else {
            await api.patch(`/admin-missions/missions/${id}/disable`);
          }
          toast.success("Mission disabled");
          fetchMissions();
        } catch {
          toast.error("Failed to disable mission");
        }
      }
    });
  };

  const enableMission = async (id, type) => {
      try {
          if (type === 'weekend') {
            await api.patch(`/api/weekend-missions/${id}/status`, { status: "active" });
          } else {
            await api.patch(`/admin-missions/missions/${id}/enable`);
          }
          toast.success("Mission enabled");
          fetchMissions();
      } catch {
          toast.error("Failed to enable mission");
      }
  };

  const deleteMission = async (id, type) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Mission?",
      message: "This will permanently remove the mission.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          if (type === 'weekend') {
               await api.delete(`/api/weekend-missions/${id}`);
               toast.success("Weekend Mission deleted");
               fetchMissions();
          } else {
              await api.delete(`/admin-missions/missions/${id}`);
              toast.success("Mission deleted");
              fetchMissions();
          }
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  const handleMissionChange = (e) => {
    const { name, value } = e.target;
    setMissionForm(prev => ({ ...prev, [name]: value }));
  };

  const submitMission = async () => {
    try {
        setCreatingMission(true);

        if (missionForm.missionType === 'weekend') {
            const formData = new FormData();
            formData.append('title', missionForm.title);
            formData.append('targetMissions', parseInt(missionForm.targetMissions || 50));
            formData.append('startsAt', new Date(missionForm.startsAt).toISOString());
            formData.append('expiresAt', new Date(missionForm.expiresAt).toISOString());
            
            const rewardConfig = {
                baseGems: parseInt(missionForm.baseGems || 10),
                perMissionGems: parseInt(missionForm.perMissionGems || 1),
                capGems: parseInt(missionForm.capGems || 30)
            };
            formData.append('rewardConfig', JSON.stringify(rewardConfig));
            formData.append('description', `Weekend Squad Mission: ${missionForm.title}`);
            
            if (missionForm.imageFile) {
                formData.append('image', missionForm.imageFile);
            }
            
            if (editingMission) {
                 await api.put(`/api/weekend-missions/${editingMission._id}`, formData);
                 toast.success("Weekend Mission Updated!");
            } else {
                 await api.post("/api/weekend-missions", formData);
                 toast.success("Weekend Mission Activated!");
            }

        } else {
            const formData = new FormData();
            Object.keys(missionForm).forEach(key => {
                if (key === 'startsAt' || key === 'expiresAt') {
                    if (missionForm[key]) formData.append(key, new Date(missionForm[key]).toISOString());
                } else if (!['imagePreview', 'image', 'imageFile', 'targetMissions', 'baseGems', 'capGems', 'perMissionGems'].includes(key)) {
                    formData.append(key, missionForm[key]);
                }
            });
            if (missionForm.imageFile) formData.append("image", missionForm.imageFile);

            if (editingMission) await api.put(`/admin-missions/missions/${editingMission._id}`, formData);
            else await api.post("/admin-missions/missions", formData);
            toast.success("Mission saved");
        }

        setShowCreateMission(false);
        setEditingMission(null);
        fetchMissions(); 
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save mission");
    } finally {
      setCreatingMission(false);
    }
  };

  const fetchRewards = async () => {
    try {
      setLoadingRewards(true);
      const res = await api.get("/admin-rewards", {
        params: { page: pagination.page, limit: 12 }
      });
      if (res.data.success) {
        setRewards(res.data.rewards);
        // We might want separate pagination state if switching tabs rapidly, 
        // but for now let's sync with the global pagination state.
        setPagination(res.data.pagination || { page: 1, pages: 1 });
      }
    } catch (err) {
      toast.error("Failed to load rewards");
    } finally {
      setLoadingRewards(false);
    }
  };

  const handleToggleReward = async (id) => {
    try {
      await api.patch(`/admin-rewards/${id}/toggle`);
      toast.success("Reward status updated");
      fetchRewards();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteReward = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Reward?",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/admin-rewards/${id}`);
          toast.success("Reward deleted");
          fetchRewards();
        } catch (err) {
          toast.error("Failed to delete reward");
        }
      }
    });
  };

  const submitReward = async () => {
    const formData = new FormData();
    Object.keys(rewardForm).forEach(key => {
        if (!['imagePreview', 'imageFile'].includes(key) && rewardForm[key] !== null) {
            formData.append(key, rewardForm[key]);
        }
    });
    if (rewardForm.imageFile) formData.append("image", rewardForm.imageFile);
    try {
      setLoading(true);
      if (editingReward) await api.put(`/admin-rewards/${editingReward._id}`, formData);
      else await api.post("/admin-rewards", formData);
      toast.success("Reward saved");
      setShowRewardModal(false);
      fetchRewards();
    } catch (err) {
      toast.error("Failed to save reward");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await api.get("/api/categories");
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const submitCategory = async () => {
    const formData = new FormData();
    formData.append("name", categoryForm.name);
    formData.append("order", categoryForm.order);
    if (categoryForm.image) formData.append("image", categoryForm.image);
    try {
      setLoading(true);
      if (editingCategory) await api.put(`/api/categories/${editingCategory._id}`, formData);
      else await api.post("/api/categories", formData);
      toast.success("Category saved");
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Category?",
      message: "This will permanently remove the category.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/api/categories/${id}`);
          toast.success("Category deleted");
          fetchCategories();
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  const fetchCommunitiesAdmin = async () => {
    try {
      setLoadingCommunities(true);
      const res = await api.get("/api/chat/communities");
      if (res.data.success) setCommunitiesArr(res.data.communities);
    } catch (err) {
      toast.error("Failed to load communities");
    } finally {
      setLoadingCommunities(false);
    }
  };

  const submitCommunity = async () => {
    try {
      setLoading(true);
      const slug = communityForm.name.toLowerCase().replace(/\s+/g, "-");
      const payload = {
        name: communityForm.name,
        description: communityForm.description,
        slug,
        icon: communityForm.icon || getAvatarUrl(communityForm.name)
      };
      await api.post("/api/chat/communities", payload);
      toast.success("Community created");
      setShowCommunityModal(false);
      fetchCommunitiesAdmin();
    } catch (err) {
      toast.error("Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  const deleteCommunityAdmin = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Community?",
      message: "This will permanently remove the community.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/admin/chat/community/${id}`);
          toast.success("Community deleted");
          fetchCommunitiesAdmin();
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };



  const fetchModerationUsers = async () => {
    try {
      setLoadingMod(true);
      const res = await api.get("/admin/chat/users");
      if (res.data.success) setModUsers(res.data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoadingMod(false);
    }
  };

  const fetchHeroSlides = async () => {
    try {
      setLoadingHero(true);
      const res = await api.get("/admin/hero-slides");
      if (res.data.success) setHeroSlides(res.data.slides);
    } catch (err) {
      toast.error("Failed to load slides");
    } finally {
      setLoadingHero(false);
    }
  };

  const submitHeroSlide = async () => {
    const formData = new FormData();
    Object.keys(heroForm).forEach(key => {
        if (!['imagePreview', 'image', 'imageFile'].includes(key) && heroForm[key] !== null) {
            formData.append(key, heroForm[key]);
        }
    });
    if (heroForm.imageFile) formData.append("image", heroForm.imageFile);
    try {
      setLoading(true);
      if (editingHero) await api.put(`/admin/hero-slides/${editingHero._id}`, formData);
      else await api.post("/admin/hero-slides", formData);
      toast.success("Slide saved");
      setShowHeroModal(false);
      fetchHeroSlides();
    } catch (err) {
      toast.error("Failed to save slide");
    } finally {
      setLoading(false);
    }
  };

  const deleteHeroSlide = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Slide?",
      message: "This action is permanent.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/admin/hero-slides/${id}`);
          toast.success("Slide deleted");
          fetchHeroSlides();
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  const fetchGemPackagesAdmin = async () => {
    try {
      setLoadingGems(true);
      const res = await api.get("/admin/gem-packages");
      if (res.data.success) setGemPackages(res.data.packages);
    } catch (err) {
      toast.error("Failed to load gem packages");
    } finally {
      setLoadingGems(false);
    }
  };

  const submitGemPackage = async () => {
    try {
      setLoading(true);
      if (editingPackage) {
        await api.put(`/admin/gem-packages/${editingPackage._id}`, packageForm);
        toast.success("Package updated");
      } else {
        await api.post("/admin/gem-packages", packageForm);
        toast.success("Package created");
      }
      setShowGemModal(false);
      fetchGemPackagesAdmin();
    } catch (err) {
      toast.error("Failed to save gem package");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGemPackage = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Package?",
      message: "Users will no longer be able to purchase this infusion.",
      confirmText: "Delete",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/admin/gem-packages/${id}`);
          toast.success("Package deleted");
          fetchGemPackagesAdmin();
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  const toggleGemPackageStatus = async (id, current) => {
    try {
      await api.put(`/admin/gem-packages/${id}`, { isActive: !current });
      toast.success("Status updated");
      fetchGemPackagesAdmin();
    } catch {
      toast.error("Toggle failed");
    }
  };

  const fetchSeasonRewardsAdmin = async () => {
    try {
      setLoadingSeason(true);
      const res = await api.get("/admin/season-rewards");
      if (res.data.success) setSeasonRewards(res.data.rewards);
    } catch {
      toast.error("Failed to load season rewards");
    } finally {
      setLoadingSeason(false);
    }
  };

  const submitSeasonReward = async () => {
    try {
      setLoading(true);
      await api.put("/admin/season-rewards", seasonForm);
      toast.success("Season protocol updated");
      setShowSeasonModal(false);
      fetchSeasonRewardsAdmin();
    } catch (err) {
      toast.error("Protocol update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeasonReward = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Remove Reward Tier?",
      message: "Operatives will lose access to this level extraction.",
      confirmText: "Remove",
      type: "danger",
      onConfirm: async () => {
        try {
          await api.delete(`/admin/season-rewards/${id}`);
          toast.success("Tier removed");
          fetchSeasonRewardsAdmin();
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  // --- Helpers ---

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const allPermissions = [
    { id: "view_analytics", label: "View Analytics", description: "Access metrics and performance logs" },
    { id: "manage_users", label: "Manage Users", description: "Identity control & user management" },
    { id: "manage_settings", label: "Manage Settings", description: "Control system & platform settings" },
    { id: "manage_missions", label: "Manage Missions", description: "Control missions & quest content" },
    { id: "manage_weekend_missions", label: "Manage Squad Missions", description: "Control weekend squad missions & tactical specs" },
    { id: "manage_games", label: "Manage Games", description: "Control games & categories" },
    { id: "manage_rewards", label: "Manage Rewards", description: "Control shop items & season hub" },
    { id: "manage_hero", label: "Manage Hero", description: "Control hero swiper & featured content" },
    { id: "manage_payments", label: "Manage Payments", description: "Control orders, passes & gems" },
    { id: "moderate_chat", label: "Moderate Chat", description: "Control chat access & communities" },
    { id: "manage_sessions", label: "Manage Sessions", description: "God View: Monitor and terminate global pulses" },
  ];

  const roles = [
    { id: "admin", label: "Admin", color: "bg-red-500/20 text-red-400" },
    { id: "moderator", label: "Moderator", color: "bg-blue-500/20 text-blue-400" },
    { id: "user", label: "User", color: "bg-green-500/20 text-green-400" },
  ];

  // --- Rendering ---

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row relative">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        sidebarItems={sidebarItems}
        navigate={navigate}
        logout={logout}
      />

      <main className="flex-1 relative bg-black overflow-x-hidden">
        <div className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-h-screen">
            <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                    <AdminDashboard
                      stats={stats}
                      analyticsData={analyticsData}
                      activityLogs={activityLogs}
                      formatDate={formatDate}
                      setActiveTab={setActiveTab}
                      setShowCreateMission={handleCreateNewMission}
                    />
                )}
                {activeTab === "users" && (
                    <UserManagement
                      loading={loading}
                      users={users}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      pagination={pagination}
                      setPagination={setPagination}
                      handleRoleChange={handleRoleChange}
                      handleStatusChange={handleStatusChange}
                      handleDeleteUser={handleDeleteUser}
                      setSelectedUser={setSelectedUser}
                      setShowPermissionModal={setShowPermissionModal}
                      roles={roles}
                      formatDate={formatDate}
                      toggleUserBan={toggleUserBan}
                      loadingActions={loadingActions}
                      currentUser={user}
                    />
                )}
                {activeTab === "permissions" && (
                  <PermissionsManagement allPermissions={allPermissions} />
                )}
                {activeTab === "settings" && (
                  <SettingsManagement />
                )}
                {activeTab === "missions" && (
                  <MissionsManagement
                    missions={missions}
                    missionsLoading={missionsLoading}
                    setShowCreateMission={setShowCreateMission}
                    setEditingMission={setEditingMission}
                    setMissionForm={setMissionForm}
                    toLocalDateTimeInput={toLocalDateTimeInput}
                    enableMission={enableMission}
                    disableMission={disableMission}
                    deleteMission={deleteMission}
                  />
                )}
                {activeTab === "games" && (
                  <GamesManagement
                    games={games}
                    categories={categories}
                    fetchGames={fetchGames}
                    toggleGameVisibility={toggleGameVisibility}
                    toggleHomeGame={toggleHomeGame}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                )}
                {activeTab === "rewards" && (
                  <RewardsManagement
                    rewards={rewards}
                    loadingRewards={loadingRewards}
                    setEditingReward={setEditingReward}
                    setRewardForm={setRewardForm}
                    setShowRewardModal={setShowRewardModal}
                    handleDeleteReward={handleDeleteReward}
                    handleToggleReward={handleToggleReward}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                )}
                {activeTab === "categories" && (
                  <CategoryManagement
                    categories={categories}
                    loadingCategories={loadingCategories}
                    setShowCategoryModal={setShowCategoryModal}
                    setEditingCategory={setEditingCategory}
                    setCategoryForm={setCategoryForm}
                    handleDeleteCategory={handleDeleteCategory}
                  />
                )}
                {activeTab === "communities" && (
                  <CommunityManagement
                    communitiesArr={communitiesArr}
                    deleteCommunityAdmin={deleteCommunityAdmin}
                    setShowCommunityModal={setShowCommunityModal}
                  />
                )}
                {activeTab === "moderation" && (
                  <ModerationManagement
                    modUsers={modUsers}
                    modSearch={modSearch}
                    setModSearch={setModSearch}
                    toggleUserBan={toggleUserBan}
                  />
                )}
                {activeTab === "hero" && (
                  <HeroManagement
                    heroSlides={heroSlides}
                    loadingHero={loadingHero}
                    setShowHeroModal={setShowHeroModal}
                    setEditingHero={setEditingHero}
                    setHeroForm={setHeroForm}
                    deleteHeroSlide={deleteHeroSlide}
                  />
                )}
                {activeTab === "orders" && <OrdersManagement />}
                {activeTab === "passes" && <PassManagement />}
                {activeTab === "gems" && (
                   <GemManagement
                      packages={gemPackages}
                      loading={loadingGems}
                      setShowModal={setShowGemModal}
                      setEditingPackage={setEditingPackage}
                      setPackageForm={setPackageForm}
                      onEdit={(pkg) => {
                        setEditingPackage(pkg);
                        setPackageForm({ 
                          name: pkg.name, 
                          description: pkg.description, 
                          gemAmount: pkg.gemAmount, 
                          priceInr: pkg.priceInr, 
                          showDiscount: pkg.showDiscount || false,
                          discountTag: pkg.discountTag || "",
                          isActive: pkg.isActive, 
                          displayOrder: pkg.displayOrder 
                        });
                        setShowGemModal(true);
                      }}
                      onDelete={handleDeleteGemPackage}
                      onToggle={toggleGemPackageStatus}
                   />
                )}
                {activeTab === "season_rewards" && (
                   <SeasonManagement
                      rewards={seasonRewards}
                      loading={loadingSeason}
                      setShowModal={setShowSeasonModal}
                      setEditingSeasonReward={setEditingSeasonReward}
                      setSeasonForm={setSeasonForm}
                      onEdit={(r) => {
                          setEditingSeasonReward(r);
                          setSeasonForm({
                              level: r.level,
                              free: { diamonds: r.free.diamonds, gtc: r.free.gtc },
                              elite: { diamonds: r.elite.diamonds, gtc: r.elite.gtc },
                              isMilestone: r.isMilestone
                          });
                          setShowSeasonModal(true);
                      }}
                      onDelete={handleDeleteSeasonReward}
                   />
                )}
                {activeTab === "security" && <SecurityManagement />}
                {activeTab === "global-pulse" && <GlobalSessionMonitor />}
            </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <MissionModal
        showCreateMission={showCreateMission}
        setShowCreateMission={setShowCreateMission}
        editingMission={editingMission}
        setEditingMission={setEditingMission}
        missionForm={missionForm}
        setMissionForm={setMissionForm}
        handleMissionChange={handleMissionChange}
        games={games}
        submitMission={submitMission}
        creatingMission={creatingMission}
      />
      <RewardModal
        showRewardModal={showRewardModal}
        setShowRewardModal={setShowRewardModal}
        editingReward={editingReward}
        rewardForm={rewardForm}
        setRewardForm={setRewardForm}
        submitReward={submitReward}
        loading={loading}
      />
      <CategoryModal
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        editingCategory={editingCategory}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        submitCategory={submitCategory}
        loading={loading}
      />
      <CommunityModal
        showCommunityModal={showCommunityModal}
        setShowCommunityModal={setShowCommunityModal}
        communityForm={communityForm}
        setCommunityForm={setCommunityForm}
        submitCommunity={submitCommunity}
        loading={loading}
      />
      <HeroSlideModal
        showHeroModal={showHeroModal}
        setShowHeroModal={setShowHeroModal}
        editingHero={editingHero}
        heroForm={heroForm}
        setHeroForm={setHeroForm}
        submitHeroSlide={submitHeroSlide}
        loading={loading}
      />
      <PermissionModal
        showPermissionModal={showPermissionModal}
        setShowPermissionModal={setShowPermissionModal}
        selectedUser={selectedUser}
        allPermissions={allPermissions}
        handlePermissionToggle={handlePermissionToggle}
      />
      <BanModal
        showBanModal={showBanModal}
        setShowBanModal={setShowBanModal}
        banForm={banForm}
        setBanForm={setBanForm}
        confirmToggleBan={confirmToggleBan}
        loading={loading}
      />
      <ConfirmationModal
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
      <GemModal
        isOpen={showGemModal}
        onClose={() => setShowGemModal(false)}
        form={packageForm}
        setForm={setPackageForm}
        onSubmit={submitGemPackage}
        loading={loading}
        isEditing={!!editingPackage}
      />
      <SeasonRewardModal
        isOpen={showSeasonModal}
        onClose={() => setShowSeasonModal(false)}
        form={seasonForm}
        setForm={setSeasonForm}
        onSubmit={submitSeasonReward}
        loading={loading}
        isEditing={!!editingSeasonReward}
      />
    </div>
  );
};

export default AdminPage;
