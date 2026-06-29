// Check if we are running locally or in production
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// API base URL
export const API_BASE_URL = isDev ? '/api' : 'https://weatherguard-admin-iq70.onrender.com/api';

// OAuth endpoints (direct backend URLs)
export const OAUTH_GOOGLE_URL = isDev 
  ? `${window.location.origin}/api/auth/google` 
  : 'https://weatherguard-admin-iq70.onrender.com/api/auth/google';

export const OAUTH_GITHUB_URL = isDev 
  ? `${window.location.origin}/api/auth/github` 
  : 'https://weatherguard-admin-iq70.onrender.com/api/auth/github';

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'weatherguard_token',
  THEME: 'weatherguard_theme',
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Access statuses
export const ACCESS_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Status display config
export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'amber',
    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    textClass: 'text-amber-700 dark:text-amber-400',
    dotClass: 'bg-amber-500',
  },
  approved: {
    label: 'Approved',
    color: 'emerald',
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    dotClass: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'rose',
    bgClass: 'bg-rose-100 dark:bg-rose-900/30',
    textClass: 'text-rose-700 dark:text-rose-400',
    dotClass: 'bg-rose-500',
  },
};

// Navigation items
export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'Admin Panel', path: '/admin/dashboard', icon: 'admin' },
];
