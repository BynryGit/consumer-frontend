// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: "/auth/login/",
    logout: "/logout/",
    forgotPassword: "/auth/forgot-password/",
    resetPassword: "/auth/reset-password/",
    profile: "/user-profile/",
  },

  // User endpoints
  users: {
    base: "/users",
    profile: "/users/profile",
    updateProfile: "/users/profile",
    changePassword: "/users/change-password",
  },

  // Utility endpoints
  utility: {
    getUtility: "/api/user/get-utility/",
  },
} as const;

// Type for API endpoints
export type ApiEndpoint = typeof API_ENDPOINTS;

// Helper function to get full endpoint URL
export const getEndpoint = (path: string): string => {
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_BASE_URL}${path}`;
};
