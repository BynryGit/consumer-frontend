import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@shared/ui/button";
import {
  Upload,
  X,
  FilePlus,
  FileText,
  AlertCircle,
  Check,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";

import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useToast } from "@shared/hooks/use-toast";

import { useDocumentType, useKycInfo } from "@features/serviceRequest/hooks";
import { DocumentCardComponent } from "./DocumentCardComponent";

export interface Document {
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
  needsReupload?: boolean; // Flag for restored files that need re-upload
}

export interface DocumentCard {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

interface DocumentUploadFormProps {
  initialData?: Document[];
  consumerId?: string | number | null;
  onSave: (data: Document[]) => void;
  onNext?: () => void;
  isEditMode?: boolean;
  showSubmitButton?: boolean;
  onDataChange?: (data: any) => void; // Callback to pass data to parent
}

// File validation (matching EvidenceAttachmentsStep)
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File "${file.name}" exceeds the 5MB size limit`,
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `File "${file.name}" is not a supported format. Only PDF, JPG, and PNG files are allowed`,
    };
  }

  return { isValid: true };
};

// File size formatter (matching EvidenceAttachmentsStep)
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// KYC data transformation
const transformKycDataToDocuments = (kycData: any): Document[] => {
  if (!kycData?.result?.document) return [];

  const documents = kycData.result.document;

  if (!Array.isArray(documents)) return [];

  return documents.map((doc: any, index: number) => {
    const fileName = doc.file
      ? doc.file.split("/").pop() || `Document ${index + 1}`
      : `Document ${index + 1}`;

    return {
      id: doc.id?.toString() || `existing_${index}`,
      name: fileName,
      type: `document_${index + 1}`,
      category: doc.documentTypeName || "",
      subCategory: doc.documentSubtypeName || "",
      categoryCode: doc.documentType || "",
      subCategoryCode: doc.documentSubtype || "",
      size: 0,
      progress: 100,
      status: "completed" as const,
      url: doc.file,
      needsReupload: false,
    };
  });
};

// Document card creation
const createDocumentCardsFromDocuments = (
  documents: Document[]
): DocumentCard[] => {
  return documents.map((doc, index) => ({
    id: doc.type,
    name: "Document",
    description: "Upload required documents",
    required: true,
  }));
};

// Setup existing document selections
const setupExistingDocumentSelections = (
  documents: Document[],
  documentTypeData: any
) => {
  const selectedDocumentTypes: { [key: string]: string } = {};
  const selectedSubTypes: { [key: string]: string } = {};

  documents.forEach((doc) => {
    selectedDocumentTypes[doc.type] = doc.category;
    selectedSubTypes[doc.type] = doc.subCategory;
  });

  return { selectedDocumentTypes, selectedSubTypes };
};

export function DocumentUploadForm({
  initialData = [],
  consumerId,
  onSave,
  onNext,
  isEditMode = false,
  showSubmitButton = true,
  onDataChange,
}: DocumentUploadFormProps) {
  // Extract consumer ID from URL if not provided via props
  const { toast } = useToast();
  const { consumerId: urlConsumerId } = useParams();
  const actualConsumerId = consumerId || urlConsumerId;
  const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();

  // State management (storing File objects in memory like EvidenceAttachmentsStep)
  const [documents, setDocuments] = useState<Document[]>(initialData);
  const [documentCards, setDocumentCards] = useState<DocumentCard[]>([
    {
      id: "doc_1",
      name: "Document",
      description: "Upload required documents",
      required: true,
    },
  ]);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<{
    [key: string]: string;
  }>({});
  const [selectedSubTypes, setSelectedSubTypes] = useState<{
    [key: string]: string;
  }>({});
  const [dragging, setDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dataLoadedRef = useRef(false);

  // Add KYC info hook for fetching existing documents in edit mode
  const {
    data: kycInfoData,
    isLoading: isLoadingKyc,
    error: kycError,
  } = useKycInfo(
    {
      remote_utility_id: remoteUtilityId,
      consumer_id: actualConsumerId,
      is_kyc_info: 1,
    },
    {
      enabled: isEditMode && !!actualConsumerId,
    }
  );

  // Fetch document types
  const {
    data: documentTypeData,
    isLoading: isDocumentTypeLoading,
    error: documentTypeError,
  } = useDocumentType({
    remote_utility_id: remoteUtilityId,
    config_level: "document_type",
  });

  // Memoized helper functions
  const getDocumentTypeCode = useCallback(
    (documentTypeName: string) => {
      const documentType = documentTypeData?.result?.find(
        (type: any) =>
          type.name.toLowerCase() === documentTypeName.toLowerCase()
      );
      return documentType?.code || "";
    },
    [documentTypeData]
  );

  const getDocumentTypeObject = useCallback(
    (documentTypeName: string) => {
      return documentTypeData?.result?.find(
        (type: any) =>
          type.name.toLowerCase() === documentTypeName.toLowerCase()
      );
    },
    [documentTypeData]
  );

  // Initialize form with existing KYC data in edit mode
  useEffect(() => {
    if (isEditMode && kycInfoData && !isLoadingKyc && !dataLoadedRef.current) {
      const existingDocuments = transformKycDataToDocuments(kycInfoData);

      if (existingDocuments.length > 0) {
        setDocuments(existingDocuments);

        // Create document cards based on existing documents
        const newDocumentCards =
          createDocumentCardsFromDocuments(existingDocuments);
        setDocumentCards(newDocumentCards);

        // Set selected document types and subtypes for existing documents
        if (documentTypeData?.result) {
          const {
            selectedDocumentTypes: newSelectedTypes,
            selectedSubTypes: newSelectedSubTypes,
          } = setupExistingDocumentSelections(
            existingDocuments,
            documentTypeData
          );

          setSelectedDocumentTypes(newSelectedTypes);
          setSelectedSubTypes(newSelectedSubTypes);
        }
      }
      dataLoadedRef.current = true;
    }
  }, [kycInfoData, isLoadingKyc, isEditMode, documentTypeData]);

  // Initialize with initialData (for restored state from stepHelpers)
  useEffect(() => {
    if (initialData.length > 0 && !dataLoadedRef.current && !isEditMode) {
      setDocuments(initialData);

      // Create document cards from initial data
      if (initialData.length > 0) {
        const cards = initialData.reduce((acc, doc) => {
          const existingCard = acc.find((card) => card.id === doc.type);
          if (!existingCard) {
            acc.push({
              id: doc.type,
              name: "Document",
              description: "Upload required documents",
              required: true,
            });
          }
          return acc;
        }, [] as DocumentCard[]);

        if (cards.length > 0) {
          setDocumentCards(cards);
        }

        // Restore document type selections if available
        const typeSelections: { [key: string]: string } = {};
        const subtypeSelections: { [key: string]: string } = {};

        initialData.forEach((doc) => {
          if (doc.category) typeSelections[doc.type] = doc.category;
          if (doc.subCategory) subtypeSelections[doc.type] = doc.subCategory;
        });

        setSelectedDocumentTypes(typeSelections);
        setSelectedSubTypes(subtypeSelections);
      }
      dataLoadedRef.current = true;
    }
  }, [initialData, isEditMode]);

  // Helper functions (like EvidenceAttachmentsStep)
  const addDocumentCard = useCallback(() => {
    const newCard: DocumentCard = {
      id: `doc_${Date.now()}`,
      name: "Document",
      description: "Upload required documents",
      required: true,
    };
    setDocumentCards((prev) => [...prev, newCard]);
  }, []);

  const removeDocumentCard = useCallback(
    (cardId: string) => {
      setDocumentCards((prev) => prev.filter((card) => card.id !== cardId));
      // Also remove associated documents
      const updatedDocuments = documents.filter((doc) => doc.type !== cardId);
      setDocuments(updatedDocuments);
      // Remove selected types
      setSelectedDocumentTypes((prev) => {
        const newTypes = { ...prev };
        delete newTypes[cardId];
        return newTypes;
      });
      setSelectedSubTypes((prev) => {
        const newSubTypes = { ...prev };
        delete newSubTypes[cardId];
        return newSubTypes;
      });

      // Notify parent of document removal
      handleDocumentChange(updatedDocuments);
    },
    [documents]
  );

  const removeDocument = useCallback(
    (documentId: string) => {
      const updatedDocuments = documents.filter((doc) => doc.id !== documentId);
      setDocuments(updatedDocuments);
      handleDocumentChange(updatedDocuments);
    },
    [documents]
  );

  // Handle document changes and notify parent (like EvidenceAttachmentsStep)
  const handleDocumentChange = useCallback(
    (updatedDocuments: Document[]) => {
      // Call the original onSave callback
      if (onSave) {
        onSave(updatedDocuments);
      }

      // Notify parent component with data change
      if (onDataChange) {
        const validFiles = updatedDocuments.filter(
          (doc) => (doc.file || doc.url) && !doc.needsReupload
        );
        const fileObjects = validFiles
          .filter((doc) => doc.file)
          .map((doc) => doc.file!);
        const fileMetadata = updatedDocuments.map((doc) => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          category: doc.category,
          subCategory: doc.subCategory,
          categoryCode: doc.categoryCode,
          subCategoryCode: doc.subCategoryCode,
          size: doc.size,
          needsReupload: doc.needsReupload || false,
          url: doc.url, // Include URL for already uploaded documents
        }));

        const submissionData = {
          documents: updatedDocuments,
          file: fileObjects,
          fileMetadata: fileMetadata,
        };

        console.log(
          "Document change - calling onDataChange with:",
          submissionData
        );
        onDataChange(submissionData);
      }
    },
    [onSave, onDataChange]
  );

  const uploadFile = useCallback(
    (
      file: File,
      docType: string,
      subType: string,
      cardId: string,
      documentTypeObj: any,
      subtypeCode: string
    ) => {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast({
          title: "File Upload Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      const documentId = `${file.name}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newDocument: Document = {
        id: documentId,
        name: file.name,
        type: cardId,
        category: docType,
        subCategory: subType,
        categoryCode: documentTypeObj?.code || "",
        subCategoryCode: subtypeCode,
        size: file.size,
        progress: 100,
        status: "completed", // Keep this for compatibility
        file: file, // Store the actual File object in memory
        needsReupload: false,
      };

