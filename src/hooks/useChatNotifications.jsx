import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import socketService from "../services/socket";
import api from "../services/api";
import toast from "react-hot-toast";
import { getSafeUserAvatar } from "../utils/avatarUtils";

const useChatNotifications = (currentUser) => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationRef = useRef(location.pathname);
  const userRef = useRef(currentUser);

  // Sync refs so the listener always has the latest state without re-subscribing
  useEffect(() => {
    locationRef.current = location.pathname;
    userRef.current = currentUser;
  }, [location.pathname, currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    let communitiesCache = [];

    const handleGlobalMessage = (msg) => {
      const currentPath = locationRef.current;
      const user = userRef.current;
      if (!user) return;

      const currentRoomId = currentPath.split("/chat/")[1];
      const isSelf = String(msg.sender._id) === String(user._id || user.id);
      
      // 🛡️ 1. Don't count your own messages
      if (isSelf) return;

      // 🛡️ 2. Don't count if you are already in the room
      if (msg.community === currentRoomId) return;

      // 📊 3. Increment Count
      const counts = JSON.parse(localStorage.getItem("unread_counts") || "{}");
      counts[msg.community] = (counts[msg.community] || 0) + 1;
      localStorage.setItem("unread_counts", JSON.stringify(counts));
      
      window.dispatchEvent(new CustomEvent("unread_counts_updated", { detail: counts }));

      // 🛡️ 4. Show Notification if not muted
      const mutedRooms = JSON.parse(localStorage.getItem("muted_rooms") || "[]");
      if (mutedRooms.includes(msg.community)) return;

      const communityName = communitiesCache.find(c => c._id === msg.community)?.name || "Community";

      // 🛡️ STOP THE SPAM: Clear ALL current toasts before showing the new one
      toast.dismiss(); 
      
      // Delay slightly to ensure dismissal completes (cleaner transition)
      setTimeout(() => {
        toast.custom((t) => (
            <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                onClick={() => {
                    toast.dismiss(t.id);
                    navigate(`/chat/${msg.community}`);
                }}
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
                            cursor-pointer flex items-start gap-4 p-4 min-w-[320px]
                            bg-[#0a0a0a] border border-purple-500/20 rounded-2xl shadow-2xl backdrop-blur-xl relative z-[9999]`}
            >
                <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
                    <img 
                        src={getSafeUserAvatar(msg.sender)} 
                        className="h-full w-full object-cover"
                        alt="" 
                    />
                </div>
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest leading-tight">
                            Protocol Hub: {communityName}
                        </p>
                        <span className="text-[8px] text-gray-600 font-bold uppercase">Now</span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1.5 line-clamp-1">
                        <span className="text-gray-400 uppercase text-[9px] mr-1.5">{msg.sender.username}:</span>
                        {msg.content}
                    </p>
                </div>
            </motion.div>
        ), {
            id: "chat-notif", // FORCE SINGLE ID
            duration: 5000,
            position: "top-right",
        });
      }, 50);
    };

    const fetchCommunities = async () => {
      try {
        const res = await api.get("/api/chat/my-communities");
        if (res.data.success) {
          communitiesCache = res.data.communities;
          communitiesCache.forEach(c => socketService.joinRoom(c._id));
        }
      } catch (err) {
        console.error("Failed to join rooms for notifications", err);
      }
    };

    fetchCommunities();
    
    // Add listener exactly ONCE
    socketService.onMessage(handleGlobalMessage);

    return () => {
      socketService.offMessage(handleGlobalMessage);
    };
  }, [currentUser]); // Only runs when user logs in/out
};

export default useChatNotifications;
