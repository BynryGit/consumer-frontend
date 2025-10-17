import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription} from "@shared/ui/card";
import { Activity } from "lucide-react";
import { Badge } from "@shared/ui/badge";

export const RecentActivity = ({ accountActivity }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
      case "Completed":
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Under Review":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          Recent Activity
        </CardTitle>
        <CardDescription className="p-2">
          Your recent account transactions and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accountActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200"
            >
              <div className="flex items-center gap-3">
                <div className={`h-4 w-4 rounded-full ${getStatusColor(activity.status)}`}></div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                {activity.amount !== "N/A" && (
                  <p className="text-sm font-semibold">{activity.amount}</p>
                )}
                <Badge className={`text-xs ${getStatusColor(activity.status)}`}>{activity.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 