/**
 * Generates a consistent avatar URL based on a name or identifier.
 * Uses a local Instagram-style silhouette as the primary default.
 * 
 * @param {string} name - The name to generate initials from (e.g. "John Doe")
 * @returns {string} The URL to the avatar image
 */
export const getAvatarUrl = (name) => {
  if (!name || name === "User") return "/logo/default-avatar.svg";
  
  // Use ui-avatars for a better visual fallback with initials
  const initials = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff&bold=true&format=svg`;
};

/**
 * Helper to safely get an avatar from a user object or return the generated one.
 * 
 * @param {Object} userOrSender - The user object containing avatar and username/name
 * @returns {string} The safe avatar URL
 */
export const getSafeUserAvatar = (userOrSender) => {
  const avatarUrl = userOrSender?.avatar?.url || userOrSender?.avatar || userOrSender?.profilePicture;

  if (avatarUrl && typeof avatarUrl === "string" && avatarUrl.length > 5) {
    // Check if it looks like a valid URL or path
    if (!avatarUrl.startsWith("http") && !avatarUrl.startsWith("/")) {
       return getAvatarUrl(userOrSender?.username || userOrSender?.name || "User");
    }

    // Check for known broken/blocked external placeholder domains
    if (avatarUrl.includes("avatar.iran.liara.run") || 
        avatarUrl.includes("i.pravatar.cc") ||
        avatarUrl.includes("placeholder.com")) {
      return getAvatarUrl(userOrSender?.username || userOrSender?.name || "User");
    }
    
    return avatarUrl;
  }
  
  return getAvatarUrl(userOrSender?.username || userOrSender?.name || "User");
};

