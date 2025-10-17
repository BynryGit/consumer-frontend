// Color Scheme
export const COLORS = {
  primary: {
    50: "#e6f1fe",
    100: "#cce3fd",
    200: "#99c7fb",
    300: "#66aaf9",
    400: "#338ef7",
    500: "#0072f5", // Main primary color
    600: "#005bc4",
    700: "#004493",
    800: "#002e62",
    900: "#001731",
  },
  secondary: {
    50: "#f5f7fa",
    100: "#ebeef5",
    200: "#d7dde6",
    300: "#c3ccd7",
    400: "#afbbc8",
    500: "#91a0b4", // Main secondary color
    600: "#738098",
    700: "#5c6678",
    800: "#3d4450",
    900: "#1e2228",
  },
  success: {
    50: "#e6f9f1",
    500: "#0ead69",
  },
  warning: {
    50: "#fef8e7",
    500: "#f7b955",
  },
  danger: {
    50: "#fee7e7",
    500: "#f56565",
  },
  info: {
    50: "#e6f1fe",
    500: "#3b82f6",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// User Types
export const USER_TYPES = {
  CUSTOMER_SERVICE: "Customer Service Executives",
  FIELD_TECHNICIAN: "Field Technicians / Meter Readers",
  UTILITY_ADMIN: "Utility Admin / Operations Team",
  BILLING_TEAM: "Billing Team",
  CONSUMER: "Consumers",
};

// Communication Types
export const COMMUNICATION_TYPES = {
  BILLING: "Billing notifications",
  PAYMENT: "Payment reminders / receipts",
  APPOINTMENT: "Service appointment updates",
  OUTAGE: "Outage alerts",
  CONNECTION: "Connection/disconnection updates",
  COMPLAINT: "Complaint updates",
  ANNOUNCEMENT: "Custom announcements",
};

// Communication Channels
export const CHANNELS = {
  EMAIL: "Email",
  SMS: "SMS",
  IN_APP: "In-App Notifications",
  WHATSAPP: "WhatsApp",
};

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "Layout",
  },
  {
    id: "compose",
    label: "Messaging",
    icon: "PenLine",
  },
  {
    id: "lists",
    label: "Lists",
    icon: "ListChecks",
  },
  {
    id: "workflows",
    label: "Workflows",
    icon: "GitBranch",
  },
  {
    id: "history",
    label: "History",
    icon: "History",
  },
  {
    id: "templates",
    label: "Templates",
    icon: "FileText",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "Settings",
  },
];

export const PAGE_SIZE = 50;
export const DEFAULT_PAGE_NUMBER = 1;