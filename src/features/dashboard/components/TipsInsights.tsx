import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTipsData } from '../hooks';

const TipsInsights = () => {
  const { remoteUtilityId } = getLoginDataFromStorage();
  
  const { data: tipsData } = useTipsData({
    remote_utility_id: remoteUtilityId,
    is_pagination_required: true,
    show_inactive: true,
    page: 1,
    limit: 3
  });

  // Transform API data to component format
  const transformedTips = tipsData?.result?.map(tip => ({
    id: tip.code,
    title: tip.name,
    description: tip.description,
    category: tip.utilityService,
    image: getEmojiForService(tip.utilityService),
    color: getColorForService(tip.utilityService),
    isActive: tip.isActive
  })) || [];

  // Helper function to get emoji based on utility service
  function getEmojiForService(service) {
    const emojiMap = {
      'Water': '💧',
      'Electricity': '💡',
      'Gas': '🔥',
      'Hot Water': '🌡️',
      'Waste Water': '♻️'
    };
    return emojiMap[service] || '💡';
  }

  // Helper function to get color based on utility service
  function getColorForService(service) {
    const colorMap = {
      'Water': 'blue',
      'Electricity': 'yellow',
      'Gas': 'orange',
      'Hot Water': 'red',
      'Waste Water': 'green'
    };
    return colorMap[service] || 'gray';
  }

  return (
    <Card>
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
          {transformedTips && transformedTips.length > 0 ? (
            transformedTips.map(tip => (
              <Card key={tip.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{tip.image}</div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-base">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tip.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full bg-${tip.color}-100 text-${tip.color}-800`}>
                          {tip.category}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/usage-consumption?tab=tips&tipId=${tip.id}`}>Learn More</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No tips available at the moment</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TipsInsights;