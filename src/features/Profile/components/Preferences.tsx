import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@shared/ui/card";
import { Settings, Bell, Wallet } from "lucide-react";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";

export const Preferences = ({ preferences }) => (
  <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="p-2 bg-orange-500 rounded-lg">
          <Settings className="h-5 w-5 text-white" />
        </div>
        Preferences
      </CardTitle>
      <CardDescription className="p-2">
        Your notification and billing preferences
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-orange-700 mb-3 flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-xs">Email</span>
            <Badge variant={preferences.notifications.email ? "default" : "secondary"} className="text-xs">
              {preferences.notifications.email ? "On" : "Off"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-xs">SMS</span>
            <Badge variant={preferences.notifications.sms ? "default" : "secondary"} className="text-xs">
              {preferences.notifications.sms ? "On" : "Off"}
            </Badge>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium text-orange-700 mb-3 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Billing
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-xs">Paperless Billing</span>
            <Badge variant={preferences.billing.paperless ? "default" : "secondary"} className="text-xs">
              {preferences.billing.paperless ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
); 