import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Separator } from '@shared/ui/separator';
import { User, Users, FileText, MapPin, Mail, Activity, Settings, Bell, Wallet, Edit, Eye } from 'lucide-react';

interface ProfileTabProps {
  onEditClick: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onEditClick }) => {
  const profileData = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+91 98765 43210",
    plan: "Residential Standard Plan",
    category: "Residential",
    subCategory: "Individual",
    customerSince: "2019-03-15",
    accountNumber: "ACC-001234567",
    billingCycle: "Monthly"
  };

  const addresses = {
    billing: {
      street: "123 Main Street, Apt 4B",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001"
    },
    service: {
      street: "123 Main Street, Apt 4B",
      city: "New Delhi", 
      state: "Delhi",
      pincode: "110001"
    }
  };

  const kycDocuments = [
    { name: "Aadhaar Card", fileName: "aadhaar_card_john_smith.pdf", status: "Verified", uploadDate: "2024-01-15" },
    { name: "PAN Card", fileName: "pan_card_john_smith.pdf", status: "Verified", uploadDate: "2024-01-15" },
    { name: "Address Proof", fileName: "utility_bill_proof.pdf", status: "Verified", uploadDate: "2024-01-16" }
  ];

  const secondaryPersons = [
    {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+91 98765 43211",
      email: "jane.smith@email.com"
    }
  ];

  const accountActivity = [
    { date: "2024-12-08", action: "Bill Payment", amount: "₹2,450", status: "Completed" },
    { date: "2024-12-05", action: "Meter Reading", amount: "-", status: "Verified" },
    { date: "2024-11-28", action: "Service Request", amount: "-", status: "Resolved" },
    { date: "2024-11-25", action: "Profile Update", amount: "-", status: "Completed" }
  ];

  const preferences = {
    notifications: {
      email: true,
      sms: true,
      push: false,
      billReminders: true,
      outageAlerts: true,
      promotions: false
    },
    billing: {
      paperless: true,
      autoPay: true,
      currency: "INR",
      language: "English"
    }
  };

  const handleViewDocument = (fileName: string) => {
    console.log(`Viewing document: ${fileName}`);
    alert(`Opening ${fileName}...`);
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
      case 'Completed':
      case 'Resolved':
        return <div className="h-4 w-4 text-green-600" />;
      case 'Pending':
        return <div className="h-4 w-4 text-yellow-600" />;
      case 'Under Review':
        return <div className="h-4 w-4 text-orange-600" />;
      default:
        return <div className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
      case 'Completed':
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Details with Secondary Persons */}
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">VIP</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditClick}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Profile Information */}
          <div>
            <h4 className="text-sm font-medium text-primary-600 mb-3">Primary Account Holder</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Name</label>
                <p className="text-sm mt-1 font-semibold">{profileData.name}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Email</label>
                <p className="text-sm mt-1 font-semibold">{profileData.email}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Phone</label>
                <p className="text-sm mt-1 font-semibold">{profileData.phone}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Account Number</label>
                <p className="text-sm mt-1 font-semibold">{profileData.accountNumber}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Customer Since</label>
                <p className="text-sm mt-1 font-semibold">{new Date(profileData.customerSince).toLocaleDateString()}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Plan</label>
                <p className="text-sm mt-1 font-semibold">{profileData.plan}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Category</label>
                <p className="text-sm mt-1 font-semibold">{profileData.category}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">Billing Cycle</label>
                <p className="text-sm mt-1 font-semibold">{profileData.billingCycle}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Secondary Persons */}
          <div>
            <h4 className="text-sm font-medium text-primary-600 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Secondary Persons
            </h4>
            <div className="space-y-3">
              {secondaryPersons.map((person, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-primary-200 hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary-600">Name</label>
                      <p className="text-sm mt-1 font-semibold">{person.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary-600">Relationship</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-primary-100 text-primary-700">{person.relationship}</Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary-600">Phone</label>
                      <p className="text-sm mt-1 font-semibold">{person.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary-600">Email</label>
                      <p className="text-sm mt-1 font-semibold">{person.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Documents and Addresses Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Documents */}
        <Card className="border-l-4 border-l-secondary bg-gradient-to-r from-secondary-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-secondary rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              KYC Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kycDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      <FileText className="h-4 w-4 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.fileName)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Badge variant={doc.status === 'Verified' ? 'default' : 'secondary'} className="bg-green-100 text-green-800">
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              Addresses
            </CardTitle>
            <CardDescription>
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
      </div>

      {/* Account Activity and Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Activity */}
        <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your recent account transactions and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount !== "-" && (
                      <p className="text-sm font-semibold">{activity.amount}</p>
                    )}
                    <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              Preferences
            </CardTitle>
            <CardDescription>
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
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-xs">Bill Reminders</span>
                  <Badge variant={preferences.notifications.billReminders ? "default" : "secondary"} className="text-xs">
                    {preferences.notifications.billReminders ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-xs">Outage Alerts</span>
                  <Badge variant={preferences.notifications.outageAlerts ? "default" : "secondary"} className="text-xs">
                    {preferences.notifications.outageAlerts ? "On" : "Off"}
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
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-xs">Auto Pay</span>
                  <Badge variant={preferences.billing.autoPay ? "default" : "secondary"} className="text-xs">
                    {preferences.billing.autoPay ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileTab;