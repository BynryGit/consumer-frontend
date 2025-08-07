interface ImportMetaEnv {
  DEV: any;
  VITE_API_MOCK_ENDPOINT: any;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_AUTH_API_ENDPOINT: string;
  readonly VITE_ONBOARDING_API_ENDPOINT: string;
  readonly VITE_CX_API_ENDPOINT: string;
  readonly VITE_CONSUMER_WEB_API_ENDPOINT: string;
  readonly VITE_BX_API_ENDPOINT: string;
  readonly VITE_MX_API_ENDPOINT: string;
  readonly VITE_WX_API_ENDPOINT: string;
  readonly VITE_RX_API_ENDPOINT: string;
  readonly VITE_NOTIFICATION_API_ENDPOINT: string;
  readonly VITE_ACTIVITY_LOG_API_ENDPOINT: string;
  readonly VITE_STAR_API_ENDPOINT: string;
  readonly VITE_AX_API_ENDPOINT: string;
  readonly VITE_RECEIPT_API_ENDPOINT: string;
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
  readonly VITE_PAYMENT_API_ENDPOINT: string;
  readonly VITE_PLATFORM_URL: string;
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
