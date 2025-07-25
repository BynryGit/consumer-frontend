import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Loader2,
  Info,
  RotateCcw,
} from "lucide-react";

// TypeScript interfaces for step data
export interface StepDataBase {
  [key: string]: any;
}

export interface StepperStorageFormat {
  currentStep: number;
  completedSteps: number[];
  skippedSteps: number[];
  stepData: Record<number, StepDataBase>;
  timestamp?: number;
  version?: string;
}

export interface StepHelpers {
  // Storage operations
  getStepData: <T extends StepDataBase = StepDataBase>(
    stepIndex: number
  ) => T | undefined;
  setStepData: <T extends StepDataBase = StepDataBase>(
    stepIndex: number,
    data: Partial<T>
  ) => void;
  clearStepData: (stepIndex: number) => void;
  getAllStepData: () => Record<number, StepDataBase>;

  // Cross-step operations
  getDataFromStep: <T = any>(
    stepIndex: number,
    fieldPath: string
  ) => T | undefined;
  setDataToStep: <T = any>(
    stepIndex: number,
    fieldPath: string,
    value: T
  ) => void;
  copyDataBetweenSteps: (
    fromStep: number,
    toStep: number,
    fieldMapping?: Record<string, string>
  ) => void;

  // Validation and state
  hasStepData: (stepIndex: number) => boolean;
  isStepDataEmpty: (stepIndex: number) => boolean;
  getStepCompletionStatus: (
    stepIndex: number
  ) => "completed" | "skipped" | "active" | "available" | "disabled";

  // Data aggregation
  collectDataFromSteps: <T = any>(
    stepIndexes: number[],
    fieldPath: string
  ) => T[];
  aggregateStepData: <
    T extends Record<string, any> = Record<string, any>
  >() => T;

  // Utility
  exportStepperData: () => StepperStorageFormat;
  importStepperData: (data: StepperStorageFormat) => void;
  resetAllData: () => void;
}

/**
 * A flexible stepper component for multi-step forms and wizards.
 * Navigation is handled at the step component level.
 *
 * For detailed documentation and usage examples, please visit:
 * https://docs.google.com/document/d/18EyxVP4WAWYnp2pQrCQ9-CoVN4LfmXKkFW5Ck5Lqsyo/edit?usp=sharing
 */
