import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@shared/lib/utils";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "./skeleton";

interface SubTabConfig {
  label: React.ReactNode;
  icon?: React.ReactNode;
  component: React.ReactNode;
  className?: string;
  count?: number | string;
  countClassName?: string;
  shortLabel?: string;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
}

interface TabConfig {
  label: React.ReactNode;
  icon?: React.ReactNode;
  component: React.ReactNode;
  className?: string;
  count?: number | string;
  countClassName?: string;
  shortLabel?: string;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  // NEW: Optional nested tabs
  subTabs?: Record<string, SubTabConfig | React.ReactNode>;
  subTabsUrlMapping?: Record<string, string>; // Maps subtab values to URL hash values
  subTabsListClassName?: string;
  defaultSubTab?: string;
}

interface UrlTabsProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    "value" | "onValueChange" | "children"
  > {
  defaultValue?: string;
  urlMapping?: Record<string, string>;
  tabComponents: Record<string, TabConfig | React.ReactNode>;
  tabsListClassName?: string;
  idPrefix?: string;
  defaultLoadingComponent?: React.ReactNode;
  tabsListFullWidth?: boolean; // Control whether tabs list should be full width
  disableUrlSync?: boolean;
  level?: number; // Added level for nested tabs
}

const DefaultSkeletonLoader = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

// SubTabs component for nested tabs
const SubTabs = React.forwardRef<
  HTMLDivElement,
  {
    subTabComponents: Record<string, SubTabConfig | React.ReactNode>;
    activeSubTab: string;
    onSubTabChange: (value: string) => void;
    className?: string;
    idPrefix: string;
    parentTabValue: string;
    isLoading: boolean;
    loadingType: "skeleton" | "basic";
    isDropdownRequest: boolean;
    defaultLoadingComponent?: React.ReactNode;
  }
