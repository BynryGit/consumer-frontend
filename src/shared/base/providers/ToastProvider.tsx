import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast configuration
const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Toast type configurations
const toastConfigs = {
  success: {
    ...defaultToastOptions,
    autoClose: 3000,
    style: {
      background: '#10B981',
      color: '#FFFFFF',
    },
  },
  error: {
    ...defaultToastOptions,
    autoClose: 5000,
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
    },
  },
  warning: {
    ...defaultToastOptions,
    autoClose: 4000,
    style: {
      background: '#F59E0B',
      color: '#FFFFFF',
    },
  },
  info: {
    ...defaultToastOptions,
    autoClose: 3000,
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
    },
  },
};

// Toast context
interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastFunctions = {
    success: (message: string, options?: ToastOptions) =>
      toast.success(message, { ...toastConfigs.success, ...options }),
    error: (message: string, options?: ToastOptions) =>
      toast.error(message, { ...toastConfigs.error, ...options }),
    warning: (message: string, options?: ToastOptions) =>
      toast.warning(message, { ...toastConfigs.warning, ...options }),
    info: (message: string, options?: ToastOptions) =>
      toast.info(message, { ...toastConfigs.info, ...options }),
  };

  return (
    <ToastContext.Provider value={toastFunctions}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ToastContext.Provider>
  );
}; 