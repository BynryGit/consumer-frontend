import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "@shared/analytics/analytics";
import { useGlobalUserProfile } from "@shared/hooks/useGlobalUser";

/**
 * Custom hook to track user engagement time on different parts of the application.
 * It logs the time spent on modules, submodules, tabs, and applied filters.
 * This helps in understanding user behavior and interaction patterns.
 */
export const usePageTracking = () => {
  const location = useLocation();
  const { data: user } = useGlobalUserProfile();

  // useRef to store the previous module name for time tracking
  const prevModule = useRef<string | null>(null);
  // useRef to store the start time when the user entered the current module
  const moduleStartTime = useRef<number | null>(null);
  // useRef to track if module event has been logged for current module
  const moduleLogged = useRef<boolean>(false);

  // useRef to store the previous submodule and tab key for time tracking
  const prevSubTabKey = useRef<string | null>(null);
  // useRef to store the start time when the user entered the current submodule + tab
  const tabStartTime = useRef<number | null>(null);
  // useRef to track if submodule+tab event has been logged for current subTabKey
  const subTabLogged = useRef<boolean>(false);

  // useRef to store the previous search string for filter tracking
  const prevSearch = useRef<string | null>(null);
  // useRef to track if filters event has been logged for current search params
  const filtersLogged = useRef<boolean>(false);

  // Extract pathname and query string from location
  const { pathname, search: queryString } = location;
  // Split pathname into parts to identify module and submodule
  const pathnameParts = pathname.split("/").filter(Boolean);
  const module = pathnameParts[0] ?? "";
  const submodule = pathnameParts.slice(1, 3).join("/") ?? "";

  useEffect(() => {
    if (!user) return;

    const now = Date.now();
    const searchParams = new URLSearchParams(queryString);
    const tab = searchParams.get("tab") ?? "";
    const search = searchParams.get("search");
    const subTabKey = `${submodule} ${tab}`;

    // Extract filters from query params excluding 'tab' only (per instructions)
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== "tab") {
        filters[key] = value;
      }
    });

    /** ---------------------
     * ✅ MODULE TIME TRACKING
     * Track time spent on a module and log when module changes.
     * --------------------- */
    if (prevModule.current && prevModule.current !== module) {
      if (moduleStartTime.current && !moduleLogged.current) {
        const duration = now - moduleStartTime.current;
        const durationMin = +(duration / 60000).toFixed(2);

        console.debug("[DEBUG] Logging Module Time Spent for", prevModule.current, "duration:", durationMin, "min");
        logEvent("Module Time Spent", {
          module: prevModule.current,
          durationMs: duration,
          durationMin,
        });
        moduleLogged.current = true;
      }

      // Reset start time and update current module
      moduleStartTime.current = now;
      prevModule.current = module;
      moduleLogged.current = false;
      console.debug("[DEBUG] Module changed to", module, "- reset start time and logged flag");
    }

    // Initialize module tracking if not set
    if (!prevModule.current) {
      moduleStartTime.current = now;
      prevModule.current = module;
      moduleLogged.current = false;
      console.debug("[DEBUG] Initializing module tracking for", module);
    }

    /** ---------------------
     * ✅ SUBMODULE & TAB TIME TRACKING
     * Track time spent on submodule + tab and log when either changes.
     * --------------------- */
    if (prevSubTabKey.current && prevSubTabKey.current !== subTabKey) {
      if (tabStartTime.current && !subTabLogged.current) {
        const duration = now - tabStartTime.current;
        const durationMin = +(duration / 60000).toFixed(2);
        const [prevSubmodule, prevTab] = prevSubTabKey.current.split("::");

        console.debug("[DEBUG] Logging Submodule + Tab Time Spent for", prevSubmodule, prevTab, "duration:", durationMin, "min");
        logEvent("Submodule + Tab Time Spent", {
          module,
          submodule: prevSubmodule,
          tab: prevTab,
          durationMs: duration,
          durationMin,
        });
        subTabLogged.current = true;
      }

      // Reset start time and update current submodule + tab key
      tabStartTime.current = now;
      prevSubTabKey.current = subTabKey;
      subTabLogged.current = false;
      console.debug("[DEBUG] Submodule+Tab changed to", subTabKey, "- reset start time and logged flag");
    }

    // Initialize submodule + tab tracking if not set
    if (!prevSubTabKey.current) {
      tabStartTime.current = now;
      prevSubTabKey.current = subTabKey;
      subTabLogged.current = false;
      console.debug("[DEBUG] Initializing submodule+tab tracking for", subTabKey);
    }

    /** ---------------------
     * ✅ FILTER TRACKING
     * Log filter changes including search and other filters.
     * Only log when searchParams excluding 'tab' change.
     * --------------------- */
    const fullSearchExcludingTab = (() => {
      const sp = new URLSearchParams();
      searchParams.forEach((value, key) => {
        if (key !== "tab") {
          sp.append(key, value);
        }
      });
      return sp.toString();
    })();

    if (fullSearchExcludingTab !== prevSearch.current) {
      if ((search && search.length > 0) || Object.keys(filters).length > 0) {
        if (!filtersLogged.current) {
          console.debug("[DEBUG] Logging Filters Applied for module:", module, "submodule:", submodule);
          logEvent("Filters Applied", {
            module,
            submodule,
            ...(search ? { search } : {}),
            ...(Object.keys(filters).length > 0 ? { filters } : {}),
          });
          filtersLogged.current = true;
        }
      }
      prevSearch.current = fullSearchExcludingTab;
      // Do NOT reset filtersLogged.current here to avoid cancelling the logged flag prematurely
    }

    /** ---------------------
     * ✅ FINAL CLEANUP
     * On component unmount or dependency change, log any remaining time spent.
     * --------------------- */
    return () => {
      // Removed logging for Submodule + Tab and Filters from cleanup as per instructions
    };
  }, [module, submodule, queryString, user]);
};