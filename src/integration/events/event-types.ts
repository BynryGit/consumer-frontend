export enum EventType {
  // Auth Events
  USER_LOGGED_IN = 'USER_LOGGED_IN',
  USER_LOGGED_OUT = 'USER_LOGGED_OUT',
  AUTH_ERROR = 'AUTH_ERROR',

  // Notification Events
  NOTIFICATION_SHOW = 'NOTIFICATION_SHOW',
  NOTIFICATION_HIDE = 'NOTIFICATION_HIDE',

  // Theme Events
  THEME_CHANGED = 'THEME_CHANGED',

  // Feature Flag Events
  FEATURE_FLAGS_UPDATED = 'FEATURE_FLAGS_UPDATED',

  // Data Events
  DATA_REFRESH = 'DATA_REFRESH',
  DATA_ERROR = 'DATA_ERROR',

  // UI Events
  MODAL_OPEN = 'MODAL_OPEN',
  MODAL_CLOSE = 'MODAL_CLOSE',
  SIDEBAR_TOGGLE = 'SIDEBAR_TOGGLE',
}

export interface Event<T = any> {
  type: EventType;
  payload: T;
  timestamp: number;
}

export interface UserLoggedInEvent {
  userId: string;
  email: string;
  name: string;
}

export interface NotificationEvent {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ThemeEvent {
  theme: 'light' | 'dark' | 'system';
}

export interface FeatureFlagsEvent {
  flags: Record<string, boolean>;
}

export interface DataRefreshEvent {
  entity: string;
  id?: string;
}

export interface ModalEvent {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
} 