      const updatedDocuments = [...documents, newDocument];
      setDocuments(updatedDocuments);

      // Notify parent of change
      handleDocumentChange(updatedDocuments);

      toast({
        title: "Success!",
        description: `${file.name} has been added`,
      });
    },
    [documents, handleDocumentChange]
  );

  const handleDocumentTypeChange = useCallback(
    (cardId: string, documentType: string) => {
      setSelectedDocumentTypes((prev) => ({
        ...prev,
        [cardId]: documentType,
      }));
      // Clear subtype when document type changes
      setSelectedSubTypes((prev) => {
        const newSubTypes = { ...prev };
        delete newSubTypes[cardId];
        return newSubTypes;
      });
    },
    []
  );

  const handleSubtypeChange = useCallback((cardId: string, subtype: string) => {
    setSelectedSubTypes((prev) => ({
      ...prev,
      [cardId]: subtype,
    }));
  }, []);

  const getDocumentsByType = useCallback(
    (type: string) => {
      return documents.filter((doc) => doc.type === type);
    },
    [documents]
  );

  const isUploadDisabled = useCallback(
    (cardId: string) => {
      return !selectedDocumentTypes[cardId] || !selectedSubTypes[cardId];
    },
    [selectedDocumentTypes, selectedSubTypes]
  );

  const hasUploadedDocuments = useCallback(() => {
    return documents.some((doc) => (doc.file || doc.url) && !doc.needsReupload); // Check for valid files or URLs
  }, [documents]);

  // Handle file upload with validation
  const handleFileUpload = useCallback(
    (file: File, docType: string, subType: string, cardId: string) => {
      const documentTypeObj = getDocumentTypeObject(docType);

      // Get subtype code (would need to be passed from the DocumentCardComponent)
      let subtypeCode = "";

      uploadFile(file, docType, subType, cardId, documentTypeObj, subtypeCode);
    },
    [getDocumentTypeObject, uploadFile]
  );

  const handleSubmit = async () => {
    // Validate that at least one document is uploaded with actual file or has URL
    if (!hasUploadedDocuments()) {
      const documentsNeedingReupload = documents.filter(
        (doc) => doc.needsReupload
      );
      const errorMessage =
        documentsNeedingReupload.length > 0
          ? "Some documents from previous session need to be re-uploaded. Please re-upload them to continue."
          : "Please upload at least one document to continue.";

      toast({
        title: "Upload Required",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const validDocuments = documents.filter(
        (doc) => (doc.file || doc.url) && !doc.needsReupload
      );

      // Notify parent component with final data
      if (onDataChange) {
        const submissionData = {
          documents: documents,
          file: validDocuments
            .filter((doc) => doc.file)
            .map((doc) => doc.file!),
          fileMetadata: documents.map((doc) => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            category: doc.category,
            subCategory: doc.subCategory,
            categoryCode: doc.categoryCode,
            subCategoryCode: doc.subCategoryCode,
            size: doc.size,
            needsReupload: doc.needsReupload || false,
            url: doc.url, // Include URL for already uploaded documents
          })),
          isStepComplete: true,
          completedAt: new Date().toISOString(),
        };
        onDataChange(submissionData);
      }

      // Call the original onSave callback
      if (onSave) {
        onSave(documents);
      }

      // Proceed to next step
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared drag state handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  // Error state for edit mode
  if (isEditMode && kycError) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load document data: {kycError.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Error state for document types
  if (documentTypeError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load document types. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const isLoading = isSubmitting;

  return (
    <div className="space-y-6 w-full">
      <div className="bg-blue-50 border border-blue-100 rounded-md mt-4 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">
              {isEditMode
                ? "Update Document Requirements"
                : "Document Requirements"}
            </h4>
            <ul className="text-blue-700 text-sm space-y-1 list-disc pl-5">
              {isEditMode ? (
                <>
                  <li>You can replace existing documents or add new ones</li>
                  <li>All documents must be clear and legible</li>
                  <li>Accepted formats: JPG, PNG, PDF (max 5MB each)</li>
                </>
              ) : (
                <>
                  <li>All documents must be clear and legible</li>
                  <li>Accepted formats: JPG, PNG, PDF (max 5MB each)</li>
                  <li>Document verification may take up to 24 hours</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentCards.map((doc, index) => (
          <DocumentCardComponent
            key={doc.id}
            doc={doc}
            index={index}
            documents={documents}
            selectedDocumentTypes={selectedDocumentTypes}
            selectedSubTypes={selectedSubTypes}
            documentTypeData={documentTypeData}
            isEditMode={isEditMode}
            isDocumentTypeLoading={isDocumentTypeLoading}
            dragging={dragging}
            onDocumentTypeChange={handleDocumentTypeChange}
            onSubtypeChange={handleSubtypeChange}
            onFileUpload={handleFileUpload}
            onRemoveDocument={removeDocument}
            onRemoveCard={removeDocumentCard}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            isUploadDisabled={isUploadDisabled}
            canRemoveCard={documentCards.length > 1}
          />
        ))}
      </div>

      {/* ADD Button */}
      <div className="flex justify-center">
        <Button
          onClick={addDocumentCard}
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Add another document card"
        >
          <Plus className="h-4 w-4" />
          ADD
        </Button>
      </div>

      {showSubmitButton && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="w-full md:w-auto"
            disabled={isLoading || !hasUploadedDocuments()}
            aria-label={
              isLoading
                ? "Processing..."
                : isEditMode
                ? "Update and Continue"
                : "Save and Continue"
            }
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Uploading..."
              : isEditMode
              ? "Update and Continue"
              : "Save and Continue"}
          </Button>
          {!hasUploadedDocuments() && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Please upload at least one document to continue
            </p>
          )}
        </div>
      )}
    </div>
  );
}
