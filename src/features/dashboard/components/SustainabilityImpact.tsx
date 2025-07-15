
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { TrendingUp } from 'lucide-react';

const SustainabilityImpact = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-neutral-500">Sustainability Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">80 kg</div>
            <p className="text-xs text-neutral-500">CO2 saved this month</p>
          </div>
          <div className="h-8 w-8 text-green-500 p-1 bg-green-50 rounded-full flex items-center justify-center">
            🌱
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-success flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Water usage reduced by 5%</span>
          </div>
          <div className="text-xs text-success flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Equivalent to planting 8 trees</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityImpact;
