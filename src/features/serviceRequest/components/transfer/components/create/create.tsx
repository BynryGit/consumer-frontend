import React, { useState, useMemo } from 'react';
import { Stepper } from '@shared/components/Stepper';
import { useRemoteUtilityId } from '@shared/selectors/globalSelectors';
// import { CustomerInformationStep } from './stepComponents/CustomerVerification';
// import { TransferDetailsStep } from './stepComponents/TransferDetailsStep';
import { DocumentUploadStep } from './stepComponents/DocumentUploadStep';
import { ReviewSubmitStep } from './stepComponents/ReviewSubmitStep';


export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  needsReupload?: boolean;
}
export const CreateTransferRequest: React.FC = () => {
  const remoteUtilityId = useRemoteUtilityId();
  const storageKey = `transfer-request-progress-${remoteUtilityId}`;
  // File state management at parent level
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata[]>([]);
  const [documentsFormData, setDocumentsFormData] = useState<any>({});

  // Handle file data changes from EvidenceAttachmentsStep
const handleFileDataChange = (data: any) => {
    console.log('🚀 Parent received file data:', data);
    console.log('🚀 File objects:', data.file);
    console.log('🚀 File metadata:', data.fileMetadata);
    
    setFileObjects(data.file || []);
    setFileMetadata(data.fileMetadata || []);
    setDocumentsFormData({
      notes: data.notes || '',
      incidentDate: data.incidentDate || '',
      expectedResolution: data.expectedResolution || '',
    });
  };

   // Store the handler on window for child components to access
   React.useEffect(() => {
    (window as any).handleFileDataChange = (data: any) => {
      console.log('🚀 Parent received file data:', data);
      setFileObjects(data.file || []);
      setFileMetadata(data.fileMetadata || []);
      setDocumentsFormData({
        notes: data.notes || '',
        incidentDate: data.incidentDate || '',
        expectedResolution: data.expectedResolution || '',
      });
    };
    
    // Store file data on window for ReviewSubmitStep to access
    (window as any).fileData = {
      fileObjects,
      fileMetadata, 
      documentsFormData
    };
    
    return () => {
      delete (window as any).handleFileDataChange;
      delete (window as any).fileData;
    };
  }, [fileObjects, fileMetadata, documentsFormData]);

  // Memoize the steps array to prevent infinite re-renders
  const steps = useMemo(() => [
    // {
    //   title: 'Customer Verification',
    //   description: 'Enter or look up customer details',
    //   slug: 'customer-info', // Add slug for routing
    //   component: <CustomerInformationStep remoteUtilityId={Number(remoteUtilityId)} storageKey={storageKey}/>,
    //   optional: false,
    //   infoTitle: 'Customer Information Help',
    //   infoDescription: "Enter the customer's account details. You can use the 'Look Up' button to automatically populate fields if you have the account number.",
    // },
    // {
    //   title: 'Transfer Details',
    //   description: 'Enter the details of the transfer',
    //   slug: 'transfer-details', // Add slug for routing
    //   component: <TransferDetailsStep
    //   remoteUtilityId={Number(remoteUtilityId)} 
    //   storageKey={storageKey}
    //   />,
    //   optional: false,
    //   infoTitle: 'Transfer Details Help',
    //   infoDescription: 'Enter the details of the transfer.',
    // },
    {
      title: 'Document Upload',
      description: 'Upload the required documents for the transfer',
      slug: 'document-upload', // Add slug for routing
      component: <DocumentUploadStep
      remoteUtilityId={Number(remoteUtilityId)} 
      storageKey={storageKey}
      onDataChange={handleFileDataChange}
      />,
      optional: false,
      infoTitle: 'Document Upload Help',
      infoDescription: 'Upload the required documents for the transfer.',
    },
    {
      title: 'Review & Submit',
      description: 'Review your transfer details and submit the request',
      slug: 'review-submit', // Add slug for routing
      component: <ReviewSubmitStep
      remoteUtilityId={Number(remoteUtilityId)} 
      storageKey={storageKey}
      fileObjects={fileObjects}
      fileMetadata={fileMetadata}
      documentsFormData={documentsFormData}
      />,
      optional: false,
      infoTitle: 'Review & Submit Help',
      infoDescription: 'Review all your transfer details and submit the request.',
    },
  ], []); // Only recreate when requestData or handleStateUpdate changes


  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Transfer Request
        </h1>
        <p className="text-gray-600">
          Complete the following steps to submit a transfer request.
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