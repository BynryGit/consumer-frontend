import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Tabs } from '@shared/ui/tabs';
import { Badge } from '@shared/ui/badge';
import { useToast } from '@shared/hooks/use-toast';
import { Lightbulb, Droplet, Flame, ThumbsUp, Bookmark, Share2 } from 'lucide-react';

const tipCategories = {
  electricity: [{
    id: 'e1',
    title: 'Switch to LED Lighting',
    description: 'Replace incandescent bulbs with LED bulbs to save up to 80% on lighting energy costs.',
    savings: 'High',
    effort: 'Low',
    details: 'LED bulbs last up to 25 times longer than incandescent lighting and use at least 75% less energy. While the upfront cost is higher, the long-term savings are substantial.',
    image: '💡'
  }, {
    id: 'e2',
    title: 'Optimize Thermostat Settings',
    description: 'Set your thermostat to 68°F in winter and 78°F in summer to reduce heating and cooling costs.',
    savings: 'High',
    effort: 'Low',
    details: "Each degree adjustment can save approximately 1-3% on your energy bill. Consider installing a programmable or smart thermostat to automatically adjust temperatures when you're away or sleeping.",
    image: '🌡️'
  }, {
    id: 'e3',
    title: 'Unplug Electronics When Not in Use',
    description: 'Many devices continue to draw power even when turned off. Unplug them or use power strips.',
    savings: 'Medium',
    effort: 'Medium',
    details: 'These "phantom loads" can account for up to 10% of your electricity bill. Smart power strips can help manage multiple devices and eliminate standby power consumption.',
    image: '🔌'
  }, {
    id: 'e4',
    title: 'Use Energy-Efficient Appliances',
    description: 'Choose ENERGY STAR rated appliances when replacing old ones to save electricity and water.',
    savings: 'High',
    effort: 'High',
    details: 'ENERGY STAR appliances use 10-50% less energy than standard models. Look for rebates from your utility provider when purchasing energy-efficient appliances.',
    image: '🧺'
  }, {
    id: 'e5',
    title: 'Improve Home Insulation',
    description: 'Properly insulate your home to reduce heating and cooling energy waste.',
    savings: 'High',
    effort: 'High',
    details: 'Insulation can reduce your heating and cooling costs by up to 20%. Focus on attics, walls, floors, and sealing air leaks around doors and windows.',
    image: '🏠'
  }, {
    id: 'e6',
    title: 'Use Ceiling Fans Year-Round',
    description: 'Use ceiling fans to circulate air and reduce the need for air conditioning.',
    savings: 'Medium',
    effort: 'Low',
    details: 'In summer, run fans counterclockwise to create a cooling breeze. In winter, run them clockwise at low speed to circulate warm air from the ceiling down to living spaces.',
    image: '💨'
  }],
  water: [{
    id: 'w1',
    title: 'Fix Leaking Faucets and Toilets',
    description: 'A dripping faucet can waste up to 3,000 gallons per year. Check and repair leaks promptly.',
    savings: 'Medium',
    effort: 'Medium',
    details: 'To check for toilet leaks, add food coloring to the tank. If color appears in the bowl without flushing, you have a leak that should be repaired.',
    image: '🚿'
  }, {
    id: 'w2',
    title: 'Install Low-Flow Fixtures',
    description: 'Replace standard showerheads and faucets with low-flow alternatives to reduce water usage.',
    savings: 'High',
    effort: 'Low',
    details: 'Low-flow showerheads can reduce water consumption by up to 60% while still providing a satisfying shower experience. Most are inexpensive and easy to install.',
    image: '💧'
  }, {
    id: 'w3',
    title: 'Water Lawn Efficiently',
    description: 'Water early in the morning or late in the evening to minimize evaporation.',
    savings: 'High',
    effort: 'Low',
    details: 'Up to 30% of water can be lost to evaporation when watering during midday heat. Consider installing a smart irrigation system that adjusts based on weather conditions.',
    image: '🌱'
  }, {
    id: 'w4',
    title: 'Collect Rainwater',
    description: 'Use rain barrels to collect rainwater for garden and lawn watering.',
    savings: 'Medium',
    effort: 'Medium',
    details: "A 55-gallon rain barrel can fill up during a single moderate rainfall. This water is free and ideal for plants since it's naturally soft and free of chemicals.",
    image: '☔'
  }, {
    id: 'w5',
    title: 'Upgrade to High-Efficiency Toilets',
    description: 'Replace older toilets with high-efficiency models to save thousands of gallons annually.',
    savings: 'High',
    effort: 'High',
    details: 'Older toilets can use up to 6 gallons per flush, while new high-efficiency models use 1.28 gallons or less. This can save a family of four over 16,000 gallons per year.',
    image: '🚽'
  }, {
    id: 'w6',
    title: 'Use Full Loads for Washing',
    description: 'Only run washing machines and dishwashers with full loads to maximize water efficiency.',
    savings: 'Medium',
    effort: 'Low',
    details: "Modern dishwashers actually use less water than hand washing, provided they're run with full loads. Similarly, washing machines are most efficient when fully loaded.",
    image: '👕'
  }],
  gas: [{
    id: 'g1',
    title: 'Tune Up Your Heating System',
    description: 'Regular maintenance of your furnace or boiler can improve efficiency by up to 15%.',
    savings: 'High',
    effort: 'Medium',
    details: 'Annual professional maintenance ensures your heating system runs at peak efficiency. Simple tasks like changing filters regularly can also improve performance.',
    image: '🔥'
  }, {
    id: 'g2',
    title: 'Lower Water Heater Temperature',
    description: 'Set your water heater to 120°F to save energy while still providing comfortable hot water.',
    savings: 'Medium',
    effort: 'Low',
    details: 'Every 10°F reduction in water temperature can save 3-5% on water heating costs. This setting also reduces the risk of scalding.',
    image: '🚿'
  }, {
    id: 'g3',
    title: 'Use Cold Water for Laundry',
    description: 'Wash clothes in cold water to reduce the energy used for water heating.',
    savings: 'Medium',
    effort: 'Low',
    details: 'Up to 90% of the energy used for washing clothes comes from heating the water. Modern detergents work effectively in cold water for most loads.',
    image: '🧺'
  }, {
    id: 'g4',
    title: 'Install Reflective Panels Behind Radiators',
    description: 'Place reflective panels behind radiators on external walls to reflect heat back into the room.',
    savings: 'Low',
    effort: 'Low',
    details: 'This inexpensive solution can increase the effectiveness of your heating system by preventing heat from being absorbed by the wall behind the radiator.',
    image: '📝'
  }, {
    id: 'g5',
    title: 'Weatherize Your Home',
    description: 'Seal drafts around doors, windows, and other openings to prevent heat loss.',
    savings: 'High',
    effort: 'Medium',
    details: 'Air leaks can account for 25-40% of the energy used for heating and cooling. Simple weatherstripping and caulking can significantly improve efficiency.',
    image: '🏠'
  }, {
    id: 'g6',
    title: 'Use a Programmable Thermostat',
    description: "Install a programmable thermostat to automatically lower temperatures when you're away or sleeping.",
    savings: 'High',
    effort: 'Medium',
    details: "You can save up to 10% per year on heating costs by turning your thermostat down 7-10°F for 8 hours a day. A programmable thermostat makes this easy and consistent.",
    image: '🌡️'
  }]
};

