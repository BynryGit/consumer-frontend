import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Tabs } from "@shared/ui/tabs";
import { useToast } from "@shared/hooks/use-toast";
import {
  Lightbulb,
  Droplet,
  Flame,  
  ThumbsUp,
  Bookmark,
  Share2,
  Zap,
  Loader2,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Settings,
  Shield,
  Star,
  Target,
  Users,
} from "lucide-react";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useUtilityServices, useTipsData } from "../hooks";

const EfficiencyTips = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [selectedUtility, setSelectedUtility] = useState<string>("");

  // Get utility services from API
  const { remoteUtilityId } = getLoginDataFromStorage();
  const { data: utilityServicesData, isLoading: servicesLoading } =
    useUtilityServices({
      utility_id: remoteUtilityId,
    });

  // Filter active utility services
  const activeServices = useMemo(() => {
    if (!utilityServicesData?.result) return [];
    return utilityServicesData.result.filter(
      (service) => service.isActive && service.id !== null
    );
  }, [utilityServicesData]);

  // Set default utility when services load
  useEffect(() => {
    if (activeServices.length > 0 && !selectedUtility) {
      setSelectedUtility(activeServices[0].name);
    }
  }, [activeServices, selectedUtility]);

  // Fetch tips data for selected utility
  const { data: tipsData } = useTipsData({
    remote_utility_id: remoteUtilityId,
    utility_service: selectedUtility,
    show_inactive: true,
  });

  // Helper functions - moved outside to prevent recreation on each render
  const getServiceIcon = useCallback((serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name === "electricity")
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    if (name.includes("water"))
      return <Droplet className="h-4 w-4 text-blue-500" />;
    if (name === "gas") return <Flame className="h-4 w-4 text-orange-500" />;
    return <Zap className="h-4 w-4 text-gray-500" />;
  }, []);

  const getTipIcon = useCallback((iconName: string) => {
    const name = iconName.toLowerCase();
    switch (name) {
      case "bulb":
      case "lightbulb":
        return <Lightbulb className="text-4xl text-yellow-500" />;
      case "info":
        return <Info className="text-4xl text-gray-500" />;
      case "alert-triangle":
        return <AlertTriangle className="text-4xl text-red-500" />;
      case "check-circle":
        return <CheckCircle className="text-4xl text-green-500" />;
      case "help-circle":
        return <HelpCircle className="text-4xl text-blue-400" />;
      case "star":
        return <Star className="text-4xl text-yellow-400" />;
      case "zap":
      case "electric":
        return <Zap className="text-4xl text-purple-500" />;
      case "target":
        return <Target className="text-4xl text-pink-500" />;
      case "shield":
        return <Shield className="text-4xl text-slate-600" />;
      case "clock":
        return <Clock className="text-4xl text-teal-600" />;
      case "users":
        return <Users className="text-4xl text-orange-600" />;
      case "settings":
        return <Settings className="text-4xl text-gray-600" />;
      case "file-text":
        return <FileText className="text-4xl text-indigo-500" />;
      case "droplet":
      case "water":
        return <Droplet className="text-4xl text-blue-500" />;
      case "flame":
      case "fire":
      case "gas":
        return <Flame className="text-4xl text-orange-500" />;
      default:
        return <Info className="text-4xl text-gray-500" />;
    }
  }, []);

  // Get ALL tips for current utility (removed isActive filter)
  const allTips = useMemo(() => {
    if (!tipsData?.result) return [];
    return tipsData.result; // Show all tips regardless of isActive status
  }, [tipsData]);

  // Component to render tips grid - moved outside useMemo to prevent hook issues
  const TipsGrid = useCallback(
    ({ tips }: { tips: any[] }) => (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <Card key={tip.code} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="text-center mb-2">
                {tip.icon ? (
                  getTipIcon(tip.icon)
                ) : (
                  <Info className="text-4xl text-gray-500" />
                )}
              </div>
              <CardTitle className="text-lg">{tip.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {tip.quickSummary || tip.description}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedTip(tip)}
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
    [getTipIcon, setSelectedTip]
  );

  // Generate dynamic tab components based on active services
  const { tabComponents, urlMapping, defaultTab } = useMemo(() => {
    const components: Record<string, any> = {};
    const mapping: Record<string, string> = {};
    let firstTab = "";

    activeServices.forEach((service, index) => {
      const key = service.name.toLowerCase().replace(/\s+/g, "");
      const serviceName = service.name;

      components[key] = {
        label: service.name,
        shortLabel: service.name,
        icon: getServiceIcon(serviceName),
        component: <TipsGrid tips={allTips} />,
        onClick: () => setSelectedUtility(serviceName),
      };
      mapping[key] = key;

      if (index === 0) firstTab = key;
    });

    return {
      tabComponents: components,
      urlMapping: mapping,
      defaultTab: firstTab,
    };
  }, [activeServices, allTips, getServiceIcon, TipsGrid]);

  // Handle URL parameters
  useEffect(() => {
    const tipId = searchParams.get("tipId");
    if (tipId) {
      // Find the tip in current tips data (now searches all tips)
      const tip = allTips.find((t) => t.code === tipId);
      if (tip) {
        setSelectedTip(tip);
      }
    }
  }, [searchParams, allTips]);

  const handleSaveTip = useCallback(
    (tip: any) => {
      toast({
        title: "Tip Saved",
        description: `"${tip.name}" has been saved to your collection.`,
      });
    },
    [toast]
  );

  const handleShareTip = useCallback(
    (tip: any) => {
      toast({
        title: "Sharing Tip",
        description: `Share option for "${tip.name}" would open here.`,
      });
    },
    [toast]
  );

  const serviceCount = Object.keys(tabComponents).length;

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={defaultTab}
        tabComponents={tabComponents}
        urlMapping={urlMapping}
        tabsListClassName={`grid grid-cols-${Math.min(
          serviceCount,
          4
        )} md:w-[400px]`}
        idPrefix="tips-tab"
        className="space-y-4"
        level={1}
      />

      {selectedTip && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="max-w-[85%]">
                <CardTitle className="text-xl font-semibold">
                  {selectedTip.name}
                </CardTitle>
              </div>
              <div className="shrink-0">
                {selectedTip.icon ? (
                  getTipIcon(selectedTip.icon)
                ) : (
                  <Info className="text-4xl text-gray-500" />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-sm mb-1">Quick Summary</p>
              <p className="text-muted-foreground">
                {selectedTip.quickSummary}
              </p>
            </div>

            <div>
              <p className="font-medium text-sm mb-1">Detailed Information</p>
              <p className="text-muted-foreground">{selectedTip.description}</p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={() => setSelectedTip(null)}>
              Back to Tips
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleSaveTip(selectedTip)}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareTip(selectedTip)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default EfficiencyTips;
