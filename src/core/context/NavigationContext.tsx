

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SIDE_NAVBAR_AS_PER_MODULE, ICONS } from "../config/navigation";

type ModuleType = keyof typeof SIDE_NAVBAR_AS_PER_MODULE;

interface NavigationContextType {
  currentModule: ModuleType;
  setCurrentModule: (module: ModuleType) => void;
  navigationItems: (typeof SIDE_NAVBAR_AS_PER_MODULE)[ModuleType];
  bentoMenuItems: typeof ICONS;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

const MODULE_QUERY_KEY = "currentModule";
const STORAGE_KEY = "smart360_current_module";

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const manuallySetRef = useRef(false); // ✅ ref to detect manual set

  const getInitialModule = (): ModuleType => {
    const storedModule = localStorage.getItem(STORAGE_KEY);
    if (storedModule && storedModule in SIDE_NAVBAR_AS_PER_MODULE) {
      return storedModule as ModuleType;
    }

    const path = location.pathname;
    const moduleFound = Object.entries(SIDE_NAVBAR_AS_PER_MODULE).find(
      ([, items]) => items.some((item) => path.startsWith(item.link))
    );

    const module = moduleFound ? (moduleFound[0] as ModuleType) : "CX";
    localStorage.setItem(STORAGE_KEY, module);
    return module;
  };

  const { data: currentModule = getInitialModule() } = useQuery<ModuleType>({
    queryKey: [MODULE_QUERY_KEY],
    queryFn: getInitialModule,
    staleTime: Infinity,
  });

  const setCurrentModule = (module: ModuleType) => {
    manuallySetRef.current = true; // ✅ mark manual override
    queryClient.setQueryData([MODULE_QUERY_KEY], module);
    localStorage.setItem(STORAGE_KEY, module);
  };

  useEffect(() => {
    if (manuallySetRef.current) {
      manuallySetRef.current = false; // ✅ skip this run
      return;
    }

    const path = location.pathname;
    const moduleFromPath = Object.entries(SIDE_NAVBAR_AS_PER_MODULE).find(
      ([, items]) => items.some((item) => path.startsWith(item.link))
    );

    if (moduleFromPath && moduleFromPath[0] !== currentModule) {
      const newModule = moduleFromPath[0] as ModuleType;
      setCurrentModule(newModule);
    }
  }, [location.pathname, currentModule]);

  const navigationItems = SIDE_NAVBAR_AS_PER_MODULE[currentModule];
  const bentoMenuItems = ICONS;

  return (
    <NavigationContext.Provider
      value={{
        currentModule,
        setCurrentModule,
        navigationItems,
        bentoMenuItems,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