// Helper function to generate badge color based on savings/effort level
const getBadgeVariant = (level: string, type: 'savings' | 'effort') => {
  if (type === 'savings') {
    switch (level) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  } else {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return '';
    }
  }
};

const EfficiencyTips = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedTip, setSelectedTip] = useState<any>(null);

  useEffect(() => {
    const tipId = searchParams.get('tipId');
    if (tipId) {
      // Find the tip across all categories
      const allTips = [
        ...tipCategories.electricity,
        ...tipCategories.water,
        ...tipCategories.gas
      ];
      const tip = allTips.find(t => t.id === tipId);
      if (tip) {
        setSelectedTip(tip);
      }
    }
  }, [searchParams]);

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
            <Button variant="outline" className="w-full" onClick={() => setSelectedTip(tip)}>
              Learn More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const tabComponents = {
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
  };

  const urlMapping = {
    electricity: "electricity",
    water: "water",
    gas: "gas"
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="electricity"
        tabComponents={tabComponents}
        urlMapping={urlMapping}
        tabsListClassName="grid grid-cols-3 md:w-[400px]"
        idPrefix="tips-tab"
        className="space-y-4"
      />
      
      {selectedTip && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedTip.title}</CardTitle>
              </div>
              <div className="text-center text-4xl">{selectedTip.image}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-sm mb-2">Quick Summary</p>
              <p className="text-muted-foreground">{selectedTip.description}</p>
            </div>
            
            <div>
              <p className="font-medium text-sm mb-2">Detailed Information</p>
              <p className="text-muted-foreground">{selectedTip.details}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedTip(null)}>
              Back to Tips
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleSaveTip(selectedTip)}>
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShareTip(selectedTip)}>
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