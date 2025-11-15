import React, { useState } from 'react';
import { Tabs } from '@shared/ui/tabs';
import { Lightbulb, Droplet, Flame } from 'lucide-react';

import ProfileTab from './components/ProfileTab';
import ConnectionTab from './components/ConnectionTab';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
import { useConsumerDetails } from './hooks';
import ProfileEditModal from './components/ProfileEditDialog';
import { logEvent } from '@shared/analytics/analytics';

const ProfileEditor = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  // Get login data
  const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();
  
  // Fetch consumer details
  const { data: consumerDetailsData, refetch: refetchConsumerDetails } = useConsumerDetails({
    remote_utility_id: remoteUtilityId,
    consumer_no: remoteConsumerNumber,
  });

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

  // Tab configuration for your shared tab service
  const tabComponents = {
    profile: {
      label: 'Profile',
      component: <ProfileTab  onEditClick={() =>{ logEvent("Profile Edit Modal Opened"); setIsEditModalOpen(true)}} consumerDetailsData={consumerDetailsData} />
      
    },
    connection: {
      label: 'Connection',
      component: <ConnectionTab consumerDetailsData={consumerDetailsData} />
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

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentData={{
          email: consumerDetailsData?.result?.email || '',
          phone: consumerDetailsData?.result?.contactNumber || '',
          billingAddress: {
            street: consumerDetailsData?.result?.addressData?.service?.ADDRESS || '',
            city: consumerDetailsData?.result?.territoryData?.service?.county || '',
            state: consumerDetailsData?.result?.territoryData?.service?.state || '',
            pincode: consumerDetailsData?.result?.addressData?.service?.ZIPCODE || '',
            
          }
        }}
        onSave={handleEditSave}
        onRefetch={refetchConsumerDetails}
      />
    </div>
  );
};

export default ProfileEditor;