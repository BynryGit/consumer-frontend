import React from "react";
import { Card, CardHeader, CardTitle, CardContent} from "@shared/ui/card";
import { User, Edit } from "lucide-react";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";

export const ProfileDetails = ({ profileData, isVip, onEditClick }) => (
  <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary-50 to-white">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          Profile Details
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {isVip ? "VIP" : "Regular"}
          </Badge>
          <Button variant="outline" size="sm" onClick={onEditClick} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>Name: {profileData.name}</div>
      <div>Email: {profileData.email}</div>
      <div>Phone: {profileData.phone}</div>
      <div>Account Number: {profileData.accountNumber}</div>
      <div>Customer Since: {profileData.customerSince !== "N/A" ? new Date(profileData.customerSince).toLocaleDateString() : "N/A"}</div>
      <div>Plan: {profileData.plan}</div>
      <div>Category: {profileData.category}</div>
      <div>Billing Cycle: {profileData.billingCycle}</div>
    </CardContent>
  </Card>
); 