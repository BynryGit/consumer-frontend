import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
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
import { useUtilityServices, useTipsData, useUpdateTipsStatus } from "../hooks";

// Payload interface for the helpful mutation
interface AddHelpfullPayload {
  code: string;
  remote_utility_id: string;
  is_helpful: number;
}

// Separate component for tips grid to avoid hook violations
const TipsGrid = React.memo(({ 
  tips, 
  onTipSelect,
  getTipIcon 
}: { 
  tips: any[]; 
  onTipSelect: (tip: any) => void;
  getTipIcon: (iconName: string) => React.ReactNode;
}) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {tips.map((tip) => (
      <Card key={tip.code} className="flex flex-col h-64 overflow-hidden">
        <CardHeader className="pb-3 text-center flex-shrink-0">
          <div className="flex justify-center mb-3">
            {tip.icon ? (
              <div className="text-6xl">
                {getTipIcon(tip.icon)}
              </div>
            ) : (
              <Info className="text-6xl text-gray-500" />
            )}
          </div>
          <CardTitle className="text-lg font-semibold leading-tight">
            {tip.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col px-4 pb-0">
          <p className="text-sm text-muted-foreground line-clamp-4 flex-1">
            {tip.quickSummary || tip.description}
          </p>
        </CardContent>
        <CardFooter className="pt-4 pb-4 px-4 flex-shrink-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onTipSelect(tip)}
          >
            Learn More
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
));

const EfficiencyTips = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [selectedUtility, setSelectedUtility] = useState<string>("");
  const [helpfulTips, setHelpfulTips] = useState<Set<string>>(new Set());
  const [debugCounter, setDebugCounter] = useState(0); // Force re-render counter

  // Get utility services from API
  const { remoteUtilityId } = getLoginDataFromStorage();
  const { data: utilityServicesData, isLoading: servicesLoading } =
    useUtilityServices({
      utility_id: remoteUtilityId,
    });

  // Helpful mutation hook
  const { mutate: updateTipsStatus, isPending: isUpdatingHelpful } = useUpdateTipsStatus();

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
      console.log('Setting default utility:', activeServices[0].name);
      setSelectedUtility(activeServices[0].name);
    }
  }, [activeServices, selectedUtility]);

  // Fetch tips data for selected utility - with comprehensive debugging
  console.log('🔍 Hook Call Parameters:', {
    remote_utility_id: remoteUtilityId,
    utility_service: selectedUtility,
    show_inactive: true,
    debugCounter
  });

  const { data: tipsData, isLoading: tipsLoading, error: tipsError } = useTipsData({
    remote_utility_id: remoteUtilityId,
    utility_service: selectedUtility,
    show_inactive: true,
  });

  // Debug: Log when selectedUtility changes
  useEffect(() => {
    console.log('🔄 selectedUtility changed to:', selectedUtility);
    console.log('🔄 remoteUtilityId:', remoteUtilityId);
    console.log('🔄 debugCounter:', debugCounter);
  }, [selectedUtility, remoteUtilityId, debugCounter]);

  // Debug: Log tips data changes
  useEffect(() => {
    console.log('📊 Tips data updated:', tipsData);
    console.log('📊 Tips loading:', tipsLoading);
    console.log('📊 Tips error:', tipsError);
  }, [tipsData, tipsLoading, tipsError]);

  // Alternative approach: Manual API call when selectedUtility changes
  useEffect(() => {
    if (selectedUtility && remoteUtilityId) {
      console.log('🚀 Triggering manual tips fetch for:', selectedUtility);
      
      // You can add a manual API call here if the hook isn't working
      // Example:
      // fetchTipsManually({
      //   remote_utility_id: remoteUtilityId,
      //   utility_service: selectedUtility,
      //   show_inactive: true
      // });
    }
  }, [selectedUtility, remoteUtilityId]);

  // Helper functions
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
        return <Lightbulb className="text-6xl text-yellow-500" />;
      case "info":
        return <Info className="text-6xl text-gray-500" />;
      case "alert-triangle":
        return <AlertTriangle className="text-6xl text-red-500" />;
      case "check-circle":
        return <CheckCircle className="text-6xl text-green-500" />;
      case "help-circle":
        return <HelpCircle className="text-6xl text-blue-400" />;
      case "star":
        return <Star className="text-6xl text-yellow-400" />;
      case "zap":
      case "electric":
        return <Zap className="text-6xl text-purple-500" />;
      case "target":
        return <Target className="text-6xl text-pink-500" />;
      case "shield":
        return <Shield className="text-6xl text-slate-600" />;
      case "clock":
        return <Clock className="text-6xl text-teal-600" />;
      case "users":
        return <Users className="text-6xl text-orange-600" />;
      case "settings":
        return <Settings className="text-6xl text-gray-600" />;
      case "file-text":
        return <FileText className="text-6xl text-indigo-500" />;
      case "droplet":
      case "water":
        return <Droplet className="text-6xl text-blue-500" />;
      case "flame":
      case "fire":
      case "gas":
        return <Flame className="text-6xl text-orange-500" />;
      default:
        return <Info className="text-6xl text-gray-500" />;
    }
  }, []);

  // Get ALL tips for current utility
  const allTips = useMemo(() => {
    if (!tipsData?.result) return [];
    return tipsData.result;
  }, [tipsData]);

  // Handle helpful button click
  const handleHelpfulClick = useCallback(
    (tip: any) => {
      if (helpfulTips.has(tip.code) || isUpdatingHelpful) return;

      const payload: AddHelpfullPayload = {
        code: tip.code,
        remote_utility_id: remoteUtilityId,
        is_helpful: 1
      };

      updateTipsStatus(payload, {
        onSuccess: () => {
          setHelpfulTips(prev => new Set([...prev, tip.code]));
          toast({
            title: "Thank you!",
            description: `Your feedback for "${tip.name}" has been recorded.`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to record your feedback. Please try again.",
            variant: "destructive",
          });
        }
      });
    },
    [helpfulTips, isUpdatingHelpful, remoteUtilityId, updateTipsStatus, toast]
  );

  // Handle URL parameters
  useEffect(() => {
    const tipId = searchParams.get("tipId");
    if (tipId) {
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

  // Watch for URL changes to detect tab changes (workaround)
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentTabParam = searchParams.get('tab1'); // Based on level={1}
    
    if (currentTabParam) {
      console.log('🎯 URL tab changed to:', currentTabParam);
      
      // Find the service by tab key
      const service = activeServices.find(s => 
        s.name.toLowerCase().replace(/\s+/g, "") === currentTabParam
      );
      
      if (service && service.name !== selectedUtility) {
        console.log('🎯 Found service via URL:', service.name);
        console.log('🎯 Previous selectedUtility:', selectedUtility);
        
        setSelectedUtility(service.name);
        setDebugCounter(prev => prev + 1);
        
        console.log('🎯 Setting selectedUtility to:', service.name);
        
        toast({
          title: "Switched to " + service.name,
          description: `Viewing tips for ${service.name} service`,
        });
      }
    }
  }, [location.search, activeServices, selectedUtility, toast]);

  // Create stable tab components without onClick (Tabs handles value change)
  const tabComponents = useMemo(() => {
    const components: Record<string, any> = {};
    const mapping: Record<string, string> = {};

    activeServices.forEach((service, index) => {
      const key = service.name.toLowerCase().replace(/\s+/g, "");
      
      components[key] = {
        label: service.name,
        shortLabel: service.name,
        icon: getServiceIcon(service.name),
        component: (
          <TipsGrid 
            tips={allTips} 
            onTipSelect={setSelectedTip}
            getTipIcon={getTipIcon}
          />
        ),
      };
      mapping[key] = key;
    });

    console.log('Tab components created:', Object.keys(components));
    return { components, mapping };
  }, [activeServices, allTips, getServiceIcon, getTipIcon]);

  const serviceCount = Object.keys(tabComponents.components).length;
  const isCurrentTipHelpful = selectedTip && helpfulTips.has(selectedTip.code);
  const defaultTab = Object.keys(tabComponents.components)[0] || "";

  // Don't render if no services
  if (serviceCount === 0) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={defaultTab}
        tabComponents={tabComponents.components}
        urlMapping={tabComponents.mapping}
       tabsListClassName={`grid grid-cols-${serviceCount}`}
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
                  <Info className="text-6xl text-gray-500" />
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
              <Button 
                size="sm"
                disabled={isCurrentTipHelpful || isUpdatingHelpful}
                onClick={() => handleHelpfulClick(selectedTip)}
                variant={isCurrentTipHelpful ? "default" : "outline"}
                className={isCurrentTipHelpful ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isUpdatingHelpful ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ThumbsUp className="h-4 w-4 mr-1" />
                )}
                {isCurrentTipHelpful ? "Marked Helpful" : "Helpful"}
              </Button>
            </div>
          </CardFooter> 
        </Card>
      )}
    </div>
  );
};

export default EfficiencyTips;