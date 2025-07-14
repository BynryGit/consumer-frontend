
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Lightbulb, Droplet, Flame, Building, Link2 } from 'lucide-react';

const AccountOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Meter Numbers</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3 text-[#ffcc00]" />
              <span>EL-38429175</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="h-3 w-3 text-[#0099cc]" />
              <span>WT-74526813</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-[#ff6633]" />
              <span>GS-91527364</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Property Address</h3>
          <div className="flex items-start gap-1">
            <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">123 Main Street, Apt 4B<br />New Delhi, 110001</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Linked Services</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Link2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">Electricity (Standard Plan)</span>
            </div>
            <div className="flex items-center gap-1">
              <Link2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">Water (Metered)</span>
            </div>
            <div className="flex items-center gap-1">
              <Link2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">Gas (Fixed Rate)</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Plan Details</h3>
          <div className="text-sm">
            <p>Tariff: Residential Standard</p>
            <p>Contract Expiry: March 31, 2026</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountOverview;
