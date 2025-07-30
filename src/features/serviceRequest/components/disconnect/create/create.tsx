import React, { useState, useMemo } from 'react';
import { Stepper } from '@shared/components/Stepper';
import { ReviewPaymentStep } from './stepComponents/ReviewPaymentStep';
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";

import { RequestDetailsStep } from './stepComponents/RequestDetailsStep';


export const CreateDisconnectionRequest: React.FC = () => {
  const { remoteUtilityId } = getLoginDataFromStorage();
  const storageKey = `disconnection-request-progress-${remoteUtilityId}`;
  // Memoize the steps array to prevent infinite re-renders
  const steps = useMemo(() => [
    {
      title: 'Select Service',
      description: 'Browse all available services and select the one you need',
      slug: 'service-selection', // Add slug for routing
      component: <RequestDetailsStep remoteUtilityId={Number(remoteUtilityId)} storageKey={storageKey} onNext={() => {}} onPrevious={() => {}}/>,
      optional: false,
      infoTitle: 'Service Selection Help',
      infoDescription: 'Browse and select the service you need. Use the search bar to quickly find specific services. Each service shows pricing and description to help you choose.',
    },
    {
      title: 'Review & Payment',
      description: 'Review your service request details and select payment method',
      slug: 'review-payment', // Add slug for routing
      component: <ReviewPaymentStep remoteUtilityId={Number(remoteUtilityId)} storageKey={storageKey}/>,
      optional: false,
      infoTitle: 'Review & Payment Help',
      infoDescription: 'Review all your service details and payment information before submitting your request.',
    },
  ], []); // Only recreate when requestData or handleStateUpdate changes


  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Disconnection Request
        </h1>
        <p className="text-gray-600">
          Complete the following steps to submit a disconnection request.
        </p>
      </div>

      <Stepper
        steps={steps}
        onStepChange={() => {}}
        onStepSave={async (stepIndex, stepData, isDirty) => {
          // Storage is handled at component level using step helpers
        }}
        enableApiSave={false}
        saveOnStepChange={false}
        trackDirtyState={false}
        autoSave={true}
        persistProgress={true}
        allowSkip={false} // Set to false since all steps are required
        storageKey={storageKey}
        enableRouting={true} // Enable hash-based routing (no 404s on refresh)
        onValidation={undefined} // basePath is not needed for hash-based routing
        onComplete={() => {}}
        showDraftResume={true}
        />
    </div>
  );
};