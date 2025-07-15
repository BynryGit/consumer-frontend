import React, { useState } from 'react';
import { Tabs } from '@shared/ui/tabs';
import { Lightbulb, Droplet, Flame } from 'lucide-react';
import ProfileEditDialog from './components/ProfileEditDialog';
import ProfileTab from './components/ProfileTab';
import ConnectionTab from './components/ConnectionTab';


const ProfileEditor = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+91 98765 43210",
    plan: "Residential Standard Plan",
    category: "Residential",
    subCategory: "Individual",
    customerSince: "2019-03-15",
    accountNumber: "ACC-001234567",
    billingCycle: "Monthly"
  });

  const [addresses, setAddresses] = useState({
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
  });

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

  const handleEditSave = (data: any) => {
    setProfileData(prev => ({
      ...prev,
      email: data.email,
      phone: data.phone
    }));
    
    setAddresses(prev => ({
      ...prev,
      billing: data.billingAddress
    }));
  };

  const connectionData = [
    {
      utility: "Electricity",
      icon: Lightbulb,
      color: "text-yellow-600",
      meterNo: "EL-38429175",
      deviceNo: "DEV-EL-001",
      meterType: "Digital Smart Meter",
      lastReading: "1,245 kWh",
      lastReadingDate: "2024-12-05",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      readings: [
        { date: "2024-12-05", reading: "1,245 kWh", status: "Verified" },
        { date: "2024-11-05", reading: "1,189 kWh", status: "Verified" },
        { date: "2024-10-05", reading: "1,134 kWh", status: "Verified" },
        { date: "2024-09-05", reading: "1,078 kWh", status: "Pending" }
      ]
    },
    {
      utility: "Water",
      icon: Droplet,
      color: "text-blue-600",
      meterNo: "WT-74526813",
      deviceNo: "DEV-WT-002",
      meterType: "Digital Flow Meter",
      lastReading: "2,890 L",
      lastReadingDate: "2024-12-05",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      readings: [
        { date: "2024-12-05", reading: "2,890 L", status: "Verified" },
        { date: "2024-11-05", reading: "2,834 L", status: "Verified" },
        { date: "2024-10-05", reading: "2,778 L", status: "Verified" },
        { date: "2024-09-05", reading: "2,722 L", status: "Verified" }
      ]
    },
    {
      utility: "Gas",
      icon: Flame,
      color: "text-orange-600",
      meterNo: "GS-91527364",
      deviceNo: "DEV-GS-003",
      meterType: "Digital Gas Meter",
      lastReading: "156 m³",
      lastReadingDate: "2024-12-04",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      readings: [
        { date: "2024-12-04", reading: "156 m³", status: "Verified" },
        { date: "2024-11-04", reading: "142 m³", status: "Verified" },
        { date: "2024-10-04", reading: "128 m³", status: "Verified" },
        { date: "2024-09-04", reading: "114 m³", status: "Under Review" }
      ]
    }
  ];

  const handleViewDocument = (fileName: string) => {
    console.log(`Viewing document: ${fileName}`);
    alert(`Opening ${fileName}...`);
  };

  // Tab configuration for your shared tab service
const tabComponents = {
  profile: {
    label: 'Profile',
    component: <ProfileTab onEditClick={() => setIsEditDialogOpen(true)} />
  },
  connection: {
    label: 'Connection',
    component: <ConnectionTab />
  }
};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and connection details
        </p>
      </div>
      
      {/* Using your shared tab service with exact same layout */}
      <div className="space-y-6">
        <Tabs
          defaultValue="profile"
          tabComponents={tabComponents}
          urlMapping={{
            profile: 'profile',
            connection: 'connection'
          }}
          tabsListClassName="grid w-full grid-cols-2"
          tabsListFullWidth={true}
          idPrefix="profile"
        />
      </div>

      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        currentData={{
          email: profileData.email,
          phone: profileData.phone,
          billingAddress: addresses.billing
        }}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ProfileEditor;