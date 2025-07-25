// import { formatFileSize, validateFile } from "@features/cx/shared/utils/file";
import { formatFileSize, validateFile } from "@shared/utils/file";
import { DynamicForm } from "@shared/components/DynamicForm";
import { StepHelpers } from "@shared/components/Stepper";
import { toast } from "@shared/hooks/use-toast";
import { FormField, FormService } from "@shared/services/FormServices";
import { Button } from "@shared/ui/button";
import { File, FileText, Image, Upload, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface FileData {
  id: string;
  file?: File; // Optional since restored files won't have File object
  name: string;
  size: number;
  type: string;
  preview?: string;
  needsReupload?: boolean; // Flag for restored files that need re-upload
}

interface EvidenceAttachmentsStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  clearValidationError?: () => void;
  isValidating?: boolean;
  onDataChange?: (data: any) => void; // Callback to pass data to parent
}

export function EvidenceAttachmentsStep({
  remoteUtilityId,
  storageKey,
  stepHelpers,
  currentStepIndex = 2,
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating,
  onDataChange,
}: EvidenceAttachmentsStepProps) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const dataLoadedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation constants
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];
  const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

  // Create form fields
  const evidenceFields: FormField[] = [
    {
      name: "notes",
      label: "Additional Notes",
      type: "textarea",
      placeholder: "Add any additional notes about the evidence or attachments",
      helperText: "Provide additional context or details about the evidence",
      showHelperTooltip: true,
      tooltipText:
        "Add any additional notes about the evidence or attachments that support this complaint.",
      fullWidth: true,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "expectedResolution",
      label: "Expected Resolution",
      type: "textarea",
      placeholder: "Add any additional notes about the evidence or attachments",
      helperText: "Provide additional context or details about the evidence",
      showHelperTooltip: true,
      tooltipText:
        "Add any additional notes about the evidence or attachments that support this complaint.",
      fullWidth: true,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
    {
      name: "incidentDate",
      label: "Incident Date",
      type: "datepicker",
      placeholder: "Select the date of the incident",
      helperText: "Select the date of the incident",
      showHelperTooltip: true,
      tooltipText: "Select the date of the incident",
      fullWidth: true,
      required: true,
      classes: {
        container: "w-full mb-6",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full px-4 py-3 border border-gray-300 rounded-lg",
        error: "text-red-600 text-sm mt-1",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
  ];

  // Create Form Instance
  const evidenceForm = FormService.createForm({
    fields: evidenceFields,
    mode: "onChange",
    validateOnMount: false,
    defaultValues: {
      notes: "",
      expectedResolution: "",
      incidentDate: "",
      attachments: [],
    },
  });

  // Helper function to save step data using stepHelpers
  const saveStepData = useCallback(
    (data: any) => {
      if (!stepHelpers) return;

      try {
        const stepData = {
          ...data,
          timestamp: new Date().toISOString(),
          stepIndex: currentStepIndex,
        };

        stepHelpers.setStepData(currentStepIndex, stepData);
        console.log("Step data saved via stepHelpers:", stepData);
      } catch (error) {
        console.error("Failed to save step data via stepHelpers:", error);
        toast({
          title: "Failed to save progress",
          description: "Your progress may not be saved. Please try again.",
          variant: "destructive",
        });
      }
    },
    [stepHelpers, currentStepIndex]
  );

  // Helper function to get step data using stepHelpers
  const getStepData = useCallback(() => {
    if (!stepHelpers) return null;

    try {
      return stepHelpers.getStepData(currentStepIndex);
    } catch (error) {
      console.error("Failed to get step data via stepHelpers:", error);
      return null;
    }
  }, [stepHelpers, currentStepIndex]);

  // Helper function to get file icon
  const getFileIcon = (type: string) => {
    if (type === "application/pdf") {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (type.startsWith("image/")) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  // Handle file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: FileData[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
        return;
      }

      // Check for duplicates
      const isDuplicate = selectedFiles.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (isDuplicate) {
        errors.push(`File "${file.name}" is already selected`);
        return;
      }

      const fileData: FileData = {
        id: `${file.name}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        file, // Store actual File object in memory
        name: file.name,
        size: file.size,
        type: file.type,
        needsReupload: false, // New uploads don't need re-upload
      };

      newFiles.push(fileData);
    });

    if (errors.length > 0) {
      toast({
        title: "File Upload Errors",
        description: errors.join(", "),
        variant: "destructive",
      });
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(updatedFiles);

      // Save to stepHelpers (metadata only, not the actual File objects)
      const currentData = getStepData() || {};
      const stepData = {
        ...currentData,
        attachments: updatedFiles.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          // Note: File objects are kept in memory only, not persisted
        })),
      };
      saveStepData(stepData);

      // Notify parent component of data change with File objects
      if (onDataChange) {
        const submissionData = {
          ...stepData,
          file: updatedFiles
            .filter((f) => !f.needsReupload && f.file)
            .map((f) => f.file!),
          fileMetadata: updatedFiles.map((f) => ({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type,
            needsReupload: f.needsReupload || false,
          })),
        };
        console.log("Calling onDataChange with:", submissionData);
        onDataChange(submissionData);
        (window as any).handleFileDataChange(submissionData);
      }

      toast({
        title: "Files uploaded successfully",
        description: `${newFiles.length} file(s) added`,
        variant: "default",
      });
    }

    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const updatedFiles = selectedFiles.filter((f) => f.id !== fileId);
    setSelectedFiles(updatedFiles);

    // Update stepHelpers (metadata only)
    const currentData = getStepData() || {};
    const stepData = {
      ...currentData,
      attachments: updatedFiles.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        // Note: File objects are kept in memory only, not persisted
      })),
    };
    saveStepData(stepData);

    // Notify parent component of data change
    if (onDataChange) {
      const submissionData = {
        ...stepData,
        file: updatedFiles
          .filter((f) => !f.needsReupload && f.file)
          .map((f) => f.file!),
        fileMetadata: updatedFiles.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          needsReupload: f.needsReupload || false,
        })),
      };
      console.log("File removed - calling onDataChange with:", submissionData);
      onDataChange(submissionData);
    }

    toast({
      title: "File removed",
      variant: "default",
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files) {
      // Create a mock event to reuse handleFileUpload logic
      const mockEvent = {
        target: { files, value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  // Load saved data from stepHelpers on component mount
  useEffect(() => {
    if (stepHelpers && !dataLoadedRef.current) {
      try {
        const savedStepData = getStepData();
        if (savedStepData) {
          console.log("Loaded step data from stepHelpers:", savedStepData);

          // Populate form with saved data
          FormService.populateForm(evidenceForm, savedStepData, evidenceFields);

          // Restore file metadata (but mark as needing re-upload since File objects can't be persisted)
          if (
            savedStepData.attachments &&
            Array.isArray(savedStepData.attachments)
          ) {
            const restoredFiles: FileData[] = savedStepData.attachments.map(
              (fileMetadata: any) => ({
                id: fileMetadata.id,
                name: fileMetadata.name,
                size: fileMetadata.size,
                type: fileMetadata.type,
                needsReupload: true, // Mark as needing re-upload
                file: undefined, // No File object available
              })
            );
            setSelectedFiles(restoredFiles);

            if (restoredFiles.length > 0) {
              toast({
                title: "Previous files restored",
                description: `${restoredFiles.length} file(s) from previous session. Please re-upload if needed.`,
                variant: "default",
              });
            }
          }

          // Notify parent component with initial data
          if (onDataChange) {
            const submissionData = {
              ...savedStepData,
              file: [], // No File objects on initial load
              fileMetadata: (savedStepData.attachments || []).map((f: any) => ({
                id: f.id,
                name: f.name,
                size: f.size,
                type: f.type,
                needsReupload: true, // All restored files need re-upload
              })),
            };
            console.log(
              "Initial load - calling onDataChange with:",
              submissionData
            );
            onDataChange(submissionData);
          }
        }
        dataLoadedRef.current = true;
      } catch (error) {
        console.error("Failed to load step data from stepHelpers:", error);
        dataLoadedRef.current = true;
      }
    }
  }, [stepHelpers, currentStepIndex, getStepData, onDataChange]);

  const handleFormSubmit = (data: any) => {
    // Clear any previous validation errors
    if (clearValidationError) {
      clearValidationError();
    }
    setValidationErrors({});

    // Validate required fields
    const errors: Record<string, string> = {};

    // Check incident date (required field)
    if (!data.incidentDate || data.incidentDate === "") {
      errors.incidentDate = "Incident Date is required";
    }

    // If there are validation errors, display them and prevent submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      const errorMessage = `Please fill in all required fields: ${Object.keys(
        errors
      ).join(", ")}`;
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Set validation error in stepper
      if (setValidationError) {
        setValidationError(errorMessage);
      }
      return;
    }

    // Separate valid files (with actual File objects) from files needing re-upload
    const validFiles = selectedFiles.filter((f) => !f.needsReupload && f.file);
    const filesNeedingReupload = selectedFiles.filter((f) => f.needsReupload);

    if (filesNeedingReupload.length > 0) {
      toast({
        title: "Warning: Some files need re-upload",
        description: `${filesNeedingReupload.length} file(s) from previous session need to be re-uploaded.`,
        variant: "destructive",
      });
    }

    // Create submission data with actual File objects
    const submissionData = {
      ...data,
      // File metadata for stepHelpers storage
      attachments: selectedFiles.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        needsReupload: f.needsReupload,
      })),
      // Actual File objects for API submission (only valid files)
      file: validFiles.map((f) => f.file!), // Use actual File objects
      fileMetadata: validFiles.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
      })),
      validFileCount: validFiles.length,
      totalFileCount: selectedFiles.length,
      isStepComplete: true,
      completedAt: new Date().toISOString(),
    };

    // Save step data using stepHelpers (without File objects for persistence)
    const stepDataForStorage = {
      ...submissionData,
      file: undefined, // Don't store File objects in stepHelpers
    };

    saveStepData(stepDataForStorage);

    console.log("Submission data with File objects:", submissionData);
    console.log("Valid File objects for API:", submissionData.file);

    // Proceed to next step
    if (onNext) {
      onNext();
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    // Clear validation errors for this field when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });

      // Clear stepper validation error if all errors are resolved
      if (Object.keys(validationErrors).length === 1 && clearValidationError) {
        clearValidationError();
      }
    }

    // Get current step data and update the specific field
    const currentData = getStepData() || {};
    const updatedData = {
      ...currentData,
      [fieldName]: value,
      lastUpdated: new Date().toISOString(),
    };

    // Save updated data using stepHelpers
    saveStepData(updatedData);

    // Notify parent component of form data changes
    if (onDataChange) {
      const submissionData = {
        ...updatedData,
        file: selectedFiles
          .filter((f) => !f.needsReupload && f.file)
          .map((f) => f.file!),
        fileMetadata: selectedFiles.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          needsReupload: f.needsReupload || false,
        })),
      };
      console.log("Field changed - calling onDataChange with:", submissionData);
      onDataChange(submissionData);
      (window as any).handleFileDataChange(submissionData);
    }
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Upload className="h-5 w-5 text-purple-600" />
        </div>        
      </div> */}

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
          <DynamicForm
            fields={evidenceFields}
            form={evidenceForm}
            onSubmit={handleFormSubmit}
            onFieldChange={handleFieldChange}
            config={{
              showSubmitButton: false,
              showResetButton: false,
            }}
            gridColumns={1}
            responsiveColumns={{ sm: 1, md: 1 }}
          />
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
          <div
            className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:bg-purple-50/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center">
              <div className="p-4 bg-purple-100 rounded-full mb-4">
                <Upload className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium mb-2 text-gray-900">Upload Files</h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag & drop files here or click to browse
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Max file size: 10MB. Supported formats: PDF, JPG, PNG
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files Display */}
        {selectedFiles.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-4">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedFiles.map((fileData) => (
                <div
                  key={fileData.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-colors ${
                    fileData.needsReupload
                      ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(fileData.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.name}
                      </p>
                      {fileData.needsReupload && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Needs re-upload
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileData.size)}
                    </p>
                    {fileData.needsReupload && (
                      <p className="text-xs text-orange-600 mt-1">
                        File from previous session - please re-upload to include
                        in submission
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(fileData.id)}
                    className="flex-shrink-0 p-1 hover:bg-red-100 rounded-full transition-colors"
                    title="Remove file"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Validation Error Display */}
      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <h4 className="font-medium text-red-800">Validation Errors</h4>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isValidating}
          className="min-w-[120px]"
        >
          Previous
        </Button>
        <Button
          onClick={() => handleFormSubmit(evidenceForm.getValues())}
          disabled={isValidating}
          className="min-w-[200px]"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </>
          ) : (
            "Continue to Review & Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
