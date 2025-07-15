import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { Clock, CheckCircle } from "lucide-react";

export interface TimelineItem {
  id: number | string;
  action: string;
  description: string;
  timestamp: string;
  status: "completed" | "current" | "pending" | string;
}

interface TimelineTabProps {
  timeline: TimelineItem[];
  title?: string;
  icon?: React.ReactNode;
  idPrefix?: string;
}

const TimelineTab: React.FC<TimelineTabProps> = ({
  timeline,
  title = "Activity Timeline",
  icon = <Clock className="h-4 w-4" />,
  idPrefix = "timeline-tab",
}) => {
  return (
    <Card className="bg-indigo-50/30 border-indigo-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((activity, index) => (
            <div
              key={activity.id}
              className="relative flex items-start space-x-4"
            >
              <div className="flex-shrink-0 relative">
                {activity.status === "completed" && (
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {activity.status === "current" && (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                  </div>
                )}
                {activity.status === "pending" && (
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                  </div>
                )}
                {index < timeline.length - 1 && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 h-8 w-px bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{activity.action}</h4>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineTab; 