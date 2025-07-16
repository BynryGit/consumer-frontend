import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
const tips = [{
  id: 'water-leak',
  title: 'Fix Water Leaks Early',
  description: 'Set up leak alerts to catch water wastage early. The average household wastes 10,000 liters annually from leaks.',
  category: 'Water',
  savings: 'High',
  effort: 'Medium',
  image: '💧',
  color: 'blue'
}, {
  id: 'led-lights',
  title: 'Switch to LED Lighting',
  description: 'Replace incandescent bulbs with LED bulbs to save up to 80% on lighting energy costs.',
  category: 'Electricity',
  savings: 'High',
  effort: 'Low',
  image: '💡',
  color: 'yellow'
}, {
  id: 'thermostat',
  title: 'Optimize Thermostat Settings',
  description: 'Set your thermostat to 68°F in winter and 78°F in summer to reduce heating and cooling costs.',
  category: 'Gas',
  savings: 'High',
  effort: 'Low',
  image: '🌡️',
  color: 'orange'
}];
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
const TipsInsights = () => {
  return <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            Tips & Insights
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Personalized recommendations to save on your utility bills
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/usage-consumption?tab=tips" className="flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map(tip => <Card key={tip.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{tip.image}</div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-base">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                    <div className="flex items-center justify-between">
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/usage-consumption?tab=tips&tipId=${tip.id}`}>Learn More</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </CardContent>
    </Card>;
};
export default TipsInsights;