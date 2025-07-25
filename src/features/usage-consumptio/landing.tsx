import React from 'react';
import { Tabs } from "@shared/ui/tabs";
import { BarChart2, ArrowLeftRight, TrendingUp, Lightbulb, Droplet, Flame } from 'lucide-react';
import UsageComparison from './components/UsageComparison';
import UsageCharts from './components/UsageCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useToast } from '@shared/hooks/use-toast';
import EfficiencyTips from './components/EfficiencyTips';


const UsageDashboard = () => {
  const { toast } = useToast();



  const getBadgeVariant = (level: string, type: 'savings' | 'effort') => {
    if (type === 'savings') {
      switch (level) {
        case 'High': return 'bg-green-100 text-green-800 border-green-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Low': return 'bg-red-100 text-red-800 border-red-200';
        default: return '';
      }
    } else {
      switch (level) {
        case 'Low': return 'bg-green-100 text-green-800 border-green-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'High': return 'bg-red-100 text-red-800 border-red-200';
        default: return '';
      }
    }
  };

  const handleSaveTip = (tip: any) => {
    toast({
      title: "Tip Saved",
      description: `"${tip.title}" has been saved to your collection.`
    });
  };

  const handleShareTip = (tip: any) => {
    toast({
      title: "Sharing Tip", 
      description: `Share option for "${tip.title}" would open here.`
    });
  };

  // Component to render tips grid for each category
  const TipsGrid = ({ tips }: { tips: any[] }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tips.map(tip => (
        <Card key={tip.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="text-center text-3xl mb-2">{tip.image}</div>
            <CardTitle className="text-lg">{tip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{tip.description}</p>
            <div className="flex gap-2 mb-4">
              <Badge className={getBadgeVariant(tip.savings, 'savings')}>
                {tip.savings} Savings
              </Badge>
              <Badge className={getBadgeVariant(tip.effort, 'effort')}>
                {tip.effort} Effort
              </Badge>
            </div>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const tabComponents = {
    dashboard: {
      label: "Dashboard",
      shortLabel: "Charts",
      icon: <BarChart2 className="h-4 w-4" />,
      component: <UsageCharts />
    },
    comparison: {
      label: "Comparison",
      shortLabel: "Compare", 
      icon: <ArrowLeftRight className="h-4 w-4" />,
      component: <UsageComparison />
    },
    tips: {
      label: "Efficiency Tips",
      shortLabel: "Tips",
      icon: <Lightbulb className="h-4 w-4" />,
      component: <EfficiencyTips />
    }
  };

  const urlMapping = {
    dashboard: "dashboard",
    comparison: "comparison", 
    tips: "efficiency-tips"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usage & Consumption</h1>
        <p className="text-muted-foreground">Monitor, analyze and optimize your utility usage.</p>
      </div>

      <Tabs 
        defaultValue="dashboard"
        tabComponents={tabComponents}
        urlMapping={urlMapping}
        tabsListClassName="grid grid-cols-3 w-full"
        idPrefix="usage-tab"
        className="space-y-4"
        level={0}
      />
    </div>
  );
};

export default UsageDashboard;