export const Stepper = ({
  steps = [],
  onStepChange,
  onComplete,
  onValidation,
  autoSave = true,
  persistProgress = true,
  storageKey = "stepper-progress",
  allowSkip = false,
  enableRouting = true,
  basePath = "",
  className = "",
  onStepSave, // Optional callback for saving step data
  enableApiSave = false, // Enable API saving functionality
  saveOnStepChange = false, // Auto-save when changing steps
  trackDirtyState = false, // Track if step data has changed
  showDraftResume = false, // Control draft mode - when true, shows draft resume banner
  enableDraftMode = false, // NEW: Enable/disable draft mode functionality entirely
  allowStepClick = false, // NEW: Allow/disable direct step clicking - default true
}) => {
  // Core state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [skippedSteps, setSkippedSteps] = useState(new Set());
  const [stepData, setStepData] = useState({});
  
  // UI state
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  
  // Draft mode state
  const [isDraftMode, setIsDraftMode] = useState(enableDraftMode && !showDraftResume);
  const [showDraftBanner, setShowDraftBanner] = useState(enableDraftMode && showDraftResume);
  const [hasStoredProgress, setHasStoredProgress] = useState(false);
  const [draftStep, setDraftStep] = useState(0);
  
  // Dirty tracking state
  const [dirtySteps, setDirtySteps] = useState(new Set());
  const [originalStepData, setOriginalStepData] = useState({});
  
  // Initialization state
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoized utility functions to prevent re-renders
  const getStepSlug = useCallback((stepIndex) => {
    if (!steps || steps.length === 0 || stepIndex < 0 || stepIndex >= steps.length) {
      return "step-1";
    }
    return steps[stepIndex]?.slug || `step-${stepIndex + 1}`;
  }, [steps]);

  const getStepFromSlug = useCallback((slug) => {
    if (!steps || steps.length === 0) return 0;
    if (!slug) return 0;
    const index = steps.findIndex((step) => step.slug === slug);
    return index >= 0 ? index : 0;
  }, [steps]);

  // Get current step from URL - memoized to prevent unnecessary recalculations
  const getCurrentStepFromURL = useCallback(() => {
    if (!enableRouting || typeof window === "undefined") return 0;
    
    const hash = window.location.hash.replace("#", "");
    if (!hash) return 0;
    
    const stepIndex = getStepFromSlug(hash);
    return stepIndex >= 0 && stepIndex < steps.length ? stepIndex : 0;
  }, [enableRouting, getStepFromSlug, steps.length]);

  // Helper functions
  const getNestedValue = useCallback((obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }, []);

  const setNestedValue = useCallback((obj: any, path: string, value: any): void => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!(key in current)) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    if (lastKey) {
      target[lastKey] = value;
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    console.log('💾 saveProgress called:', {
      isDraftMode,
      persistProgress,
      storageKey,
      hasStepData: Object.keys(stepData).length > 0
    });
    
    if (!isDraftMode && persistProgress && storageKey) {
      try {
        const dataToSave = {
          currentStep,
          completedSteps: Array.from(completedSteps),
          skippedSteps: Array.from(skippedSteps),
          stepData,
          timestamp: Date.now(),
          version: "1.0.0",
        } as StepperStorageFormat;
        
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        setHasStoredProgress(true);
        console.log('✅ Progress saved to localStorage:', storageKey, dataToSave);
      } catch (error) {
        console.error("Failed to save stepper progress:", error);
      }
    } else {
      console.log('❌ saveProgress conditions not met:', {
        isDraftMode,
        persistProgress,
        storageKey: !!storageKey
      });
    }
  }, [currentStep, completedSteps, skippedSteps, stepData, persistProgress, storageKey, isDraftMode]);

  // Update step data
  const updateStepData = useCallback((stepIndex, data) => {
    setStepData((prev) => {
      const newData = { ...prev[stepIndex], ...data };

      // Track dirty state if enabled
      if (trackDirtyState) {
        const original = originalStepData[stepIndex] || {};
        const isDirty = JSON.stringify(original) !== JSON.stringify(newData);

        setDirtySteps((prevDirty) => {
          const newDirty = new Set(prevDirty);
          if (isDirty) {
            newDirty.add(stepIndex);
          } else {
            newDirty.delete(stepIndex);
          }
          return newDirty;
        });
      }

      return {
        ...prev,
        [stepIndex]: newData,
      };
    });
  }, [trackDirtyState, originalStepData]);

  // Create step helpers - memoized to prevent re-creation
  const stepHelpers = useMemo((): StepHelpers => ({
    getStepData: <T extends StepDataBase = StepDataBase>(stepIndex: number): T | undefined => {
      return stepData[stepIndex] as T;
    },

    setStepData: <T extends StepDataBase = StepDataBase>(stepIndex: number, data: Partial<T>): void => {
      updateStepData(stepIndex, data);
    },

    clearStepData: (stepIndex: number): void => {
      setStepData((prev) => {
        const newData = { ...prev };
        delete newData[stepIndex];
        return newData;
      });
    },

    getAllStepData: (): Record<number, StepDataBase> => {
      return { ...stepData };
    },

    getDataFromStep: <T = any,>(stepIndex: number, fieldPath: string): T | undefined => {
      const data = stepData[stepIndex];
      if (!data) return undefined;
      return getNestedValue(data, fieldPath) as T;
    },

    setDataToStep: <T = any,>(stepIndex: number, fieldPath: string, value: T): void => {
      const currentData = stepData[stepIndex] || {};
      const newData = { ...currentData };
      setNestedValue(newData, fieldPath, value);
      updateStepData(stepIndex, newData);
    },

    copyDataBetweenSteps: (fromStep: number, toStep: number, fieldMapping?: Record<string, string>): void => {
      const sourceData = stepData[fromStep];
      if (!sourceData) return;

      const targetData = stepData[toStep] || {};
      const newTargetData = { ...targetData };

      if (fieldMapping) {
        Object.entries(fieldMapping).forEach(([sourceField, targetField]) => {
          const value = getNestedValue(sourceData, sourceField);
          if (value !== undefined) {
            setNestedValue(newTargetData, targetField, value);
          }
        });
      } else {
        Object.assign(newTargetData, sourceData);
      }

      updateStepData(toStep, newTargetData);
    },

    hasStepData: (stepIndex: number): boolean => {
      return stepIndex in stepData && Object.keys(stepData[stepIndex] || {}).length > 0;
    },

    isStepDataEmpty: (stepIndex: number): boolean => {
      const data = stepData[stepIndex];
      return !data || Object.keys(data).length === 0;
    },

    getStepCompletionStatus: (stepIndex: number) => {
      if (completedSteps.has(stepIndex)) return "completed";
      if (skippedSteps.has(stepIndex)) return "skipped";
      if (stepIndex === currentStep) return "active";
      return "available";
    },

    collectDataFromSteps: <T = any,>(stepIndexes: number[], fieldPath: string): T[] => {
      return stepIndexes
        .map((stepIndex) => getNestedValue(stepData[stepIndex], fieldPath))
        .filter((value) => value !== undefined) as T[];
    },

    aggregateStepData: <T extends Record<string, any> = Record<string, any>>(): T => {
      const aggregated = {} as T;
      Object.values(stepData).forEach((data) => {
        Object.assign(aggregated, data);
      });
      return aggregated;
    },

    exportStepperData: (): StepperStorageFormat => {
      return {
        currentStep,
        completedSteps: Array.from(completedSteps) as number[],
        skippedSteps: Array.from(skippedSteps) as number[],
        stepData,
        timestamp: Date.now(),
        version: "1.0.0",
      };
    },

    importStepperData: (data: StepperStorageFormat): void => {
      setCompletedSteps(new Set(data.completedSteps || []));
      setSkippedSteps(new Set(data.skippedSteps || []));
      setStepData(data.stepData || {});
    },

    resetAllData: (): void => {
      startFresh();
    },
  }), [stepData, currentStep, completedSteps, skippedSteps, updateStepData, getNestedValue, setNestedValue]);

  // Initialize component and load saved data
  useEffect(() => {
    if (steps.length === 0) return;

    let savedData = null;
    
    // Load saved progress if enabled
    if (enableDraftMode && persistProgress && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          savedData = JSON.parse(saved);
          setHasStoredProgress(true);
          
          if (showDraftResume) {
            // Load saved data in normal mode
            setCompletedSteps(new Set(savedData.completedSteps || []));
            setSkippedSteps(new Set(savedData.skippedSteps || []));
            setStepData(savedData.stepData || {});
            setDraftStep(savedData.currentStep || 0);
          } else {
            // In draft mode, just track draft step for display
            setDraftStep(savedData.currentStep || 0);
          }
        }
      } catch (error) {
        console.error("Failed to load stepper progress:", error);
      }
    }

    // Get initial step from URL (URL is source of truth)
    let initialStep = 0; // Default fallback
    
    if (enableRouting && typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      
      if (hash) {
        // URL has a hash, try to get step from it
        const urlStep = getCurrentStepFromURL();
        initialStep = urlStep;
      } else {
        // No hash in URL, default to step 0 and set the URL
        initialStep = 0;
        const slug = getStepSlug(0);
        window.location.hash = `#${slug}`;
      }
    }
    
    setCurrentStep(initialStep);
    setIsInitialized(true);
  }, [steps.length, enableDraftMode, persistProgress, storageKey, showDraftResume, getCurrentStepFromURL, enableRouting, getStepSlug]);

  // URL change handler - this is the ONLY place currentStep should be updated from URL
  useEffect(() => {
    if (!enableRouting || !isInitialized) return;

    const handleHashChange = () => {
      const urlStep = getCurrentStepFromURL();
      
      // Only update if different to prevent loops
      if (urlStep !== currentStep) {
        const previousStep = currentStep;
        setCurrentStep(urlStep);
        
        // Call onStepChange callback if provided
        if (onStepChange) {
          onStepChange(urlStep, previousStep, {
            stepData: stepData[urlStep],
            isCompleted: completedSteps.has(urlStep),
            isSkipped: skippedSteps.has(urlStep),
          });
        }
      }
    };

    // Listen to hash changes
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, [enableRouting, isInitialized, currentStep, onStepChange, stepData, completedSteps, skippedSteps, getCurrentStepFromURL]);

  // Auto-save effect
  useEffect(() => {
    if (autoSave && isInitialized) {
      console.log('🔄 Auto-save triggered, stepData changed:', Object.keys(stepData));
      const timer = setTimeout(saveProgress, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSave, saveProgress, stepData, isInitialized]);

  // Navigation functions - these only update URL, never currentStep directly
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    if (enableRouting) {
      // Only update URL - hashchange will handle currentStep update
      const slug = getStepSlug(stepIndex);
      window.location.hash = `#${slug}`;
    } else {
      // Direct navigation when routing is disabled
      const previousStep = currentStep;
      setCurrentStep(stepIndex);
      
      if (onStepChange) {
        onStepChange(stepIndex, previousStep, {
          stepData: stepData[stepIndex],
          isCompleted: completedSteps.has(stepIndex),
          isSkipped: skippedSteps.has(stepIndex),
        });
      }
    }
  }, [steps.length, enableRouting, getStepSlug, currentStep, onStepChange, stepData, completedSteps, skippedSteps]);

  const handleNext = useCallback(async () => {
    // Save current step if needed
    if (!isDraftMode && saveOnStepChange && enableApiSave && onStepSave) {
      const isDirty = trackDirtyState ? dirtySteps.has(currentStep) : true;
      if (isDirty) {
        setSaveStatus("saving");
        try {
          await onStepSave(currentStep, stepData[currentStep], isDirty);
          setSaveStatus("saved");
          if (trackDirtyState) {
            setDirtySteps((prev) => {
              const newDirty = new Set(prev);
              newDirty.delete(currentStep);
              return newDirty;
            });
          }
        } catch (error) {
          setSaveStatus("error");
          console.error("Failed to save step data:", error);
        }
      }
    }

    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      goToStep(currentStep + 1);
    } else if (onComplete) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      onComplete(stepData, Array.from(completedSteps), Array.from(skippedSteps));
    }
  }, [currentStep, steps.length, isDraftMode, saveOnStepChange, enableApiSave, onStepSave, trackDirtyState, dirtySteps, stepData, onComplete, completedSteps, skippedSteps, goToStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const handleSkip = useCallback(() => {
    if (allowSkip && steps[currentStep]?.optional) {
      setSkippedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      }
    }
  }, [allowSkip, steps, currentStep, goToStep]);

  const handleSave = useCallback(async () => {
    if (enableApiSave && onStepSave) {
      const isDirty = trackDirtyState ? dirtySteps.has(currentStep) : true;
      if (isDirty) {
        setSaveStatus("saving");
        try {
          await onStepSave(currentStep, stepData[currentStep], isDirty);
          setSaveStatus("saved");
          if (trackDirtyState) {
            setDirtySteps((prev) => {
              const newDirty = new Set(prev);
              newDirty.delete(currentStep);
              return newDirty;
            });
          }
        } catch (error) {
          setSaveStatus("error");
          console.error("Failed to save step data:", error);
        }
      }
    } else {
      saveProgress();
      setSaveStatus("saved");
    }
  }, [enableApiSave, onStepSave, trackDirtyState, dirtySteps, currentStep, stepData, saveProgress]);

  // Validation functions
  const setValidationError = useCallback((error) => {
    setValidationErrors((prev) => ({
      ...prev,
      [currentStep]: error,
    }));
  }, [currentStep]);

  const clearValidationError = useCallback(() => {
    setValidationErrors((prev) => ({
      ...prev,
      [currentStep]: null,
    }));
  }, [currentStep]);

  // Draft mode functions
  const resumeFromDraft = useCallback(() => {
    setIsDraftMode(false);
    setShowDraftBanner(false);
  }, []);

  const startFresh = useCallback(() => {
    let initialStep = 0; // Default to first step
    
    // Only get from URL if routing is enabled and there's a hash
    if (enableRouting && typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        initialStep = getCurrentStepFromURL();
      } else {
        // No hash, set URL to first step
        const slug = getStepSlug(0);
        window.location.hash = `#${slug}`;
        initialStep = 0;
      }
    }
    
    setCurrentStep(initialStep);
    setCompletedSteps(new Set());
    setSkippedSteps(new Set());
    setStepData({});
    setValidationErrors({});
    setDirtySteps(new Set());
    setOriginalStepData({});
    setDraftStep(0);
    
    setIsDraftMode(enableDraftMode && !showDraftResume);
    setShowDraftBanner(false);
    setHasStoredProgress(false);

    if (persistProgress && storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [enableRouting, getCurrentStepFromURL, getStepSlug, enableDraftMode, showDraftResume, persistProgress, storageKey]);

  const resetForm = useCallback(() => {
    startFresh();
    window.location.reload();
  }, [startFresh]);

  // Get step status
  const getStepStatus = useCallback((stepIndex) => {
    if (completedSteps.has(stepIndex)) return "completed";
    if (skippedSteps.has(stepIndex)) return "skipped";
    if (stepIndex === currentStep) return "active";
    return "available";
  }, [completedSteps, skippedSteps, currentStep]);

  // Memoized current step object
  const currentStepObj = useMemo(() => {
    return steps && steps.length > 0 && currentStep >= 0 && currentStep < steps.length
      ? steps[currentStep]
      : null;
  }, [steps, currentStep]);

  // Step circle component
  const StepCircle = React.memo(({ step, index, status, completedSteps, skippedSteps, currentStep }: { step: any, index: number, status: string, completedSteps: Set<number>, skippedSteps: Set<number>, currentStep: number }) => {
    const isClickable = allowStepClick;

    const getCircleClasses = () => {
      const base = "w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs transition-all duration-200";
      const clickable = allowStepClick ? "cursor-pointer hover:scale-105" : "cursor-default";

      switch (status) {
        case "completed":
          return `${base} ${clickable} bg-blue-600 text-white`;
        case "active":
          return `${base} ${clickable} bg-blue-600 text-white ring-2 ring-blue-200`;
        case "skipped":
          return `${base} ${clickable} bg-gray-300 text-gray-600`;
        default:
          return `${base} ${clickable} bg-gray-100 text-gray-700 border border-gray-300`;
      }
    };

    const handleStepClick = () => {
      if (allowStepClick) {
        goToStep(index);
      }
    };

    // Add debugging
    React.useEffect(() => {
      if (status === "completed") {
        console.log(`Step ${index + 1} is marked as completed. Status: ${status}`);
      }
    }, [status, index]);

    return (
      <div className="flex flex-col items-center min-w-0">
        <div
          className={getCircleClasses()}
          onClick={handleStepClick}
          style={!allowStepClick ? { pointerEvents: 'none' } : {}}
        >
          {status === "completed" && !skippedSteps.has(index) ? (
            <Check size={12} />
          ) : status === "skipped" ? (
            <span className="text-xs">-</span>
          ) : (
            index + 1
          )}
        </div>
        <div className="mt-2 text-center max-w-20">
          <div
            className={`text-xs font-medium leading-tight ${
              status === "active" ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {step.title}
          </div>
        </div>
      </div>
    );
  });

  // Connection line component
  const ConnectionLine = React.memo(({ isCompleted }: { isCompleted: boolean }) => (
    <div className="flex-1 mx-2 mt-4">
      <div
        className={`h-px transition-colors duration-300 ${
          isCompleted ? "bg-blue-600" : "bg-gray-300"
        }`}
      />
    </div>
  ));

  const hasError = validationErrors[currentStep];

  // Show loading state if not initialized
  if (!isInitialized || steps.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <div className="animate-pulse">Initializing stepper...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Reset Form Button */}
      {enableDraftMode && !isDraftMode && hasStoredProgress && !showDraftBanner && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-red-600" size={16} />
              <span className="text-sm font-medium text-red-800">
                Saved progress detected
              </span>
              <span className="text-sm text-red-600">
                Reset to start completely fresh
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={resetForm}
                className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded hover:bg-red-200 transition-colors"
              >
                Reset Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft Resume Banner */}
      {enableDraftMode && showDraftBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RotateCcw className="text-amber-600" size={16} />
              <span className="text-sm font-medium text-amber-800">
                {!isDraftMode
                  ? "Resume from where you left off?"
                  : "Working in draft mode"}
              </span>
              <span className="text-sm text-amber-600">
                {!isDraftMode
                  ? `Step ${draftStep + 1}: ${steps[draftStep]?.title}`
                  : "Changes saved in memory only"}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={resumeFromDraft}
                className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded hover:bg-amber-200 transition-colors"
              >
                {!isDraftMode ? "Resume" : "Enable Saving"}
              </button>
              <button
                onClick={startFresh}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft Mode Indicator */}
      {enableDraftMode && isDraftMode && !showDraftBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
          <div className="flex items-center space-x-2">
            <Info className="text-blue-600" size={14} />
            <span className="text-xs text-blue-800">
              Draft mode: Changes are only saved in memory
            </span>
          </div>
        </div>
      )}

      {/* Progress Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Application Progress
        </h3>

        {/* Steps */}
        <div className="flex items-start">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <StepCircle
                step={step}
                index={index}
                status={getStepStatus(index)}
                completedSteps={completedSteps as Set<number>}
                skippedSteps={skippedSteps as Set<number>}
                currentStep={currentStep}
              />
              {index < steps.length - 1 && (
                <ConnectionLine isCompleted={completedSteps.has(index)} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStepObj ? (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Info Banner */}
          {currentStepObj.infoDescription && (
            <div className="flex items-start space-x-3 p-3 bg-blue-50 border-b border-blue-100">
              <Info className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
              <div className="text-sm text-blue-800">
                {currentStepObj.infoDescription}
              </div>
            </div>
          )}

          <div className="p-4">
            {/* Step Title */}
            <h2 className="text-lg font-medium text-gray-900 mb-1">
              {currentStepObj.title}
            </h2>
            <h5 className="text-sm font-medium text-gray-500 mb-4">
              {currentStepObj.description}
            </h5>

            {/* Error Message */}
            {hasError && (
              <div className="flex items-center space-x-2 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="text-red-600 flex-shrink-0" size={16} />
                <span className="text-sm text-red-800">{hasError}</span>
              </div>
            )}

            {/* Step Content */}
            <div className="mb-6">
              {currentStepObj.component ? (
                React.cloneElement(currentStepObj.component, {
                  // Existing props
                  data: stepData[currentStep] || {},
                  onDataChange: (data) => updateStepData(currentStep, data),
                  isActive: true,

                  // Navigation functions
                  onNext: handleNext,
                  onPrevious: handlePrevious,
                  onSkip: handleSkip,
                  onGoToStep: goToStep,

                  // Step context
                  currentStepIndex: currentStep,
                  totalSteps: steps.length,
                  isFirstStep: currentStep === 0,
                  isLastStep: currentStep === steps.length - 1,

                  // Step state
                  isCompleted: completedSteps.has(currentStep),
                  isSkipped: skippedSteps.has(currentStep),
                  completedSteps: Array.from(completedSteps),
                  skippedSteps: Array.from(skippedSteps),

                  // Validation
                  setValidationError,
                  clearValidationError,
                  isValidating,

                  // Data management
                  allStepData: stepData,

                  // Configuration
                  canSkip: allowSkip && currentStepObj.optional,
                  allowNavigation: {
                    canGoBack: currentStep > 0,
                    canGoForward: currentStep < steps.length - 1,
                  },

                  // Optional features
                  onSave: handleSave,
                  isDirty: trackDirtyState ? dirtySteps.has(currentStep) : false,
                  saveStatus,
                  isDraftMode,
                  stepHelpers,
                })
              ) : (
                <div className="p-6 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  Step content will be rendered here
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <div className="animate-pulse">Loading step content...</div>
          </div>
        </div>
      )}
    </div>
  );
};