// src/utils/config.js

export const TIER_CONFIG = {
  BRONZE: {
    name: "Bronze",
    minElo: 0,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    glow: "shadow-[0_0_10px_rgba(251,146,60,0.2)]",
    next: 1200,
    icon: "Shield"
  },
  SILVER: {
    name: "Silver",
    minElo: 1200,
    color: "text-gray-300",
    bg: "bg-gray-400/10",
    border: "border-gray-400/20",
    glow: "shadow-[0_0_15px_rgba(156,163,175,0.3)]",
    next: 1500,
    icon: "ShieldAlert"
  },
  GOLD: {
    name: "Gold",
    minElo: 1500,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    glow: "shadow-[0_0_15px_rgba(250,204,21,0.3)]",
    next: 1800,
    icon: "Trophy"
  },
  PLATINUM: {
    name: "Platinum",
    minElo: 1800,
    color: "text-blue-300",
    bg: "bg-blue-300/10",
    border: "border-blue-300/20",
    glow: "shadow-[0_0_15px_rgba(147,197,253,0.3)]",
    next: 2100,
    icon: "Medal"
  },
  DIAMOND: {
    name: "Diamond",
    minElo: 2100,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.3)]",
    next: 2500,
    icon: "Diamond"
  },
  ELITE: {
    name: "Elite",
    minElo: 2500,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    next: null,
    icon: "Flame"
  }
};

export const getTierByElo = (elo) => {
  if (elo >= 2500) return TIER_CONFIG.ELITE;
  if (elo >= 2100) return TIER_CONFIG.DIAMOND;
  if (elo >= 1800) return TIER_CONFIG.PLATINUM;
  if (elo >= 1500) return TIER_CONFIG.GOLD;
  if (elo >= 1200) return TIER_CONFIG.SILVER;
  return TIER_CONFIG.BRONZE;
};

export const UI_CHUNKS = {
  SCROLLBAR_CLASS: "custom-scrollbar",
  ANIMATION_VARIANTS: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};