>(({
  subTabComponents,
  activeSubTab,
  onSubTabChange,
  className,
  idPrefix,
  parentTabValue,
  isLoading,
  loadingType,
  isDropdownRequest,
  defaultLoadingComponent,
}, ref) => {
  const shouldShowLoading = isLoading && !isDropdownRequest;

  // Helper function to render responsive label for subtabs
  const renderSubTabResponsiveLabel = (
    config: SubTabConfig | null,
    fallback: string
  ) => {
    if (!config) return <span className="truncate">{fallback}</span>;

    if (typeof config.label === "string" && config.shortLabel) {
      return (
        <>
          <span className="hidden lg:inline truncate" title={config.label}>
            {config.label}
          </span>
          <span className="lg:hidden truncate" title={config.label}>
            {config.shortLabel}
          </span>
        </>
      );
    }

    if (typeof config.label === "string") {
      const shortLabel =
        config.label.length > 6 ? config.label.substring(0, 4) + "..." : config.label;
      return (
        <>
          <span className="hidden lg:inline truncate" title={config.label}>
            {config.label}
          </span>
          <span className="lg:hidden truncate" title={config.label}>
            {shortLabel}
          </span>
        </>
      );
    }

    return <span className="truncate">{config.label}</span>;
  };

  return (
    <div ref={ref}>
      {/* SubTabs List - Styled differently from main tabs */}
      <div className={cn(
        "h-auto items-center justify-start rounded-md bg-muted/50 p-0.5 text-muted-foreground border",
        className ? className : "inline-flex" // Use custom className or default to inline-flex
      )}>
        {Object.entries(subTabComponents).map(([value, config]) => {
          const isSubTabConfig =
            config && typeof config === "object" && "component" in config;
          const subTabConfig = isSubTabConfig ? (config as SubTabConfig) : null;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSubTabChange(value)}
              id={`${idPrefix}-${parentTabValue}-${value}`}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 min-h-[28px] px-3 py-1 overflow-hidden",
                activeSubTab === value
                  ? "bg-background text-foreground shadow-sm border"
                  : "hover:bg-muted/80",
                subTabConfig?.className
              )}
            >
              <div className="flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                {subTabConfig?.icon && (
                  <span className="h-3 w-3 flex-shrink-0">{subTabConfig.icon}</span>
                )}
                {subTabConfig?.count !== undefined &&
                subTabConfig.count !== null ? (
                  <>
                    <span className="truncate min-w-0 max-w-[60px]">
                      {renderSubTabResponsiveLabel(subTabConfig, value)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center justify-center min-w-[0.875rem] h-3.5 px-1 text-xs font-medium bg-primary text-primary-foreground rounded-full flex-shrink-0",
                        subTabConfig.countClassName
                      )}
                    >
                      {subTabConfig.count}
                    </span>
                  </>
                ) : (
                  <span className="truncate min-w-0 max-w-[60px]">
                    {renderSubTabResponsiveLabel(subTabConfig, value)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* SubTabs Content */}
      <div className="mt-3">
        {Object.entries(subTabComponents).map(([value, config]) => {
          if (value !== activeSubTab) return null;

          const isSubTabConfig =
            config && typeof config === "object" && "component" in config;
          const subTabConfig = isSubTabConfig ? (config as SubTabConfig) : null;
          const component = isSubTabConfig
            ? subTabConfig.component
            : (config as React.ReactNode);

          return (
            <div
              key={value}
              id={`${idPrefix}-${parentTabValue}-${value}-content`}
            >
              {shouldShowLoading ? (
                loadingType === "skeleton" ? (
                  subTabConfig?.loadingComponent ||
                  defaultLoadingComponent || <DefaultSkeletonLoader />
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )
              ) : (
                component
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

SubTabs.displayName = "SubTabs";

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  UrlTabsProps
>(
  (
    {
      className,
      defaultValue,
      urlMapping = {},
      tabComponents,
      tabsListClassName,
      tabsListFullWidth = false,
      idPrefix = "tab",
      disableUrlSync = false,
      defaultLoadingComponent,
      level = 0, // Default to top-level
      ...props
    },
    ref
  ) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadingType, setLoadingType] = React.useState<"skeleton" | "basic">(
      "skeleton"
    );
    const [isDropdownRequest, setIsDropdownRequest] = React.useState(false);
    const [internalActiveTab, setInternalActiveTab] = React.useState<string>("");
    const [internalActiveSubTabs, setInternalActiveSubTabs] = 
      React.useState<Record<string, string>>({});

    React.useEffect(() => {
      const handleLoadingStart = (
        event: CustomEvent<{ method: string; url?: string }>
      ) => {
        const type = event.detail.method === "GET" ? "skeleton" : "basic";
        setLoadingType(type);
        setIsDropdownRequest(!!event.detail.url);
        setIsLoading(true);
      };

      const handleLoadingEnd = () => {
        setIsLoading(false);
      };

      window.addEventListener(
        "api-loading-start",
        handleLoadingStart as EventListener
      );
      window.addEventListener("api-loading-end", handleLoadingEnd);

      return () => {
        window.removeEventListener(
          "api-loading-start",
          handleLoadingStart as EventListener
        );
        window.removeEventListener("api-loading-end", handleLoadingEnd);
      };
    }, []);

    // Generate query parameter name based on level
    const paramName = React.useMemo(() => {
      return level === 0 ? "tab" : `tab${level}`;
    }, [level]);

    // NEW: Generate subtab parameter name
    const subTabParamName = React.useMemo(() => {
      return level === 0 ? "subtab" : `subtab${level}`;
    }, [level]);

    const generateTabId = (tabValue: string): string => {
      return `${idPrefix}-${tabValue}`;
    };

    const generateContentId = (tabValue: string): string => {
      return `${idPrefix}-${tabValue}-content`;
    };

    // Helper function to render responsive label with ellipsis
    const renderResponsiveLabel = (
      config: TabConfig | null,
      fallback: string
    ) => {
      if (!config) return <span className="truncate">{fallback}</span>;

      if (typeof config.label === "string" && config.shortLabel) {
        return (
          <>
            <span className="hidden lg:inline truncate" title={config.label}>
              {config.label}
            </span>
            <span className="lg:hidden truncate" title={config.label}>
              {config.shortLabel}
            </span>
          </>
        );
      }

      if (typeof config.label === "string") {
        const shortLabel =
          config.label.length > 8 ? config.label.substring(0, 6) + "..." : config.label;
        return (
          <>
            <span className="hidden lg:inline truncate" title={config.label}>
              {config.label}
            </span>
            <span className="lg:hidden truncate" title={config.label}>
              {shortLabel}
            </span>
          </>
        );
      }

      return <span className="truncate">{config.label}</span>;
    };

    const reverseUrlMapping = React.useMemo(() => {
      if (disableUrlSync) return {};
      const reverse: Record<string, string> = {};
      Object.entries(urlMapping).forEach(([tabValue, urlValue]) => {
        reverse[urlValue] = tabValue;
      });
      return reverse;
    }, [urlMapping, disableUrlSync]);

    if (
      !tabComponents ||
      typeof tabComponents !== "object" ||
      Object.keys(tabComponents).length === 0
    ) {
      console.warn("Tabs: tabComponents is required");
      return <div>No tabs configured</div>;
    }

    const tabValues = React.useMemo(() => {
      return Object.keys(tabComponents);
    }, [tabComponents]);

    React.useEffect(() => {
      if (disableUrlSync && !internalActiveTab) {
        setInternalActiveTab(defaultValue || tabValues[0] || "");
      }
    }, [disableUrlSync, internalActiveTab, defaultValue, tabValues]);

    // Get current query params
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get(paramName);
    const currentSubTab = searchParams.get(subTabParamName); // NEW: Get subtab from URL

    const getTabValueFromQuery = (tabParam: string | null): string => {
      if (disableUrlSync) return defaultValue || tabValues[0] || "";
      if (!tabParam) return tabValues[0] || defaultValue || "";

      const mappedValue = reverseUrlMapping[tabParam];
      if (mappedValue && tabValues.includes(mappedValue)) {
        return mappedValue;
      }

      if (tabValues.includes(tabParam)) {
        return tabParam;
      }

      return tabValues[0] || defaultValue || "";
    };

    // NEW: Get subtab value from query param
    const getSubTabValueFromQuery = (
      tabValue: string,
      subTabParam: string | null
    ): string => {
      if (disableUrlSync) return "";

      const tabConfig = tabComponents[tabValue];
      const isTabConfig = tabConfig && typeof tabConfig === "object" && "component" in tabConfig;
      
      if (!isTabConfig || !(tabConfig as TabConfig).subTabs) {
        return "";
      }

      const subTabs = (tabConfig as TabConfig).subTabs!;
      const subTabValues = Object.keys(subTabs);
      const subTabUrlMapping = (tabConfig as TabConfig).subTabsUrlMapping || {};
      
      // Create reverse mapping for subtabs
      const reverseSubTabMapping: Record<string, string> = {};
      Object.entries(subTabUrlMapping).forEach(([subTabValue, urlValue]) => {
        reverseSubTabMapping[urlValue] = subTabValue;
      });

      if (!subTabParam) {
        return (tabConfig as TabConfig).defaultSubTab || subTabValues[0] || "";
      }

      // Check reverse mapping
      const mappedValue = reverseSubTabMapping[subTabParam];
      if (mappedValue && subTabValues.includes(mappedValue)) {
        return mappedValue;
      }

      // Check direct match
      if (subTabValues.includes(subTabParam)) {
        return subTabParam;
      }

      return (tabConfig as TabConfig).defaultSubTab || subTabValues[0] || "";
    };

    const getQueryParamFromTabValue = (tabValue: string): string => {
      return urlMapping[tabValue] || tabValue;
    };

    // NEW: Convert subtab value to URL query param
    const getQueryParamFromSubTabValue = (tabValue: string, subTabValue: string): string => {
      const tabConfig = tabComponents[tabValue];
      const isTabConfig = tabConfig && typeof tabConfig === "object" && "component" in tabConfig;
      
      if (!isTabConfig) return subTabValue;
      
      const subTabUrlMapping = (tabConfig as TabConfig).subTabsUrlMapping || {};
      return subTabUrlMapping[subTabValue] || subTabValue;
    };

    const activeTab = disableUrlSync
      ? internalActiveTab
      : getTabValueFromQuery(currentTab);

    // NEW: Get active subtab
    const activeSubTab = disableUrlSync
      ? (internalActiveSubTabs[activeTab] || "")
      : getSubTabValueFromQuery(activeTab, currentSubTab);

    const handleTabChange = (newTabValue: string) => {
      if (disableUrlSync) {
        setInternalActiveTab(newTabValue);
      } else {
        const newTabParam = getQueryParamFromTabValue(newTabValue);
        const newSearchParams = new URLSearchParams(location.search);
        
        // Clear deeper level tabs when changing
        for (const key of newSearchParams.keys()) {
          if (key.startsWith('tab') && key !== paramName) {
            // Clear only deeper levels
            const keyLevel = key === 'tab' ? 0 : parseInt(key.replace('tab', ''));
            if (keyLevel > level) {
              newSearchParams.delete(key);
            }
          }
        }
        
        newSearchParams.set(paramName, newTabParam);
        
        // NEW: Handle subtab when changing main tab
        const newTabConfig = tabComponents[newTabValue];
        const isTabConfig = newTabConfig && typeof newTabConfig === "object" && "component" in newTabConfig;
        
        if (isTabConfig && (newTabConfig as TabConfig).subTabs) {
          const defaultSubTab = (newTabConfig as TabConfig).defaultSubTab || 
            Object.keys((newTabConfig as TabConfig).subTabs!)[0];
          const newSubTabParam = getQueryParamFromSubTabValue(newTabValue, defaultSubTab);
          newSearchParams.set(subTabParamName, newSubTabParam);
        } else {
          newSearchParams.delete(subTabParamName);
        }
        
        navigate(`${location.pathname}?${newSearchParams.toString()}`, {
          replace: true,
        });
      }
    };

    // NEW: Handle subtab change
    const handleSubTabChange = (tabValue: string, newSubTabValue: string) => {
      if (disableUrlSync) {
        setInternalActiveSubTabs(prev => ({
          ...prev,
          [tabValue]: newSubTabValue
        }));
      } else {
        const newSubTabParam = getQueryParamFromSubTabValue(tabValue, newSubTabValue);
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set(subTabParamName, newSubTabParam);
        navigate(`${location.pathname}?${newSearchParams.toString()}`, {
          replace: false,
        });
      }
    };

    React.useEffect(() => {
      if (disableUrlSync) return;
      
      const expectedTabValue = getTabValueFromQuery(currentTab);
      const expectedTabParam = getQueryParamFromTabValue(expectedTabValue);
      const expectedSubTabValue = getSubTabValueFromQuery(expectedTabValue, currentSubTab);
      const expectedSubTabParam = expectedSubTabValue 
        ? getQueryParamFromSubTabValue(expectedTabValue, expectedSubTabValue)
        : null;

      const newSearchParams = new URLSearchParams(location.search);
      let shouldUpdate = false;

      // Check main tab
      if (currentTab !== expectedTabParam) {
        newSearchParams.set(paramName, expectedTabParam);
        shouldUpdate = true;
      }

      // Check subtab
      const tabConfig = tabComponents[expectedTabValue];
      const isTabConfig = tabConfig && typeof tabConfig === "object" && "component" in tabConfig;
      const hasSubTabs = isTabConfig && (tabConfig as TabConfig).subTabs;

      if (hasSubTabs && expectedSubTabParam && currentSubTab !== expectedSubTabParam) {
        newSearchParams.set(subTabParamName, expectedSubTabParam);
        shouldUpdate = true;
      } else if (!hasSubTabs && currentSubTab) {
        newSearchParams.delete(subTabParamName);
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        navigate(`${location.pathname}?${newSearchParams.toString()}`, {
          replace: true,
        });
      }
    }, [location.search, navigate]);

    const shouldShowLoading = isLoading && !isDropdownRequest;

    return (
      <TabsPrimitive.Root
        ref={ref}
        className={className}
        value={activeTab}
        onValueChange={handleTabChange}
        {...props}
      >
        <TabsList 
          className={tabsListClassName}
          fullWidth={tabsListFullWidth}
        >
          {Object.entries(tabComponents).map(([value, config]) => {
            const isTabConfig =
              config && typeof config === "object" && "component" in config;
            const tabConfig = isTabConfig ? (config as TabConfig) : null;

            return (
              <TabsTrigger
                key={value}
                value={value}
                id={generateTabId(value)}
                className={cn(
                  "flex items-center justify-center gap-1 min-w-0 px-2 py-2 text-xs font-medium",
                  tabConfig?.className
                )}
              >
                <div className="flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                  {tabConfig?.icon && (
                    <span className="h-3.5 w-3.5 flex-shrink-0">{tabConfig.icon}</span>
                  )}
                  {tabConfig?.count !== undefined &&
                  tabConfig.count !== null ? (
                    <>
                      <span className=" min-w-0">
                        {renderResponsiveLabel(tabConfig, value)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center justify-center min-w-[1rem] h-4 px-1 text-xs font-medium bg-primary text-primary-foreground rounded-full flex-shrink-0",
                          tabConfig.countClassName
                        )}
                      >
                        {tabConfig.count}
                      </span>
                    </>
                  ) : (
                    <span className=" min-w-0">
                      {renderResponsiveLabel(tabConfig, value)}
                    </span>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(tabComponents).map(([value, config]) => {
          const isTabConfig =
            config && typeof config === "object" && "component" in config;
          const tabConfig = isTabConfig ? (config as TabConfig) : null;
          const component = isTabConfig
            ? tabConfig.component
            : (config as React.ReactNode);

          return (
            <TabsContent
              key={value}
              value={value}
              className="mt-4"
              id={generateContentId(value)}
            >
              {/* Show loading state */}
              {shouldShowLoading && value === activeTab ? (
                loadingType === "skeleton" ? (
                  tabConfig?.loadingComponent ||
                  defaultLoadingComponent || <DefaultSkeletonLoader />
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )
              ) : (
                <div>
                  {/* Always show the parent tab content first */}
                  {component}
                  
                  {/* Then render SubTabs below the parent content if they exist */}
                  {isTabConfig && tabConfig.subTabs && (
                    <div className="mt-6">
                      <SubTabs
                        subTabComponents={tabConfig.subTabs}
                        activeSubTab={activeSubTab}
                        onSubTabChange={(subTabValue) => handleSubTabChange(value, subTabValue)}
                        className={tabConfig.subTabsListClassName}
                        idPrefix={idPrefix}
                        parentTabValue={value}
                        isLoading={shouldShowLoading}
                        loadingType={loadingType}
                        isDropdownRequest={isDropdownRequest}
                        defaultLoadingComponent={defaultLoadingComponent}
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          );
        })}
      </TabsPrimitive.Root>
    );
  }
);

Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    fullWidth?: boolean;
  }
>(({ className, fullWidth = false, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-auto items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      fullWidth ? "w-full" : "w-auto",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow-sm min-h-[32px] overflow-hidden",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

interface TabsSortableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
const TabsSortableHeader = ({
  children,
  className,
  ...props
}: TabsSortableHeaderProps) => (
  <div
    className={cn("inline-flex items-center gap-1 cursor-pointer", className)}
    {...props}
  >
    {children}
  </div>
);

export { Tabs, TabsContent, TabsList, TabsSortableHeader, TabsTrigger };