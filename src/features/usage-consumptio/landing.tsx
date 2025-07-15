import React from 'react';
import { Tabs } from "@shared/ui/tabs";
import { BarChart2, ArrowLeftRight, TrendingUp, Lightbulb, Droplet, Flame } from 'lucide-react';
import UsageComparison from './components/UsageComparison';
import UsageCharts from './components/UsageCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useToast } from '@shared/hooks/use-toast';
import { ThumbsUp, Bookmark, Share2 } from 'lucide-react';

const UsageDashboard = () => {
  const { toast } = useToast();

  // Tip categories data
  const tipCategories = {
    electricity: [{
      id: 'e1',
      title: 'Switch to LED Lighting',
      description: 'Replace incandescent bulbs with LED bulbs to save up to 80% on lighting energy costs.',
      savings: 'High',
      effort: 'Low',
      details: 'LED bulbs last up to 25 times longer than incandescent lighting and use at least 75% less energy.',
      image: '💡'
    }, {
      id: 'e2',
      title: 'Optimize Thermostat Settings',
      description: 'Set your thermostat to 68°F in winter and 78°F in summer to reduce heating and cooling costs.',
      savings: 'High',
      effort: 'Low',
      details: "Each degree adjustment can save approximately 1-3% on your energy bill.",
      image: '🌡️'
    }, {
      id: 'e3',
      title: 'Unplug Electronics When Not in Use',
      description: 'Many devices continue to draw power even when turned off. Unplug them or use power strips.',
      savings: 'Medium',
      effort: 'Medium',
      details: 'These "phantom loads" can account for up to 10% of your electricity bill.',
      image: '🔌'
    }],
    water: [{
      id: 'w1',
      title: 'Fix Leaking Faucets and Toilets',
      description: 'A dripping faucet can waste up to 3,000 gallons per year. Check and repair leaks promptly.',
      savings: 'Medium',
      effort: 'Medium',
      details: 'To check for toilet leaks, add food coloring to the tank.',
      image: '🚿'
    }, {
      id: 'w2',
      title: 'Install Low-Flow Fixtures',
      description: 'Replace standard showerheads and faucets with low-flow alternatives to reduce water usage.',
      savings: 'High',
      effort: 'Low',
      details: 'Low-flow showerheads can reduce water consumption by up to 60%.',
      image: '💧'
    }],
    gas: [{
      id: 'g1',
      title: 'Tune Up Your Heating System',
      description: 'Regular maintenance of your furnace or boiler can improve efficiency by up to 15%.',
      savings: 'High',
      effort: 'Medium',
      details: 'Annual professional maintenance ensures your heating system runs at peak efficiency.',
      image: '🔥'
    }, {
      id: 'g2',
      title: 'Lower Water Heater Temperature',
      description: 'Set your water heater to 120°F to save energy while still providing comfortable hot water.',
      savings: 'Medium',
      effort: 'Low',
      details: 'Every 10°F reduction in water temperature can save 3-5% on water heating costs.',
      image: '🚿'
    }]
  };

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
      component: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Energy Efficiency Tips</h2>
            <p className="text-muted-foreground">
              Discover practical ways to reduce your utility costs and environmental impact.
            </p>
          </div>
        </div>
      ),
      // Using subTabs feature of your tab service
      subTabs: {
        electricity: {
          label: "Electricity",
          shortLabel: "Electric",
          icon: <Lightbulb className="h-4 w-4 text-yellow-500" />,
          component: <TipsGrid tips={tipCategories.electricity} />
        },
        water: {
          label: "Water",
          shortLabel: "Water", 
          icon: <Droplet className="h-4 w-4 text-blue-500" />,
          component: <TipsGrid tips={tipCategories.water} />
        },
        gas: {
          label: "Gas",
          shortLabel: "Gas",
          icon: <Flame className="h-4 w-4 text-orange-500" />,
          component: <TipsGrid tips={tipCategories.gas} />
        }
      },
      subTabsUrlMapping: {
        electricity: "electricity",
        water: "water",
        gas: "gas"
      },
      defaultSubTab: "electricity"
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
      />
    </div>
  );
};

export default UsageDashboard;