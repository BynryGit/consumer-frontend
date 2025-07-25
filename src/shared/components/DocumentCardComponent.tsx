import { useState, useEffect, useCallback } from "react";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import {
  Upload,
  X,
  FilePlus,
  FileText,
  Check,
  Plus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";

import { getRemoteUtilityId } from "@shared/utils/getUtilityId";
import { toast } from "sonner";
import { Document, DocumentCard } from "./DocumentUploadForm";


import { formatFileSize, validateFile } from "@shared/utils/file";
import { useDocumentSubtype } from "@features/serviceRequest/hooks";

export function DocumentCardComponent({
  doc,
  index,
  documents,
  selectedDocumentTypes,
  selectedSubTypes,
  documentTypeData,
  isEditMode,
  isDocumentTypeLoading,
  dragging,
  onDocumentTypeChange,
  onSubtypeChange,
  onFileUpload,
  onRemoveDocument,
  onRemoveCard,
  onDragOver,
  onDragLeave,
  isUploadDisabled,
  canRemoveCard,
}: {
  doc: DocumentCard;
  index: number;
  documents: Document[];
  selectedDocumentTypes: { [key: string]: string };
  selectedSubTypes: { [key: string]: string };
  documentTypeData: any;
  isEditMode: boolean;
  isDocumentTypeLoading: boolean;
  dragging: boolean;
  onDocumentTypeChange: (documentType: string, typeName: string) => void;
  onSubtypeChange: (documentType: string, subtypeName: string) => void;
  onFileUpload: (file: File, docType: string, subType: string, cardId: string) => void;
  onRemoveDocument: (id: string) => void;
  onRemoveCard: (cardId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  isUploadDisabled: (documentType: string) => boolean;
  canRemoveCard: boolean;
}) {
  const remoteUtilityId = getRemoteUtilityId();

  // Get document type code for selected document type
  const getDocumentTypeCode = useCallback((documentTypeName: string) => {
    const documentType = documentTypeData?.result?.find(
      (type: any) => type.name.toLowerCase() === documentTypeName.toLowerCase()
    );
    return documentType?.code || "";
  }, [documentTypeData]);

  // Get document type object for full details
  const getDocumentTypeObject = useCallback((documentTypeName: string) => {
    return documentTypeData?.result?.find(
      (type: any) => type.name.toLowerCase() === documentTypeName.toLowerCase()
    );
  }, [documentTypeData]);

  // Use document subtype hook for this specific card
  const selectedDocumentType = selectedDocumentTypes[doc.id];
  const documentTypeCode = selectedDocumentType ? getDocumentTypeCode(selectedDocumentType) : "";
  
  const {
    data: documentSubtypeData,
    isLoading: isDocumentSubtypeLoading,
  } = useDocumentSubtype({
    remote_utility_id: 702,
    config_level: "document_subtype",
    code_list: documentTypeCode,
  }, {
    enabled: !!documentTypeCode,
  });

  // Update subtype selection in edit mode when subtype data is loaded
  useEffect(() => {
    if (isEditMode && documentSubtypeData?.result && selectedDocumentTypes[doc.id]) {
      const cardDocuments = getCardDocuments();
      if (cardDocuments.length > 0) {
        const existingDoc = cardDocuments[0];
        if (existingDoc.subCategoryCode && !selectedSubTypes[doc.id]) {
          const subtype = documentSubtypeData.result.find(
            (st: any) => st.code === existingDoc.subCategoryCode
          );
          if (subtype) {
            onSubtypeChange(doc.id, subtype.name);
          }
        }
      }
    }
  }, [documentSubtypeData, isEditMode, doc.id, selectedDocumentTypes, selectedSubTypes, onSubtypeChange]);

  const getCardDocuments = useCallback(() => {
    return documents.filter((document) => document.type === doc.id);
  }, [documents, doc.id]);

  const getSubtypeLoadingState = useCallback(() => {
    return selectedDocumentTypes[doc.id] && isDocumentSubtypeLoading;
  }, [selectedDocumentTypes, doc.id, isDocumentSubtypeLoading]);

  // Get subtypes for a specific document type from specific subtype data
  const getSubtypesForDocumentType = useCallback((documentTypeName: string, subtypeData: any) => {
    if (!subtypeData?.result || !documentTypeName) return [];

    const documentTypeCode = getDocumentTypeCode(documentTypeName);
    const typePrefix = documentTypeCode.split("#")[0];

    return subtypeData.result.filter(
      (subtype: any) =>
        subtype.isActive && (subtype.code?.includes(typePrefix) || true)
    );
  }, [getDocumentTypeCode]);

  const handleCardFileUpload = useCallback((
    file: File,
    docType: string,
    subType: string
  ) => {
    // Validate file (matching EvidenceAttachmentsStep validation)
    const validation = validateFile(file);
    if (validation) {
      toast.error("File Upload Error", {
        description: validation,
      });
      return;
    }

    onFileUpload(file, docType, subType, doc.id);
  }, [onFileUpload, doc.id]);

  const handleCardFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const docType = selectedDocumentTypes[doc.id];
    const subType = selectedSubTypes[doc.id];

    if (!docType) {
      toast.error("Selection Required", {
        description: "Please select a document type first",
      });
      return;
    }

    if (!subType) {
      toast.error("Selection Required", {
        description: "Please select a document sub-type first",
      });
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleCardFileUpload(file, docType, subType);
    }
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  }, [selectedDocumentTypes, selectedSubTypes, doc.id, handleCardFileUpload]);

  const handleCardDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave();

    const docType = selectedDocumentTypes[doc.id];
    const subType = selectedSubTypes[doc.id];

    if (!docType) {
      toast.error("Selection Required", {
        description: "Please select a document type first",
      });
      return;
    }

    if (!subType) {
      toast.error("Selection Required", {
          description: "Please select a document sub-type first",
      });
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleCardFileUpload(file, docType, subType);
    }
  }, [selectedDocumentTypes, selectedSubTypes, doc.id, onDragLeave, handleCardFileUpload]);

  return (
    <Card key={doc.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">
                {doc.name} {index + 1}
              </h3>
              <p className="text-sm text-muted-foreground">
                {doc.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getCardDocuments().some(
                (d) => (d.file || d.url) && !d.needsReupload // Check for valid files or URLs
              ) && (
                <span className="flex items-center text-green-600 text-sm font-medium">
                  <Check className="h-4 w-4 mr-1" />
                  {isEditMode ? "Available" : "Selected"}
                </span>
              )}
              {canRemoveCard && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => onRemoveCard(doc.id)}
                  aria-label={`Remove document card ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Document Type Dropdown */}
          <div>
            <label className="text-sm font-medium mb-2 block" htmlFor={`doc-type-${doc.id}`}>
              Select Document Type
            </label>
            <Select
              value={selectedDocumentTypes[doc.id] || ""}
              onValueChange={(value) =>
                onDocumentTypeChange(doc.id, value)
              }
              disabled={isDocumentTypeLoading}
            >
              <SelectTrigger id={`doc-type-${doc.id}`}>
                <SelectValue
                  placeholder={
                    isDocumentTypeLoading
                      ? "Loading document types..."
                      : "Choose document type..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {documentTypeData?.result
                  ?.filter((type: any) => type.isActive)
                  .map((documentType: any) => (
                    <SelectItem key={documentType.code} value={documentType.name}>
                      {documentType.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Sub-Type Dropdown */}
          <div>
            <label className="text-sm font-medium mb-2 block" htmlFor={`doc-subtype-${doc.id}`}>
              Select Document Sub-Type
            </label>
            <Select
              value={selectedSubTypes[doc.id] || ""}
              onValueChange={(value) =>
                onSubtypeChange(doc.id, value)
              }
              disabled={
                !selectedDocumentTypes[doc.id] ||
                getSubtypeLoadingState()
              }
            >
              <SelectTrigger id={`doc-subtype-${doc.id}`}>
                <SelectValue
                  placeholder={
                    !selectedDocumentTypes[doc.id]
                      ? "Select document type first..."
                      : getSubtypeLoadingState()
                      ? "Loading document subtypes..."
                      : "Choose document sub-type..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {selectedDocumentTypes[doc.id] &&
                  getSubtypesForDocumentType(
                    selectedDocumentTypes[doc.id],
                    documentSubtypeData
                  ).map((subtype: any) => (
                    <SelectItem key={subtype.code} value={subtype.name}>
                      {subtype.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Area */}
          <div
            className={`flex flex-col items-center justify-center min-h-[120px] text-center border-2 border-dashed rounded-md p-4 ${
              dragging ? "bg-blue-50 border-blue-300" : "border-gray-300"
            } ${
              isUploadDisabled(doc.id)
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleCardDrop}
            role="button"
            tabIndex={isUploadDisabled(doc.id) ? -1 : 0}
            aria-label={`Upload area for ${doc.name} ${index + 1}`}
          >
            {getCardDocuments().length === 0 ? (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <h4 className="text-sm font-medium mb-1">
                  Drag and drop or click to upload
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Maximum file size: 5MB
                </p>
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    id={`file-${doc.id}`}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleCardFileChange}
                    disabled={isUploadDisabled(doc.id)}
                    aria-describedby={`file-help-${doc.id}`}
                  />
                  <label htmlFor={`file-${doc.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      asChild
                      disabled={isUploadDisabled(doc.id)}
                    >
                      <span>
                        <FilePlus className="h-4 w-4 mr-2" />
                        Browse Files
                      </span>
                    </Button>
                  </label>
                </div>
                <div id={`file-help-${doc.id}`} className="sr-only">
                  Select a file to upload. Accepted formats: JPG, PNG, PDF. Maximum size: 5MB.
                </div>
              </>
            ) : (
              <div className="w-full space-y-3">
                {getCardDocuments().map((document) => (
                  <div
                    key={document.id}
                    className="border rounded-md p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <span className="text-sm font-medium truncate max-w-[150px] block">
                            {document.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {document.category} - {document.subCategory}
                          </span>
                          {document.needsReupload && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full mt-1 inline-block">
                              Needs re-upload
                            </span>
                          )}
                          {document.url && (
                            <div className="mt-1">
                              <a 
                                href={document.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                                aria-label={`View ${document.name}`}
                              >
                                View Document
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => onRemoveDocument(document.id)}
                        aria-label={`Remove ${document.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {document.needsReupload && (
                      <div className="mb-2 p-2 bg-orange-50 rounded text-xs text-orange-700">
                        File from previous session - please re-upload to include in submission
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>
                        {document.size > 0 
                          ? formatFileSize(document.size)
                          : document.url ? "Available" : "No file"
                        }
                      </span>
                      <span className={document.needsReupload ? "text-orange-600" : "text-green-600"}>
                        {document.needsReupload ? "Needs re-upload" : 
                         document.file ? "Selected" : 
                         document.url ? "Available" : "No file"}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Allow adding more files to the same card */}
                {/* <div className="border-2 border-dashed border-gray-200 rounded-md p-3">
                  <div className="flex items-center justify-center">
                    <input
                      type="file"
                      id={`additional-file-${doc.id}`}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleCardFileChange}
                      disabled={isUploadDisabled(doc.id)}
                      aria-describedby={`additional-file-help-${doc.id}`}
                    />
                    <label htmlFor={`additional-file-${doc.id}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer text-xs"
                        asChild
                        disabled={isUploadDisabled(doc.id)}
                      >
                        <span>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Another File
                        </span>
                      </Button>
                    </label>
                  </div>
                  <div id={`additional-file-help-${doc.id}`} className="sr-only">
                    Add another file to this document card
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 