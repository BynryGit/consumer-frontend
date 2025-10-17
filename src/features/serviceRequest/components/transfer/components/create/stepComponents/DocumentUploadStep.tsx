// DocumentUploadStep.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { ContextualHelp } from "@shared/ui/contextual-help";
import { FileText } from "lucide-react";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { DocumentUploadForm } from "@shared/components/DocumentUploadForm";
// import { DocumentUploadForm } from "@features/cx/shared/components/DocumentUploadForm";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  subCategory: string;
  categoryCode: string;
  subCategoryCode: string;
  size: number;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  file?: File;
  needsReupload?: boolean;
}

interface DocumentUploadStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  clearValidationError?: () => void;
  isValidating?: boolean;
  onDataChange?: (data: any) => void;
  consumerId?: string | number | null;
  isEditMode?: boolean;
}

export function DocumentUploadStep({ 
  remoteUtilityId, 
  storageKey, 
  stepHelpers,
  currentStepIndex = 0,
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating = false,
  onDataChange,
  consumerId,
  isEditMode = false
}: DocumentUploadStepProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dataLoadedRef = useRef(false);

  // Helper function to save step data using stepHelpers
  const saveStepData = useCallback((data: any) => {
    if (!stepHelpers) return;
    
    try {
      const stepData = {
        ...data,
        timestamp: new Date().toISOString(),
        stepIndex: currentStepIndex
      };
      
      stepHelpers.setStepData(currentStepIndex, stepData);
      console.log('Step data saved via stepHelpers:', stepData);
    } catch (error) {
      console.error('Failed to save step data via stepHelpers:', error);
      toast({
        title: "Failed to save progress",
        description: "Your progress may not be saved. Please try again.",
        variant: "destructive",
      });
    }
  }, [stepHelpers, currentStepIndex]);

  // Helper function to get step data using stepHelpers
  const getStepData = useCallback(() => {
    if (!stepHelpers) return null;
    
    try {
      return stepHelpers.getStepData(currentStepIndex);
    } catch (error) {
      console.error('Failed to get step data via stepHelpers:', error);
      return null;
    }
  }, [stepHelpers, currentStepIndex]);

  // Load saved data from stepHelpers on component mount
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current) {
      try {
        const savedStepData = getStepData();
        if (savedStepData && savedStepData.documents) {
          console.log('Loaded step data from stepHelpers:', savedStepData);
          
          // Restore documents but mark files as needing re-upload since File objects can't be persisted
          const restoredDocuments = savedStepData.documents.map((doc: any) => ({
            ...doc,
            file: undefined, // File objects can't be persisted
            needsReupload: doc.file ? true : false, // Mark as needing re-upload if it had a file
            status: "completed" // Keep status for compatibility
          }));
          
          setDocuments(restoredDocuments);
          
          // Show toast notification about restored files
          const filesNeedingReupload = restoredDocuments.filter(doc => doc.needsReupload);
          if (filesNeedingReupload.length > 0) {
            toast({
              title: "Previous documents restored",
              description: `${filesNeedingReupload.length} document(s) from previous session need to be re-uploaded.`,
              variant: "default",
            });
          }
          
          // Notify parent component with initial data
          if (onDataChange) {
            const submissionData = {
              documents: restoredDocuments,
              file: [], // No File objects on initial load
              fileMetadata: restoredDocuments.map((doc: any) => ({
                id: doc.id,
                name: doc.name,
                type: doc.type,
                category: doc.category,
                subCategory: doc.subCategory,
                categoryCode: doc.categoryCode,
                subCategoryCode: doc.subCategoryCode,
                size: doc.size,
                needsReupload: doc.needsReupload || false
              }))
            };
            console.log('Initial load - calling onDataChange with:', submissionData);
            onDataChange(submissionData);
          }
        }
        dataLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to load step data from stepHelpers:', error);
        dataLoadedRef.current = true;
      }
    }
  }, [stepHelpers, currentStepIndex, getStepData, onDataChange]);

  // Handle document changes from DocumentUploadForm
  const handleDocumentSave = useCallback((uploadedDocuments: Document[]) => {
    setDocuments(uploadedDocuments);
    
    // Prepare data for stepHelpers (without File objects for persistence)
    const documentsForStorage = uploadedDocuments.map(doc => ({
      ...doc,
      file: doc.file ? true : undefined, // Store a flag indicating if there was a file
    }));
    
    // Extract file data for parent components
    const validDocuments = uploadedDocuments.filter(doc => doc.file && !doc.needsReupload);
    const fileObjects = validDocuments.map(doc => doc.file).filter(Boolean) as File[];
    const fileMetadata = uploadedDocuments.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      subCategory: doc.subCategory,
      categoryCode: doc.categoryCode,
      subCategoryCode: doc.subCategoryCode,
      size: doc.size,
      needsReupload: doc.needsReupload || false
    }));
    
    const formData = { 
      documents: documentsForStorage, // Store without File objects
      fileObjects: fileObjects,
      fileMetadata: fileMetadata,
      isStepComplete: uploadedDocuments.some(doc => doc.file && !doc.needsReupload), // Check if files exist and don't need re-upload
      completedAt: new Date().toISOString(),
    };
    
    // Save to stepHelpers (without File objects)
    saveStepData(formData);
    
    // Call onDataChange for parent communication (used in CreateTransferRequest)
    if (onDataChange) {
      onDataChange({
        documents: uploadedDocuments,
        file: fileObjects, // For backward compatibility with existing code
        fileMetadata: fileMetadata,
        notes: '', // Default empty values for compatibility
        incidentDate: '',
        expectedResolution: '',
      });
    }

    // Also store on window for global access (used in CreateTransferRequest)
    if (typeof window !== 'undefined' && (window as any).handleFileDataChange) {
      (window as any).handleFileDataChange({
        documents: uploadedDocuments,
        file: fileObjects,
        fileMetadata: fileMetadata,
        notes: '',
        incidentDate: '',
        expectedResolution: '',
      });
    }
  }, [saveStepData, onDataChange]);

  // Handle form submission and validation
  const handleSubmit = useCallback(() => {
    if (clearValidationError) {
      clearValidationError();
    }

    // Validate that at least one document has a file and doesn't need re-upload
    const validDocuments = documents.filter(doc => doc.file && !doc.needsReupload);
    const documentsNeedingReupload = documents.filter(doc => doc.needsReupload);
    
    if (validDocuments.length === 0) {
      const errorMessage = documentsNeedingReupload.length > 0 
        ? "Some documents from previous session need to be re-uploaded. Please re-upload them to continue."
        : "Please upload at least one document to continue.";
      
      toast({
        title: errorMessage,
        variant: "destructive",
      });
      
      if (setValidationError) {
        setValidationError(errorMessage);
      }
      return;
    }

    // Show warning if some files still need re-upload
    if (documentsNeedingReupload.length > 0) {
      toast({
        title: "Warning: Some files need re-upload",
        description: `${documentsNeedingReupload.length} file(s) from previous session need to be re-uploaded.`,
        variant: "destructive",
      });
    }

    // Extract final file data
    const fileObjects = validDocuments.map(doc => doc.file).filter(Boolean) as File[];
    const fileMetadata = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      subCategory: doc.subCategory,
      categoryCode: doc.categoryCode,
      subCategoryCode: doc.subCategoryCode,
      size: doc.size,
      needsReupload: doc.needsReupload || false
    }));
    
    const finalFormData = {
      documents: documents.map(doc => ({
        ...doc,
        file: doc.file ? true : undefined, // Store flag for persistence
      })),
      fileObjects: fileObjects,
      fileMetadata: fileMetadata,
      validFileCount: validDocuments.length,
      totalFileCount: documents.length,
      isStepComplete: true,
      submittedAt: new Date().toISOString(),
    };

    // Save final data
    saveStepData(finalFormData);

    console.log('Final submission data with File objects:', {
      ...finalFormData,
      fileObjects: fileObjects // Actual File objects for API
    });

    // Proceed to next step
    if (onNext) {
      onNext();
    }
  }, [documents, clearValidationError, setValidationError, saveStepData, onNext]);

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-500" />
              Required Documentation
            </div>
            <ContextualHelp
              title="Document Requirements"
              content="Upload all required documents to support your transfer request. The specific documents needed may vary based on the transfer type. Ensure all documents are clear, legible, and current. Accepted formats include PDF, JPG, PNG, and TIFF."
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploadForm
            initialData={documents}
            consumerId={consumerId}
            onSave={handleDocumentSave}
            onDataChange={onDataChange}
            isEditMode={isEditMode}
            showSubmitButton={false}
          />
        </CardContent>
      </Card>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isValidating || isSubmitting}
          className="min-w-[200px] px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {(isValidating || isSubmitting) ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Continue to Review'
          )}
        </Button>
      </div>      
    </div>
  );
}