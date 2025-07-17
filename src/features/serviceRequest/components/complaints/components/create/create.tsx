import React, { useState } from 'react';
import { Stepper } from '@shared/components/Stepper';

import { ComplaintDetailsStep } from './stepComponents/ComplaintDetailsStep';
import { EvidenceAttachmentsStep } from './stepComponents/EvidenceAttachmentsStep';
import { ReviewSubmitStep } from './stepComponents/ReviewSubmitStep';
import { useRemoteUtilityId } from '@shared/selectors/globalSelectors';
// import { FileMetadata } from '@features/cx/shared/types/consumerRequest';

// Complaint-specific data structures
interface CustomerInfo {
  accountNumber: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  customerType: string;
  customerSince?: string;
}

interface ComplaintDetails {
  category: string;
  subCategory: string;
  priority: string;
  description: string;
  expectedResolution: string;
  incident: {
    date: string;
  };
}

interface EvidenceData {
  notes: string;
  attachments?: File[];
}

interface ComplaintData {
  customer: CustomerInfo;
  complaint: ComplaintDetails;
  evidence: EvidenceData;
}


// Initial data structures
const initialCustomer: CustomerInfo = {
  accountNumber: '',
  name: '',
  address: '',
  phone: '',
  email: '',
  customerType: '',
  customerSince: '',
};

const initialComplaint: ComplaintDetails = {
  category: '',
  subCategory: '',
  priority: '',
  description: '',
  expectedResolution: '',
  incident: {
    date: '',
  },
};  

const initialEvidence: EvidenceData = {
  notes: '',
  attachments: [],
};

const initialComplaintData: ComplaintData = {
  customer: initialCustomer,
  complaint: initialComplaint,
  evidence: initialEvidence,
};
export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  needsReupload?: boolean;
}

export const CreateComplaintRequest: React.FC = () => {
  const remoteUtilityId = useRemoteUtilityId();
  const storageKey = `complaint-request-progress-${remoteUtilityId}`;
  
  // File state management at parent level
  const [fileObjects, setFileObjects] = useState<File[]>([]);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata[]>([]);
  const [evidenceFormData, setEvidenceFormData] = useState<any>({});

  // Handle file data changes from EvidenceAttachmentsStep
const handleFileDataChange = (data: any) => {
    console.log('🚀 Parent received file data:', data);
    console.log('🚀 File objects:', data.file);
    console.log('🚀 File metadata:', data.fileMetadata);
    
    setFileObjects(data.file || []);
    setFileMetadata(data.fileMetadata || []);
    setEvidenceFormData({
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
      setEvidenceFormData({
        notes: data.notes || '',
        incidentDate: data.incidentDate || '',
        expectedResolution: data.expectedResolution || '',
      });
    };
    
    // Store file data on window for ReviewSubmitStep to access
    (window as any).fileData = {
      fileObjects,
      fileMetadata, 
      evidenceFormData
    };
    
    return () => {
      delete (window as any).handleFileDataChange;
      delete (window as any).fileData;
    };
  }, [fileObjects, fileMetadata, evidenceFormData]);


  // Stepper steps array
  const steps = [
    {
      title: 'Complaint Details',
      slug: 'complaint-details',
      description: 'Specify complaint category and details',
      component: (
        <ComplaintDetailsStep
          remoteUtilityId={Number(remoteUtilityId)}
          storageKey={storageKey}
        />
      ),
      optional: false,
      infoTitle: 'Complaint Details',
      infoDescription: 'Specify complaint category and details',
    },
    {
      title: 'Evidence & Attachments',
      slug: 'evidence-attachments',
      description: 'Upload supporting documents',
      component: (
        <EvidenceAttachmentsStep
          remoteUtilityId={Number(remoteUtilityId)}
          storageKey={storageKey}
          onDataChange={handleFileDataChange}
        />
      ),
      optional: false,
      infoTitle: 'Evidence & Attachments',
      infoDescription: 'Upload supporting documents',
    },
    {
      title: 'Review & Submit',
      slug: 'review-submit',
      description: 'Review and submit the complaint',
      component: (
        <ReviewSubmitStep
          remoteUtilityId={Number(remoteUtilityId)}
          storageKey={storageKey}
          fileObjects={fileObjects}           // ADD THIS LINE
          fileMetadata={fileMetadata}         // ADD THIS LINE
          evidenceFormData={evidenceFormData} // ADD THIS LINE
        />
      ),
      optional: false,
      infoTitle: 'Review & Submit',
      infoDescription: 'Review and submit the complaint',
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold">
        Create Complaint Request
      </h2>
      <Stepper
        steps={steps}
        onStepChange={() => {}}
        onValidation={async () => ({ isValid: true })}
        onComplete={() => {}}
        
        onStepSave={async (stepIndex, stepData, isDirty) => {
          // if (isDirty) {
          //   await fetch(`/api/complaints/${complaintId}/step/${stepIndex}`, {
          //     method: 'PATCH',
          //     headers: { 'Content-Type': 'application/json' },
          //     body: JSON.stringify(stepData)
          //   });
          // }
        }}
        enableApiSave={true}
        saveOnStepChange={true}
        trackDirtyState={true}
        autoSave={true}
        persistProgress={true}
        allowSkip={true}
        showDraftResume={true}
      />
      
      {/* Debug information (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Debug - File State:</h4>
          <p className="text-sm text-gray-600">File Objects: {fileObjects.length}</p>
          <p className="text-sm text-gray-600">File Metadata: {fileMetadata.length}</p>
          {fileObjects.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">File Names:</p>
              <ul className="text-xs text-gray-500 ml-4">
                {fileObjects.map((file, index) => (
                  <li key={index}>• {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};