import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { Separator } from "@shared/ui/separator";
import {
  User,
  Users,
  FileText,
  MapPin,
  Mail,
  Activity,
  Settings,
  Bell,
  Wallet,
  Edit,
  Eye,
} from "lucide-react";
import { useActivityLog } from "../hooks";
import { logEvent } from "@shared/analytics/analytics";

interface ProfileTabProps {
  onEditClick: () => void;
  consumerDetailsData: any;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onEditClick, consumerDetailsData }) => {
    const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();
    const { data: activitylog } = useActivityLog({
      remote_utility_id: remoteUtilityId,
      consumer_no: remoteConsumerNumber,
      module: "cx"
    });
    useEffect(() => {
  logEvent("Profile Tab Viewed");
}, []);

  const profileData = {
    name: consumerDetailsData?.result
      ? `${consumerDetailsData.result.firstName || "N/A"} ${
          consumerDetailsData.result.lastName || "N/A"
        }`
      : "N/A",
    email: consumerDetailsData?.result?.email || "N/A",
    phone: consumerDetailsData?.result?.contactNumber || "N/A",
    plan: consumerDetailsData?.result?.planDetails?.planName || "N/A",
    category: consumerDetailsData?.result?.planDetails?.category || "N/A",
    subCategory: consumerDetailsData?.result?.planDetails?.subcategory || "N/A",
    customerSince: consumerDetailsData?.result?.registrationDate || "N/A",
    accountNumber: consumerDetailsData?.result?.consumerNo || "N/A",
    billingCycle:
      consumerDetailsData?.result?.billCycleData?.billCycleName ||
      "N/A",
  };

const addresses = {
  billing: {
    region:
      consumerDetailsData?.result?.territoryData?.billing?.region || "N/A",
    country:
      consumerDetailsData?.result?.territoryData?.billing?.country || "N/A",
    state:
      consumerDetailsData?.result?.territoryData?.billing?.state || "N/A",
    county:
      consumerDetailsData?.result?.territoryData?.billing?.county || "N/A",
    zone:
      consumerDetailsData?.result?.territoryData?.billing?.zone || "N/A",
    division:
      consumerDetailsData?.result?.territoryData?.billing?.division || "N/A",
    area:
      consumerDetailsData?.result?.territoryData?.billing?.area || "N/A",
    sub_area:
      consumerDetailsData?.result?.territoryData?.billing?.subArea || "N/A",
    premise:
      consumerDetailsData?.result?.territoryData?.billing?.premise || "N/A",
  },
  service: {
    region: 
      consumerDetailsData?.result?.territoryData?.service?.region || "N/A",
    country:
      consumerDetailsData?.result?.territoryData?.service?.country || "N/A",
    state:
      consumerDetailsData?.result?.territoryData?.service?.state || "N/A",
    county:
      consumerDetailsData?.result?.territoryData?.service?.county || "N/A",
    zone:
      consumerDetailsData?.result?.territoryData?.service?.zone || "N/A",
    division:
      consumerDetailsData?.result?.territoryData?.service?.division || "N/A",
    area:
      consumerDetailsData?.result?.territoryData?.service?.area || "N/A",
    sub_area:
      consumerDetailsData?.result?.territoryData?.service?.subArea || "N/A",
    premise:
      consumerDetailsData?.result?.territoryData?.service?.premise || "N/A",
  },
};

 const kycDocuments = consumerDetailsData?.result?.document
  ? consumerDetailsData.result.document.map((doc) => ({
      name: doc.documentSubtypeName || "N/A",
      fileName: doc.file ? doc.file.split("/").pop() || "document.pdf" : "N/A",
      fileUrl: doc.file || null,
      status: doc.statusDisplay || "N/A",
      uploadDate: doc.createdDate || "N/A",
    }))
  : [];

  const secondaryPersons = [
    {
      name: "N/A",
      relationship: "N/A",
      phone: "N/A",
      email: "N/A",
    },
  ];

  // Transform activity log data for display
  const accountActivity = activitylog?.results
    ? activitylog.results.slice(0, 5).map((activity) => ({
        date: `${activity.date} ${activity.time}`,
        action: `${activity.title}`,
        amount: activity.data.additionalData?.paymentMethod || "N/A",
        status: activity.data.additionalData?.transactionStatusDisplay || "Unknown",
        requestType: activity.data.requestType,
        scheduleDate: activity.data.additionalData?.scheduleDate,
        paymentMethod: activity.data.additionalData?.paymentMethod,
        instruction: activity.data.additionalData?.additionalInstruction,
      }))
    : [
        { date: "N/A", action: "N/A", amount: "N/A", status: "N/A" },
      ];
const communicationArray = consumerDetailsData?.result?.additionalData?.communication || [];
const preferences = {
  notifications: {
    email: communicationArray.includes("email"),
    sms: communicationArray.includes("sms"),
    push: false,
    billReminders: false,
    outageAlerts: false,
    promotions: false,
  },
  billing: {
    paperless: communicationArray.includes("ebill"),
    paperBilling: communicationArray.includes("paper_bill"),
 
  },
};

  const handleViewDocument = (fileName: string, fileUrl?: string) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      console.log(`No file URL available for: ${fileName}`);
      alert(`Document ${fileName} is not available for viewing.`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
      case "Completed":
      case "Resolved":
        return <div className="h-4 w-4 bg-green-600 rounded-full" />;
      case "Pending":
        return <div className="h-4 w-4 bg-yellow-600 rounded-full" />;
      case "Under Review":
        return <div className="h-4 w-4 bg-orange-600 rounded-full" />;
      default:
        return <div className="h-4 w-4 bg-gray-600 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString.replace(" ", "T"));
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return dateString;
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
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                {consumerDetailsData?.result?.statusDisplay}
              </Badge>
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
            <h4 className="text-sm font-medium text-primary-600 mb-3">
              Primary Account Holder
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Name
                </label>
                <p className="text-sm mt-1 font-semibold">{profileData.name}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Email
                </label>
                <p className="text-sm mt-1 font-semibold">
                  {profileData.email}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Phone
                </label>
                <p className="text-sm mt-1 font-semibold">
                  {profileData.phone}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Account Number
                </label>
                <p className="text-sm mt-1 font-semibold">
                  {profileData.accountNumber}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Customer Since
                </label>
                <p className="text-sm mt-1 font-semibold">
                  {profileData.customerSince}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Plan
                </label>
                <p className="text-sm mt-1 font-semibold">{profileData.plan}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Category
                </label>
                <p className="text-sm mt-1 font-semibold">
                  {profileData.category}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-primary-200">
                <label className="text-sm font-medium text-primary-600">
                  Billing Cycle
                </label>
                <p className="text-sm mt-1 font-semibold">
                  {profileData.billingCycle}
                </p>
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
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-primary-200 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary-600">
                        Name
                      </label>
                      <p className="text-sm mt-1 font-semibold">
                        {person.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary-600">
                        Relationship
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs bg-primary-100 text-primary-700"
                        >
                          {person.relationship}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary-600">
                        Phone
                      </label>
                      <p className="text-sm mt-1 font-semibold">
                        {person.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary-600">
                        Email
                      </label>
                      <p className="text-sm mt-1 font-semibold">
                        {person.email}
                      </p>
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
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              KYC Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-4">
              {kycDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-secondary-100 rounded-lg">
                      <FileText className="h-4 w-4 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {doc.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewDocument(doc.fileName, doc.fileUrl)
                      }
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Badge
                      variant={
                        doc.status === "Verified" ? "default" : "secondary"
                      }
                      className="bg-green-100 text-green-800"
                    >
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
                <h4 className="text-sm font-medium text-green-700">
                  Service Address
                </h4>
                <Badge variant="outline" className="text-xs">
                  Primary Location
                </Badge>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {addresses.service.area} , {addresses.service.sub_area} ,{addresses.service.premise}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Where utility services are provided
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-blue-700">
                  Billing Address
                </h4>
                <Badge variant="outline" className="text-xs">
                  Invoice Location
                </Badge>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {addresses.billing.area} , {addresses.billing.sub_area} ,{addresses.billing.premise}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Where bills and statements are sent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Activity and Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Activity - Updated with real data */}
        <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="p-2">
              Your recent service requests and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-white rounded-lg border border-indigo-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3 flex-1"> 
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                       {activity.scheduleDate}
                      </p>
          
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    {/* {activity.paymentMethod && activity.paymentMethod !== "N/A" && (
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {activity.paymentMethod}
                      </p>
                    )} */}
                    <Badge
                      className={`text-xs ${getStatusColor(activity.status)}`}
                    >
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
                  <Badge
                    variant={
                      preferences.notifications.email ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {preferences.notifications.email ? "On" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-xs">SMS</span>
                  <Badge
                    variant={
                      preferences.notifications.sms ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
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
                  <Badge
                    variant={
                      preferences.billing.paperless ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {preferences.billing.paperless ? "Enabled" : "Disabled"}
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