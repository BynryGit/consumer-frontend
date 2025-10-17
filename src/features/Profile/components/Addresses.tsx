import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@shared/ui/card";
import { MapPin, Mail } from "lucide-react";
import { Badge } from "@shared/ui/badge";
export const Addresses = ({ addresses }) => (
  <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="p-2 bg-blue-500 rounded-lg">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        Addresses
      </CardTitle>
      <CardDescription className="p-2">
        Your billing and service locations for utility connections
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-green-100 rounded">
            <MapPin className="h-4 w-4 text-green-600" />
          </div>
          <h4 className="text-sm font-medium text-green-700">Service Address</h4>
          <Badge variant="outline" className="text-xs">Primary Location</Badge>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium">{addresses.service.street}</p>
          <p className="text-sm text-muted-foreground">{addresses.service.city}, {addresses.service.state} - {addresses.service.pincode}</p>
          <p className="text-xs text-green-600 mt-2">Where utility services are provided</p>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-blue-100 rounded">
            <Mail className="h-4 w-4 text-blue-600" />
          </div>
          <h4 className="text-sm font-medium text-blue-700">Billing Address</h4>
          <Badge variant="outline" className="text-xs">Invoice Location</Badge>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium">{addresses.billing.street}</p>
          <p className="text-sm text-muted-foreground">{addresses.billing.city}, {addresses.billing.state} - {addresses.billing.pincode}</p>
          <p className="text-xs text-blue-600 mt-2">Where bills and statements are sent</p>
        </div>
      </div>
    </CardContent>
  </Card>
); 