import posthog from "posthog-js";


export const initPosthog = (): void => {
  // Initialize PostHog client first
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    loaded: function(posthog) {
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
      posthog.opt_out_capturing();
    }
  },
    defaults: "2025-05-24",
    capture_pageview: false,
    capture_performance: false,
    autocapture: false,
    capture_pageleave: false,
  });
};

export const logEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  posthog.capture(eventName, properties);
};

export const setUserAndProps = (
  userId: string,
  props?: Record<string, any>
) => {
  posthog.identify(userId, props);
};

export const resetPosthog = () => {
  posthog.reset();
};
