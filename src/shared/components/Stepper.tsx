import React, { useState, useEffect, useCallback } from "react";
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
  // NEW: Control draft mode - when true, no localStorage operations
  showDraftResume = false,
}) => {
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 to indicate not initialized
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [skippedSteps, setSkippedSteps] = useState(new Set());
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [stepData, setStepData] = useState({});
  const [draftStep, setDraftStep] = useState(0);
  const [dirtySteps, setDirtySteps] = useState(new Set());
  const [originalStepData, setOriginalStepData] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle"); // 'idle', 'saving', 'saved', 'error'
  const [isDraftMode, setIsDraftMode] = useState(!showDraftResume); // Track if we're in draft mode (inverted logic)
  const [showDraftBanner, setShowDraftBanner] = useState(true); // Always show banner initially
  const [hasStoredProgress, setHasStoredProgress] = useState(false); // Track if localStorage has data

  // Helper function to get nested property value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Helper function to set nested property value
  const setNestedValue = (obj: any, path: string, value: any): void => {
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
  };

  // Create step helpers object
  const createStepHelpers = (): StepHelpers => ({
    // Storage operations
    getStepData: <T extends StepDataBase = StepDataBase>(
      stepIndex: number
    ): T | undefined => {
      return stepData[stepIndex] as T;
    },

    setStepData: <T extends StepDataBase = StepDataBase>(
      stepIndex: number,
      data: Partial<T>
    ): void => {
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

    // Cross-step operations
    getDataFromStep: <T = any,>(
      stepIndex: number,
      fieldPath: string
    ): T | undefined => {
      const data = stepData[stepIndex];
      if (!data) return undefined;
      return getNestedValue(data, fieldPath) as T;
    },

    setDataToStep: <T = any,>(
      stepIndex: number,
      fieldPath: string,
      value: T
    ): void => {
      const currentData = stepData[stepIndex] || {};
      const newData = { ...currentData };
      setNestedValue(newData, fieldPath, value);
      updateStepData(stepIndex, newData);
    },

    copyDataBetweenSteps: (
      fromStep: number,
      toStep: number,
      fieldMapping?: Record<string, string>
    ): void => {
      const sourceData = stepData[fromStep];
      if (!sourceData) return;

      const targetData = stepData[toStep] || {};
      const newTargetData = { ...targetData };

      if (fieldMapping) {
        // Copy specific fields with mapping
        Object.entries(fieldMapping).forEach(([sourceField, targetField]) => {
          const value = getNestedValue(sourceData, sourceField);
          if (value !== undefined) {
            setNestedValue(newTargetData, targetField, value);
          }
        });
      } else {
        // Copy all fields
        Object.assign(newTargetData, sourceData);
      }

      updateStepData(toStep, newTargetData);
    },

    // Validation and state
    hasStepData: (stepIndex: number): boolean => {
      return (
        stepIndex in stepData &&
        Object.keys(stepData[stepIndex] || {}).length > 0
      );
    },

    isStepDataEmpty: (stepIndex: number): boolean => {
      const data = stepData[stepIndex];
      return !data || Object.keys(data).length === 0;
    },

    getStepCompletionStatus: (stepIndex: number) => {
      return getStepStatus(stepIndex);
    },

    // Data aggregation
    collectDataFromSteps: <T = any,>(
      stepIndexes: number[],
      fieldPath: string
    ): T[] => {
      return stepIndexes
        .map((stepIndex) => getNestedValue(stepData[stepIndex], fieldPath))
        .filter((value) => value !== undefined) as T[];
    },

    aggregateStepData: <
      T extends Record<string, any> = Record<string, any>
    >(): T => {
      const aggregated = {} as T;
      Object.values(stepData).forEach((data) => {
        Object.assign(aggregated, data);
      });
      return aggregated;
    },

    // Utility
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
      setCurrentStep(data.currentStep || 0);
      setCompletedSteps(new Set(data.completedSteps || []));
      setSkippedSteps(new Set(data.skippedSteps || []));
      setStepData(data.stepData || {});
      // You might want to validate version compatibility here
    },

    resetAllData: (): void => {
      startFresh();
    },
  });
  const getStepSlug = (stepIndex) => {
    if (
      !steps ||
      steps.length === 0 ||
      stepIndex < 0 ||
      stepIndex >= steps.length
    ) {
      return "step-1";
    }
    return steps[stepIndex]?.slug || `step-${stepIndex + 1}`;
  };

  // Get step index from slug
  const getStepFromSlug = (slug) => {
    if (!steps || steps.length === 0) return -1; // Return -1 for invalid when no steps
    if (!slug) return -1; // Return -1 for empty slug
    const index = steps.findIndex((step) => step.slug === slug);
    console.log(`Looking for slug "${slug}", found index:`, index);
    return index; // Return actual index or -1 if not found
  };

  // Update URL
  const updateURL = useCallback(
    (stepIndex) => {
      if (enableRouting && typeof window !== "undefined") {
        const slug = getStepSlug(stepIndex);
        const newHash = `#${slug}`;

        // Only update if the hash has actually changed
        if (window.location.hash !== newHash) {
          window.location.hash = newHash;
          console.log("Hash updated to:", newHash);
        }
      }
    },
    [enableRouting, steps]
  );

  // Handle browser back/forward and hash changes
  useEffect(() => {
    if (!enableRouting || typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash;
      const slug = hash.replace("#", "");

      console.log("Hash changed to:", hash, "slug:", slug);

      if (slug) {
        const stepIndex = getStepFromSlug(slug);
        if (stepIndex >= 0 && stepIndex < steps.length) {
          console.log("Hash navigation - moving to step:", stepIndex);
          setCurrentStep(stepIndex);
        } else {
          console.log("Invalid slug in hash, staying on current step");
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [enableRouting, steps]);

  // Initialize from URL on mount - this should run AFTER steps are loaded
  useEffect(() => {
    // Don't run if steps aren't loaded yet or routing is disabled
    if (!enableRouting || typeof window === "undefined" || steps.length === 0) {
      console.log("Skipping hash initialization:", {
        enableRouting,
        hasWindow: typeof window !== "undefined",
        stepsLength: steps.length,
      });
      return;
    }

    // Don't run if we've already initialized (currentStep is not -1)
    if (currentStep !== -1) {
      return;
    }

    console.log("=== INITIALIZING FROM HASH ===");
    const hash = window.location.hash;
    const slug = hash.replace("#", "");

    console.log("Current hash:", hash);
    console.log("Extracted slug:", slug);
    console.log(
      "Available steps:",
      steps.map((s) => s.slug)
    );

    const urlStepIndex = getStepFromSlug(slug);
    console.log("URL step index from slug:", urlStepIndex);

    // Load saved progress and check if localStorage has data
    let savedStep = null;
    if (persistProgress && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed: StepperStorageFormat = JSON.parse(saved);
          console.log("Loaded saved data:", parsed);
          setHasStoredProgress(true);

          // Check version compatibility (optional)
          if (parsed.version && parsed.version !== "1.0.0") {
            console.warn(
              `Storage version mismatch: expected 1.0.0, got ${parsed.version}`
            );
          }

          // Only apply saved data if showDraftResume is true (normal mode)
          if (showDraftResume) {
            setCompletedSteps(new Set(parsed.completedSteps || []));
            setSkippedSteps(new Set(parsed.skippedSteps || []));
            setStepData(parsed.stepData || {});
            savedStep = parsed.currentStep;
            setDraftStep(savedStep || 0); // Set draft step for banner display
            console.log("Saved step:", savedStep);
          } else {
            // In draft mode, just set draftStep for display but don't load data
            setDraftStep(parsed.currentStep || 0);
          }
        }
      } catch (error) {
        console.error("Failed to load stepper progress:", error);
      }
    }

    // Determine which step to show
    let targetStep = 0;

    if (slug && urlStepIndex >= 0 && urlStepIndex < steps.length) {
      // Valid hash exists, use it
      targetStep = urlStepIndex;
      console.log("✅ Using HASH step:", targetStep, `(${slug})`);
    } else if (
      showDraftResume &&
      savedStep !== null &&
      savedStep >= 0 &&
      savedStep < steps.length
    ) {
      // No hash or invalid hash, but we have saved progress (only if showDraftResume is true)
      targetStep = savedStep;
      console.log("✅ Using SAVED step:", targetStep);
      // Update hash to match saved step
      setTimeout(() => updateURL(targetStep), 0);
    } else {
      // No valid hash or saved step, start at beginning
      targetStep = 0;
      console.log("✅ Using DEFAULT step:", targetStep);
      setTimeout(() => updateURL(targetStep), 0);
    }

    console.log("Setting current step to:", targetStep);
    setCurrentStep(targetStep);
    console.log("=== INITIALIZATION COMPLETE ===");
  }, [
    enableRouting,
    persistProgress,
    storageKey,
    steps,
    currentStep,
    showDraftResume,
  ]);

  // Initialize on first load to set initial URL if routing is enabled
  useEffect(() => {
    if (
      enableRouting &&
      typeof window !== "undefined" &&
      currentStep === 0 &&
      steps.length > 0
    ) {
      // Only update URL if we're on the initial load and don't have a specific slug in URL
      const path = window.location.pathname;
      const slug = path.split("/").pop();
      const hasValidSlug = steps.some((step) => step.slug === slug);

      if (!hasValidSlug) {
        updateURL(0);
      }
    }
  }, [enableRouting, steps, updateURL, currentStep]);

  // Load progress from localStorage (non-routing case) - ONLY if showDraftResume is true
  useEffect(() => {
    if (!enableRouting && showDraftResume && persistProgress && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const {
            currentStep: savedStep,
            completedSteps: savedCompleted,
            skippedSteps: savedSkipped,
            stepData: savedData,
          }: StepperStorageFormat = JSON.parse(saved);
          setCurrentStep(savedStep || 0);
          setCompletedSteps(new Set(savedCompleted || []));
          setSkippedSteps(new Set(savedSkipped || []));
          setStepData(savedData || {});
          setHasStoredProgress(true);
        }
      } catch (error) {
        console.error("Failed to load stepper progress:", error);
      }
    }
  }, [enableRouting, persistProgress, storageKey, showDraftResume]);

  // Save progress to localStorage - ONLY if showDraftResume is true (normal mode)
  const saveProgress = useCallback(() => {
    if (showDraftResume && persistProgress && storageKey) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            currentStep,
            completedSteps: Array.from(completedSteps),
            skippedSteps: Array.from(skippedSteps),
            stepData,
            timestamp: Date.now(),
            version: "1.0.0",
          } as StepperStorageFormat)
        );
        setHasStoredProgress(true);
      } catch (error) {
        console.error("Failed to save stepper progress:", error);
      }
    }
  }, [
    currentStep,
    completedSteps,
    skippedSteps,
    stepData,
    persistProgress,
    storageKey,
    showDraftResume,
  ]);

  // Auto-save functionality - Always enabled for memory (draft mode) or localStorage (normal mode)
  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(saveProgress, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSave, saveProgress, stepData]);

  // Resume from draft (switch to normal mode)
  const resumeFromDraft = () => {
    console.log("Resuming from draft...");
    setIsDraftMode(false); // Exit draft mode (enable localStorage)
    setShowDraftBanner(false); // Hide banner
    // Keep current state and enable localStorage saving from now on
  };

  // Start fresh
  const startFresh = () => {
    console.log("Starting fresh...");
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setSkippedSteps(new Set());
    setStepData({});
    setValidationErrors({});
    setDirtySteps(new Set());
    setOriginalStepData({});
    setDraftStep(0);
    updateURL(0);
    setIsDraftMode(!showDraftResume); // Set draft mode based on prop
    setShowDraftBanner(false); // Hide banner after starting fresh
    setHasStoredProgress(false);

    // Clear localStorage if it exists
    if (persistProgress && storageKey) {
      localStorage.removeItem(storageKey);
      console.log("localStorage cleared");
    }
  };

  // Reset form (clear localStorage and restart)
  const resetForm = () => {
    console.log("Resetting form...");
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setSkippedSteps(new Set());
    setStepData({});
    setValidationErrors({});
    setDirtySteps(new Set());
    setOriginalStepData({});
    setDraftStep(0);
    updateURL(0);
    setHasStoredProgress(false);

    // Clear localStorage
    if (persistProgress && storageKey) {
      localStorage.removeItem(storageKey);
      console.log("localStorage cleared from reset");
    }
    window.location.reload();
  };

  // Navigate to step
  const goToStep = async (stepIndex, force = false) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    const step = steps[stepIndex];
    if (!force && step.disabled) return;

    // Only save if showDraftResume is true (normal mode)
    if (
      showDraftResume &&
      saveOnStepChange &&
      enableApiSave &&
      onStepSave &&
      currentStep !== stepIndex
    ) {
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
          // Continue navigation even if save fails
        }
      }
    }

    const previousStep = currentStep;
    setCurrentStep(stepIndex);
    updateURL(stepIndex);

    if (onStepChange) {
      onStepChange(stepIndex, previousStep, {
        stepData: stepData[stepIndex],
        isCompleted: completedSteps.has(stepIndex),
        isSkipped: skippedSteps.has(stepIndex),
      });
    }
  };

  // Navigation functions for step components
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      goToStep(currentStep + 1, true);
    } else if (onComplete) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      onComplete(
        stepData,
        Array.from(completedSteps),
        Array.from(skippedSteps)
      );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1, true);
    }
  };

  const handleSkip = () => {
    if (allowSkip && steps[currentStep].optional) {
      setSkippedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1, true);
      }
    }
  };

  const handleSave = async () => {
    // Always allow saving (memory for draft mode, localStorage for normal mode)
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
  };

  // Validation functions for step components
  const setValidationError = (error) => {
    setValidationErrors((prev) => ({
      ...prev,
      [currentStep]: error,
    }));
  };

  const clearValidationError = () => {
    setValidationErrors((prev) => ({
      ...prev,
      [currentStep]: null,
    }));
  };

  // Update step data
  const updateStepData = (stepIndex, data) => {
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
  };

  // Get step status
  const getStepStatus = (stepIndex) => {
    if (completedSteps.has(stepIndex)) return "completed";
    if (skippedSteps.has(stepIndex)) return "skipped";
    if (stepIndex === currentStep) return "active";
    if (stepIndex < currentStep) return "available";
    return "disabled";
  };

  // Step circle component
  const StepCircle = ({ step, index, status }) => {
    const isClickable =
      status === "completed" || status === "available" || status === "active";

    const getCircleClasses = () => {
      const base =
        "w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs transition-all duration-200";
      const clickable = isClickable
        ? "cursor-pointer hover:scale-105"
        : "cursor-not-allowed";

      switch (status) {
        case "completed":
          return `${base} ${clickable} bg-blue-600 text-white`;
        case "active":
          return `${base} ${clickable} bg-blue-600 text-white ring-2 ring-blue-200`;
        case "skipped":
          return `${base} ${clickable} bg-gray-300 text-gray-600`;
        case "available":
          return `${base} ${clickable} bg-gray-100 text-gray-700 border border-gray-300`;
        default:
          return `${base} ${clickable} bg-gray-100 text-gray-400`;
      }
    };

    return (
      <div className="flex flex-col items-center min-w-0">
        <div
          className={getCircleClasses()}
          onClick={() => isClickable && goToStep(index)}
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
  };

  // Connection line component
  const ConnectionLine = ({ isCompleted }) => (
    <div className="flex-1 mx-2 mt-4">
      <div
        className={`h-px transition-colors duration-300 ${
          isCompleted ? "bg-blue-600" : "bg-gray-300"
        }`}
      />
    </div>
  );

  const currentStepObj =
    steps && steps.length > 0 && currentStep >= 0 && currentStep < steps.length
      ? steps[currentStep]
      : null;
  const hasError = validationErrors[currentStep];

  // Show loading state if not initialized yet
  if (currentStep === -1) {
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
      {/* Reset Form Button - Show when showDraftResume is true and has stored progress but draft banner is hidden */}
      {showDraftResume && hasStoredProgress && !showDraftBanner && (
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

      {/* Draft Resume Banner - Show when showDraftBanner is true */}
      {showDraftBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RotateCcw className="text-amber-600" size={16} />
              <span className="text-sm font-medium text-amber-800">
                {showDraftResume
                  ? "Resume from where you left off?"
                  : "Working in draft mode"}
              </span>
              <span className="text-sm text-amber-600">
                {showDraftResume
                  ? `Step ${draftStep + 1}: ${steps[draftStep]?.title}`
                  : "Changes saved in memory only"}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={resumeFromDraft}
                className="px-3 py-1 text-xs font-medium text-amber-800 bg-amber-100 rounded hover:bg-amber-200 transition-colors"
              >
                {showDraftResume ? "Resume" : "Enable Saving"}
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
      {isDraftMode && !showDraftBanner && (
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
          {steps && steps.length > 0 ? (
            steps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCircle
                  step={step}
                  index={index}
                  status={getStepStatus(index)}
                />
                {index < steps.length - 1 && (
                  <ConnectionLine isCompleted={completedSteps.has(index)} />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="text-gray-500 text-sm">Loading steps...</div>
          )}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {currentStepObj.title}
            </h2>
            <h5 className="text-lg font-medium text-gray-900 mb-4">
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
              {/* Render step component with enhanced props */}
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
                  isDirty: trackDirtyState
                    ? dirtySteps.has(currentStep)
                    : false,
                  saveStatus,
                  isDraftMode, // Pass draft mode status to step components
                  stepHelpers: createStepHelpers(), // Pass step helpers to step components
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
        // Loading state when steps are not ready
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center text-gray-500">
            <div className="animate-pulse">Loading step content...</div>
          </div>
        </div>
      )}
    </div>
  );
};
