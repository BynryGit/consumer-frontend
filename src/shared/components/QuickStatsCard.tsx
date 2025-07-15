import { QuickStatsCardProps } from "@shared/types/quickStatsCardProps";
import { Card, CardContent } from "@shared/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";


export function QuickStatsCard({
  title,
  count,
  displayValue,
  trend,
  trendSummary,
  icon,
}: QuickStatsCardProps) {
  const trendDirectionStat = trend > 0 ? "up" : trend < 0 ? "down" : "neutral";

  return (
    <Card>
      <CardContent className="py-2">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{displayValue || count}</p>
            <div className="flex items-center mt-1">
              {typeof trend === "number" ? (
                trendDirectionStat !== "neutral" ? (
                  <span
                    className={`flex items-center text-xs ${
                      trendDirectionStat === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trendDirectionStat === "up" ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {trend}% from yesterday
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No change from yesterday
                  </span>
                )
              ) : (
                <span className="text-xs text-muted-foreground">
                  {trendSummary || "No trend data available"}
                </span>
              )}
            </div>
          </div>
          <div className="bg-muted/20 p-3 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
