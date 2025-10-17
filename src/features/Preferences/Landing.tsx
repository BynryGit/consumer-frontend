
import React from 'react';
import CommunicationForm from './components/CommunicationForm';



const CommunicationPreferences = () => {
  return (

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Communication Preferences</h1>
          <p className="text-muted-foreground mt-2">
            Manage how and when we contact you
          </p>
        </div>
        
        <CommunicationForm />
      </div>

  );
};

export default CommunicationPreferences;
