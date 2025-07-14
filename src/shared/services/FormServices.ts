import { zodResolver } from "@hookform/resolvers/zod";
import { format, isSameDay, isValid, parse, parseISO } from "date-fns";
import {
  DefaultValues,
  FieldValues,
  Resolver,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";

export interface FormFieldClasses {
  container?: string;
  label?: string;
  input?: string;
  textarea?: string;
  select?: any;
  checkbox?: string;
  radio?: string;
  file?: string;
  error?: string;
  helperText?: string;
  required?: string;
  placeholder?: string;
  MultiSelectDropdown?: string;
  div?: string;
  verifyButton?: string;
  helperIcon?: string;
  tooltip?: string;
}

export interface FormClasses {
  form?: string;
  fieldContainer?: string;
  div?: string;
  buttonContainer?: string;
  fieldGroup?: string;
  label?: string;
  input?: string;
  textarea?: string;
  select?: string;
  checkbox?: string;
  container?: string;
  inputContainer?: string;
  iconContainer?: string;
  radioItem?: string;
  radioGroup?: string;
  radioContainer?: string;
  radio?: string;
  file?: string;
  button?: string;
  submitButton?: string;
  resetButton?: string;
  error?: string;
  helperText?: string;
  required?: string;
  disabled?: string;
  focused?: string;
  valid?: string;
  invalid?: string;
  loading?: string;
  verifyButton?: string;
  helperIcon?: string;
  tooltip?: string;
}

export type FormFieldType =
  | "text"
  | "select"
  | "number"
  | "date"
  | "time"
  | "array";

export interface FormField {
  name: string;
  label?: string;
  fields?: FormField[]; // ✅ For nested fields like arrays

  type:
    | "text"
    | "autoPopulated"
    | "email"
    | "password"
    | "number"
    | "decimal"
    | "negative-decimal"
    | "datepicker"
    | "time"
    | "select"
    | "multi-select"
    | "textarea"
    | "checkbox"
    | "radio"
    | "file"
    | "phone"
    | "url"
    | "hidden"
    | "range"
    | "switch"
    | "color"
    | "form-array" 
    | "label"
    | "autoPopulated"
    | "color"
    | "checkbox-group";
  required?: boolean;
  placeholder?: string;

  // Enhanced: Custom render function
  customRender?: (
    field: FormField,
    form: any,
    error?: string
  ) => React.ReactNode;

  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
    description?: string;
  }>;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string; // for file inputs
  multiple?: boolean;
  maxSize?: number; // for file inputs
  rows?: number; // for textarea
  cols?: number; // for textarea
  size?: "small" | "medium" | "large";
  variant?: "outlined" | "filled" | "standard";
  customValidation?: (value: any) => string | boolean;
  dependsOn?: string; // Field dependency
  showWhen?: (formValues: any) => boolean; // Conditional visibility
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  onFocus?: (value: any) => void;
  defaultValue?: any;
  disabled?: boolean;
  readonly?: boolean;
  helperText?: string;
  // Enhanced: Verify button functionality
  showVerifyButton?: boolean;
  verifyButtonText?: string;
  onVerify?: (value: any, field: FormField) => Promise<boolean> | boolean;
  verificationStatus?: "unverified" | "verifying" | "verified" | "failed";
  verifiedText?: string;
  verifyButtonDisabled?: boolean;

  // Enhanced: Helper tooltip functionality
  showHelperTooltip?: boolean;
  tooltipText?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";

  // UI & Styling
  classes?: FormFieldClasses;
  className?: string; // Additional custom class
  validation?: any;
  containerClassName?: string;
  radioGroupClassName?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;

  // Layout
  width?: string | number;
  fullWidth?: boolean;
  inline?: boolean;

  // Advanced options
  autoComplete?: string;
  autoFocus?: boolean;
  tabIndex?: number;

  // Field grouping
  group?: string;
  groupOrder?: number;

  // MultiSelectDropdown options
  closeOnSelect?: boolean;
  maxDisplayItems?: number;
  searchable?: boolean;
  clearable?: boolean;
  // FormArray specific options
  itemFields?: FormField[]; // Fields for each array item
  minItems?: number; // Minimum number of items
  maxItems?: number; // Maximum number of items
  addButtonText?: string; // Text for add button
  removeButtonText?: string; // Text for remove button
  emptyMessage?: string; // Message when array is empty
  showAddButton?: boolean; // Show/hide add button
  showRemoveButton?: boolean; // Show/hide remove button
  showReorderButtons?: boolean; // Show/hide reorder buttons
  onSearchChange?: (term) => void;
  maxSelection?: number;

  value?: any;
}

export interface FormConfig {
  fields: FormField[];
  onSubmit?: (data: any) => void | Promise<void>;
  mode?: "onChange" | "onBlur" | "onSubmit";
  shouldUnregister?: boolean;

  // Form styling & layout
  classes?: FormClasses;
  className?: string;
  style?: React.CSSProperties;
  layout?: "vertical" | "horizontal" | "inline" | "grid";
  columns?: number; // for grid layout
  spacing?: "none" | "small" | "medium" | "large" | "comfortable";

  // Form behavior
  resetOnSubmit?: boolean;
  showResetButton?: boolean;
  showSubmitButton?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
  showProgress?: boolean;
  validateOnMount?: boolean;
  defaultValues?: any;
}

// Enhanced default theme classes
export const defaultFormClasses: FormClasses = {
  form: "dynamic-form",
  fieldContainer: "form-field-container",
  fieldGroup: "form-field-group",
  label: "form-label",
  input: "form-input",
  textarea: "form-textarea",
  select: "form-select",
  checkbox: "form-checkbox",
  radio: "form-radio",
  file: "form-file",
  button: "form-button",
  submitButton: "form-submit-button",
  resetButton: "form-reset-button",
  error: "form-error",
  helperText: "form-helper-text",
  required: "form-required",
  disabled: "form-disabled",
  focused: "form-focused",
  valid: "form-valid",
  invalid: "form-invalid",
  loading: "form-loading",
  verifyButton: "form-verify-button",
  helperIcon: "form-helper-icon",
  tooltip: "form-tooltip",
};

class EnhancedFormService {
  private static DATE_FORMATS = {
    "DD/MM/YYYY": "dd/MM/yyyy",
    "MM/DD/YYYY": "MM/dd/yyyy",
    "YYYY-MM-DD": "yyyy-MM-dd",
    "DD-MM-YYYY": "dd-MM-yyyy",
  };

  static createForm<T extends FieldValues = FieldValues>(
    config: FormConfig
  ): UseFormReturn<T> {
    const schema = this.createValidationSchema(config.fields);
    const defaultValues = this.getDefaultValues(config.fields);

    // Cast resolver to the appropriate generic type
    const resolver = zodResolver(schema) as unknown as Resolver<T>;

    // Cast defaultValues to DefaultValues<T>
    const form = useForm<T>({
      resolver,
      defaultValues: defaultValues as DefaultValues<T>,
      mode: config.mode || "onBlur",
      shouldUnregister: config.shouldUnregister ?? false,
    });

    if (config.validateOnMount) {
      setTimeout(() => form.trigger(), 0);
    }

    return form;
  }

  /**
   * Enhanced: Handle field verification
   */
  static async handleFieldVerification(
    field: FormField,
    value: any,
    onStatusChange?: (
      fieldName: string,
      status: FormField["verificationStatus"]
    ) => void
  ): Promise<boolean> {
    if (!field.onVerify || !field.showVerifyButton) {
      return false;
    }

    try {
      // Set verifying status
      onStatusChange?.(field.name, "verifying");

      const result = await field.onVerify(value, field);

      // Set final status based on result
      onStatusChange?.(field.name, result ? "verified" : "failed");

      return result;
    } catch (error) {
      onStatusChange?.(field.name, "failed");
      return false;
    }
  }

  /**
   * Enhanced: Get verification button text based on status
   */
  static getVerifyButtonText(field: FormField): string {
    const status = field.verificationStatus || "unverified";

    switch (status) {
      case "verifying":
        return "Verifying...";
      case "verified":
        return field.verifiedText || "Verified";
      case "failed":
        return field.verifyButtonText || "Retry";
      default:
        return field.verifyButtonText || "Verify";
    }
  }

  /**
   * Enhanced: Check if verify button should be disabled
   */
  static isVerifyButtonDisabled(field: FormField, value: any): boolean {
    if (field.verifyButtonDisabled) return true;
    if (field.verificationStatus === "verifying") return true;
    if (!value || value.toString().trim() === "") return true;

    // For email fields, basic validation
    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value);
    }

    // For phone fields, basic validation
    if (field.type === "phone") {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return !phoneRegex.test(value);
    }

    return false;
  }

  /**
   * Creates Zod validation schema from form fields
   */
  private static createValidationSchema(fields: FormField[]): z.ZodObject<any> {
    const schemaShape: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "hidden") {
        schemaShape[field.name] = z.any().optional();
        return;
      }

      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case "email":
          fieldSchema = z.string().email("Please enter a valid email address");
          break;

        case "password":
          fieldSchema = z
            .string()
            .min(
              field.minLength || 6,
              `Password must be at least ${field.minLength || 6} characters`
            )
            .regex(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              "Password must contain uppercase, lowercase, and number"
            );
          break;

        case "number":
          fieldSchema = z.number().or(
            z
              .string()
              .regex(/^-?(0|[1-9]\d*)$/, "Please enter a valid number")
              .transform((val) => parseInt(val, 10))
          );
          if (field.min !== undefined)
            fieldSchema = fieldSchema.pipe(z.number().min(field.min));
          if (field.max !== undefined)
            fieldSchema = fieldSchema.pipe(z.number().max(field.max));
          break;

        // case "decimal":
        //   fieldSchema = z
        //     .string()
        //     .regex(/^\d+(\.\d{0,7})?$/, "Please enter a valid decimal number");
        //   break;
        case "decimal":
          fieldSchema = z
            .union([
              z
                .number()
                .refine((val) => /^\d+(\.\d{0,7})?$/.test(val.toString()), {
                  message: "Please enter a valid decimal number",
                }),
              z
                .string()
                .regex(
                  /^\d+(\.\d{0,7})?$/,
                  "Please enter a valid decimal number"
                ),
            ])
            .transform((val) =>
              typeof val === "string" ? parseFloat(val) : val
            );
          break;

        case "negative-decimal":
          fieldSchema = z
            .union([z.string(), z.number()])
            .transform((val) =>
              val === undefined || val === null ? "" : String(val)
            )
            .refine((val) => /^[-]?\d+(\.\d{0,7})?$/.test(val), {
              message: "Please enter a valid decimal number",
            })
            .optional();
          break;

        case "phone":
          fieldSchema = z
            .string()
            .regex(
              /^[\+]?[1-9][\d]{0,15}$/,
              "Please enter a valid phone number"
            );
          break;

        case "url":
          fieldSchema = z.string().refine((val) => {
            // If empty string, it's valid (will be handled by required check later)
            if (!val || val.trim() === "") {
              return true;
            }
            // If has value, validate URL format
            try {
              new URL(val);
              return true;
            } catch {
              return false;
            }
          }, "Please enter a valid URL");
          break;

        case "time":
          fieldSchema = z
            .string()
            .regex(
              /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
              "Please enter time in HH:MM format"
            );
          break;

        // case "select":
        //   // Simple approach - just use string validation
        //   if (field.required) {
        //     fieldSchema = z
        //       .string()
        //       .min(1, `${field.label || field.name} is required`);
        //   } else {
        //     fieldSchema = z.string().optional();
        //   }

        //   // Add option validation if options exist
        //   if (field.options && field.options.length > 0) {
        //     fieldSchema = fieldSchema.refine((val) => {
        //       // For optional fields, empty is OK
        //       if (!field.required && (!val || val === "")) {
        //         return true;
        //       }

        //       // For required fields or when value is provided, check options
        //       if (val && val !== "") {
        //         return field.options?.some(
        //           (opt) => String(opt.value) === String(val)
        //         );
        //       }

        //       return !field.required; // Only allow empty for optional fields
        //     }, "Please select a valid option");
        //   }
        //   break;

        case "select":
          const selectSchema = z
            .union([z.string(), z.number()])
            .transform((val) => String(val));

          if (field.required) {
            fieldSchema = selectSchema.refine(
              (val) => val.trim() !== "",
              `${field.label || field.name} is required`
            );
          } else {
            fieldSchema = selectSchema.optional();
          }

          // Add option validation if options exist
          if (field.options && field.options.length > 0) {
            fieldSchema = fieldSchema.refine((val) => {
              if (!field.required && (!val || val === "")) {
                return true; // valid if optional and empty
              }

              return field.options?.some(
                (opt) => String(opt.value) === String(val)
              );
            }, "Please select a valid option");
          }
          break;

        // Fix the select case in FormService.createValidationSchema method
        case "select":
          // Allow both string and number values, then convert to string
          if (field.required) {
            fieldSchema = z
              .union([z.string(), z.number()])
              .transform((val) => String(val))
              .refine(
                (val) =>
                  val.length > 0 && val !== "null" && val !== "undefined",
                {
                  message: `${field.label || field.name} is required`,
                }
              );
          } else {
            fieldSchema = z
              .union([z.string(), z.number()])
              .transform((val) => String(val))
              .optional();
          }

          // Add option validation if options exist
          if (field.options && field.options.length > 0) {
            fieldSchema = fieldSchema.refine((val) => {
              // For optional fields, empty is OK
              if (
                !field.required &&
                (!val || val === "" || val === "null" || val === "undefined")
              ) {
                return true;
              }

              // For required fields or when value is provided, check options
              if (val && val !== "" && val !== "null" && val !== "undefined") {
                return field.options?.some(
                  (opt) => String(opt.value) === String(val)
                );
              }

              return !field.required; // Only allow empty for optional fields
            }, "Please select a valid option");
          }
          break;
        case "multi-select":
          fieldSchema = z
            .array(z.union([z.string(), z.number()]))
            .optional();
          break;

        case "checkbox":
          fieldSchema = z.boolean();
          break;

        case "radio":
          if (field.options && field.options.length > 0) {
            // Convert all option values to strings for consistent comparison
            const validValues = field.options.map((opt) => String(opt.value));

            // Ensure we have at least 2 values for z.enum, or use z.literal for single value
            if (validValues.length === 1) {
              fieldSchema = z.literal(validValues[0]);
            } else {
              fieldSchema = z.enum(validValues as [string, ...string[]]);
            }

            // Also accept the original value types (string, number, boolean)
            fieldSchema = fieldSchema.or(
              z
                .union([z.string(), z.number(), z.boolean()])
                .refine(
                  (val) =>
                    field.options?.some(
                      (opt) =>
                        opt.value === val || String(opt.value) === String(val)
                    ),
                  "Please select a valid option"
                )
            );
          } else {
            fieldSchema = z.string();
          }
          break;

        case "switch":
          fieldSchema = z.boolean();
          break;

        case "file":
          fieldSchema = z.any().refine(
            (value) => {
              // If field is not required and no value, it's valid
              if (!field.required && (!value || value === null)) return true;

              // If field is required but no value, it's invalid
              if (field.required && (!value || value === null)) return false;

              // Check if it's a File object (when uploaded via input)
              if (value instanceof File) return true;

              // Check if it's a FileList with files (browser file input)
              if (value instanceof FileList && value.length > 0) return true;

              // Check if it's an array with files
              if (Array.isArray(value) && value.length > 0) return true;

              // For edit mode - allow string URLs or existing file indicators
              if (typeof value === "string" && value.length > 0) return true;

              // If required field has no valid file, it's invalid
              return !field.required;
            },
            field.required ? "Please select a file" : undefined
          );
          break;

        case "range":
          fieldSchema = z
            .number()
            .min(field.min || 0)
            .max(field.max || 100);
          break;

        case "color":
          fieldSchema = z
            .string()
            .regex(/^#[0-9A-F]{6}$/i, "Please enter a valid color");
          break;

        // Add form-array validation - FIXED
        case "form-array":
          try {
            if (field.itemFields && field.itemFields.length > 0) {
              // Create schema for array items recursively
              const itemSchema = this.createValidationSchema(field.itemFields);
              fieldSchema = z.array(itemSchema);

              // Add min/max constraints - FIXED
              if (field.minItems !== undefined && field.minItems > 0) {
                // fieldSchema = fieldSchema.min(field.minItems, `At least ${field.minItems} items required`);
              }
              if (field.maxItems !== undefined) {
                // fieldSchema = fieldSchema.max(field.maxItems, `Maximum ${field.maxItems} items allowed`);
              }
            } else {
              // Fallback for arrays without item fields
              fieldSchema = z.array(z.any());
            }
          } catch (error) {
            console.warn(
              `Error creating form-array schema for ${field.name}:`,
              error
            );
            // Fallback to simple array validation
            fieldSchema = z.array(z.any());
          }
          break;

        case "textarea":
        case "text":
        default:
          // Initialize as ZodString to retain proper typings
          let stringSchema = z.string();

          if (field.pattern) {
            stringSchema = stringSchema.regex(
              new RegExp(field.pattern),
              "Invalid format"
            );
          }
          if (field.minLength) {
            stringSchema = stringSchema.min(
              field.minLength,
              `Minimum ${field.minLength} characters required`
            );
          }
          if (field.maxLength) {
            stringSchema = stringSchema.max(
              field.maxLength,
              `Maximum ${field.maxLength} characters allowed`
            );
          }

          fieldSchema = stringSchema; // Assign to your final variable
          break;
      }

      // Handle required fields - FIXED
      if (field.required) {
        if (field.type === "checkbox") {
          fieldSchema = fieldSchema.refine((val) => val === true, {
            message: `${field.label || field.name} is required`,
          });
        } else if (
          field.type === "multi-select" ||
          field.type === "form-array"
        ) {
          // For arrays, we already handle required in the schema definition above
          // Just make sure it's not optional
        } else {
          fieldSchema = fieldSchema.refine(
            (val) => {
              if (val === null || val === undefined || val === "") return false;
              if (Array.isArray(val) && val.length === 0) return false;
              return true;
            },
            {
              message: `${field.label || field.name} is required`,
            }
          );
        }
      } else {
        // Make optional - but not for required form-arrays
        if (field.type !== "form-array" || !field.required) {
          fieldSchema = fieldSchema.optional();
        }
      }

      // Add custom validation
      if (field.customValidation) {
        fieldSchema = fieldSchema.refine(
          (val) => {
            const result = field.customValidation!(val);
            return typeof result === "string" ? false : result;
          },
          {
            message: `Invalid ${field.label || field.name}`,
          }
        );
      }

      schemaShape[field.name] = fieldSchema;
    });

    return z.object(schemaShape);
  }

  /**
   * Get default values for form fields
   */
  private static getDefaultValues(fields: FormField[]): Record<string, any> {
    const defaultValues: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultValues[field.name] = field.defaultValue;
      } else {
        switch (field.type) {
          case "checkbox":
            defaultValues[field.name] = false;
            break;
          case "multi-select":
          case "form-array":
            defaultValues[field.name] = [];
            break;
          case "switch":
            defaultValues[field.name] = false;
            break;
          case "number":
          case "decimal":
          case "negative-decimal":
          case "range":
            defaultValues[field.name] = field.min || 0;
            break;
          case "color":
            defaultValues[field.name] = "#000000";
            break;
          case "select":
            // Set empty string as default for select fields
            defaultValues[field.name] = "";
            break;
          default:
            defaultValues[field.name] = "";
        }
      }
    });

    return defaultValues;
  }

  /**
   * Create form payload from form data
   */
  static createPayload(
    formData: any,
    fields: FormField[]
  ): Record<string, any> {
    const payload: Record<string, any> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (value === undefined || value === null) {
        return; // Skip undefined/null values
      }

      switch (field.type) {
        case "datepicker":
          if (value instanceof Date) {
            payload[field.name] = format(value, "yyyy-MM-dd");
          } else if (typeof value === "string") {
            const parsed = this.parseDate(value);
            payload[field.name] = parsed ? format(parsed, "yyyy-MM-dd") : value;
          }
          break;

        case "time":
          if (value instanceof Date) {
            payload[field.name] = format(value, "HH:mm:ss");
          } else {
            payload[field.name] = value + ":00"; // Add seconds if not present
          }
          break;

        case "number":
        case "decimal":
        case "negative-decimal":
        case "range":
          payload[field.name] =
            typeof value === "string" ? parseFloat(value) : value;
          break;

        case "checkbox":
        case "switch":
          payload[field.name] = Boolean(value);
          break;

        case "multi-select":
        case "form-array":
          payload[field.name] = Array.isArray(value) ? value : [];
          break;

        case "file":
          // Handle file upload - return file data or file reference
          if (value && value.length > 0) {
            payload[field.name] = field.multiple ? Array.from(value) : value[0];
          }
          break;

        default:
          payload[field.name] = value;
      }
    });

    return payload;
  }

  /**
   * Populate form with existing data
   */
  static populateForm(
    form: UseFormReturn<any>,
    data: any,
    fields: FormField[]
  ): void {
    const formattedData: Record<string, any> = {};

    fields.forEach((field) => {
      const value = data[field.name];

      if (value === undefined || value === null) {
        // Set default values for arrays to prevent undefined issues
        if (field.type === "form-array" || field.type === "multi-select") {
          formattedData[field.name] = [];
        }
        return;
      }

      switch (field.type) {
        case "datepicker":
          if (typeof value === "string") {
            const parsed = this.parseDate(value);
            formattedData[field.name] = format(parsed, "yyyy-MM-dd");
          } else {
            formattedData[field.name] = value;
          }
          break;

        case "time":
          if (typeof value === "string") {
            // Parse time string to Date object
            const [hours, minutes] = value.split(":");
            const timeDate = new Date();
            timeDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            formattedData[field.name] = timeDate;
          } else {
            formattedData[field.name] = value;
          }
          break;

        case "multi-select":
        case "form-array":
          formattedData[field.name] = Array.isArray(value) ? value : [];
          break;

        case "checkbox":
        case "switch":
          formattedData[field.name] = Boolean(value);
          break;

        default:
          formattedData[field.name] = value;
      }
    });

    form.reset(formattedData);
  }

  /**
   * Get visible fields based on conditions
   */
  static getVisibleFields(fields: FormField[], formValues: any): FormField[] {
    return fields.filter((field) => {
      if (field.showWhen) {
        return field.showWhen(formValues);
      }
      return true;
    });
  }

  /**
   * Group fields by group property
   */
  static getGroupedFields(
    fields: FormField[],
    data: any
  ): Record<string, FormField[]> {
    const grouped: Record<string, FormField[]> = { default: [] };

    fields.forEach((field) => {
      const group = field.group || "default";
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(field);
    });

    // Sort fields within groups by groupOrder
    Object.keys(grouped).forEach((groupKey) => {
      grouped[groupKey].sort(
        (a, b) => (a.groupOrder || 0) - (b.groupOrder || 0)
      );
    });

    return grouped;
  }

  /**
   * Get field classes with defaults and overrides
   */
  static getFieldClasses(
    field: FormField,
    globalClasses: FormClasses,
    hasError: boolean,
    isDisabled: boolean
  ): FormFieldClasses {
    const baseClasses: FormFieldClasses = {
      container: globalClasses.fieldContainer,
      label: globalClasses.label,
      input: globalClasses.input,
      div: globalClasses.div,
      textarea: globalClasses.textarea,
      MultiSelectDropdown: globalClasses.select,
      select: globalClasses.select,
      checkbox: globalClasses.checkbox,
      radio: globalClasses.radio,
      file: globalClasses.file,
      error: globalClasses.error,
      helperText: globalClasses.helperText,
      required: globalClasses.required,
      verifyButton: globalClasses.verifyButton,
      helperIcon: globalClasses.helperIcon,
      tooltip: globalClasses.tooltip,
    };

    // Apply field-specific classes
    if (field.classes) {
      Object.assign(baseClasses, field.classes);
    }

    // Apply state classes
    if (hasError) {
      baseClasses.input = `${baseClasses.input} ${globalClasses.invalid}`;
    }

    if (isDisabled) {
      baseClasses.input = `${baseClasses.input} ${globalClasses.disabled}`;
    }

    // Apply size variant
    if (field.size) {
      baseClasses.input = `${baseClasses.input} form-${field.type}-${field.size}`;
    }

    // Apply variant
    if (field.variant) {
      baseClasses.input = `${baseClasses.input} form-${field.type}-${field.variant}`;
    }

    return baseClasses;
  }

  /**
   * Get form validation errors
   */
  static getFieldError(
    form: UseFormReturn<any>,
    fieldName: string
  ): string | undefined {
    const error = form.formState.errors[fieldName];
    if (!error) return undefined;

    return typeof error.message === "string" ? error.message : "Invalid input";
  }

  /**
   * Check if form has any errors
   */
  static hasErrors(form: UseFormReturn<any>): boolean {
    return Object.keys(form.formState.errors).length > 0;
  }

  /**
   * Parse date string to Date object
   */
  private static parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Try parsing with common formats
    const formats = Object.values(this.DATE_FORMATS);

    for (const formatStr of formats) {
      const parsed = parse(dateStr, formatStr, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    }

    // Try native Date parsing as fallback
    const nativeDate = new Date(dateStr);
    return isValid(nativeDate) ? nativeDate : null;
  }

  /**
   * Reset specific fields - ENHANCED for FormArrays
   */
  static resetFields(form: UseFormReturn<any>, fieldNames: string[]): void {
    fieldNames.forEach((fieldName) => {
      // Get the field definition to determine default value
      const currentValue = form.getValues(fieldName);
      if (Array.isArray(currentValue)) {
        // For arrays, reset to empty array
        form.setValue(fieldName, []);
      } else {
        // For other fields, use standard reset
        form.resetField(fieldName);
      }
    });
  }

  /**
   * Clear all form errors
   */
  static clearErrors(form: UseFormReturn<any>): void {
    form.clearErrors();
  }

  /**
   * Trigger validation for specific fields
   */
  static async validateFields(
    form: UseFormReturn<any>,
    fieldNames: string[]
  ): Promise<boolean> {
    const results = await Promise.all(
      fieldNames.map((fieldName) => form.trigger(fieldName))
    );
    return results.every((result) => result);
  }

  static async validateForm(form: UseFormReturn<any>): Promise<boolean> {
    // Trigger validation for all fields and wait for it to complete
    const result = await form.trigger();
    return result;
  }

  /**
   * Enhanced: Get field dependencies
   */
  static getFieldDependencies(fields: FormField[]): Record<string, string[]> {
    const dependencies: Record<string, string[]> = {};

    fields.forEach((field) => {
      if (field.dependsOn) {
        if (!dependencies[field.dependsOn]) {
          dependencies[field.dependsOn] = [];
        }
        dependencies[field.dependsOn].push(field.name);
      }
    });

    return dependencies;
  }

  /**
   * Enhanced: Validate field dependencies
   */
  static validateDependencies(
    fields: FormField[],
    formValues: any
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.dependsOn && field.required) {
        const dependentValue = formValues[field.dependsOn];
        const currentValue = formValues[field.name];

        // If dependent field has value but current field doesn't
        if (dependentValue && !currentValue) {
          errors[field.name] = `${field.label || field.name} is required when ${
            field.dependsOn
          } is provided`;
        }
      }
    });

    return errors;
  }

  /**
   * Enhanced: Get form completion percentage
   */
  static getFormCompletionPercentage(
    fields: FormField[],
    formValues: any
  ): number {
    const visibleFields = this.getVisibleFields(fields, formValues);
    const requiredFields = visibleFields.filter(
      (f) => f.required && f.type !== "hidden"
    );

    if (requiredFields.length === 0) return 100;

    const completedFields = requiredFields.filter((field) => {
      const value = formValues[field.name];

      if (field.type === "checkbox") {
        return value === true;
      }

      if (field.type === "multi-select") {
        return Array.isArray(value) && value.length > 0;
      }

      return value !== undefined && value !== null && value !== "";
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  /**
   * Enhanced: Export form data
   */
  static exportFormData(
    formData: any,
    fields: FormField[],
    format: "json" | "csv" = "json"
  ): string {
    const payload = this.createPayload(formData, fields);

    if (format === "json") {
      return JSON.stringify(payload, null, 2);
    }

    if (format === "csv") {
      const headers = fields.map((f) => f.label || f.name).join(",");
      const values = fields
        .map((f) => {
          const value = payload[f.name];
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value || "";
        })
        .join(",");

      return `${headers}\n${values}`;
    }

    return "";
  }

  /**
   * Enhanced: Import form data
   */
  static importFormData(
    form: UseFormReturn<any>,
    importData: string,
    fields: FormField[],
    format: "json" | "csv" = "json"
  ): boolean {
    try {
      let parsedData: any = {};

      if (format === "json") {
        parsedData = JSON.parse(importData);
      } else if (format === "csv") {
        const lines = importData.split("\n");
        if (lines.length < 2) return false;

        const headers = lines[0].split(",");
        const values = lines[1].split(",");

        headers.forEach((header, index) => {
          const field = fields.find(
            (f) => (f.label || f.name) === header.trim()
          );
          if (field && values[index]) {
            let value = values[index].trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            parsedData[field.name] = value;
          }
        });
      }

      this.populateForm(form, parsedData, fields);
      return true;
    } catch (error) {
      console.error("Failed to import form data:", error);
      return false;
    }
  }

  /**
   * Enhanced: Generate field summary
   */
  static generateFieldSummary(fields: FormField[]): {
    total: number;
    required: number;
    optional: number;
    byType: Record<string, number>;
    withVerification: number;
    withTooltips: number;
  } {
    const summary = {
      total: fields.length,
      required: 0,
      optional: 0,
      byType: {} as Record<string, number>,
      withVerification: 0,
      withTooltips: 0,
    };

    fields.forEach((field) => {
      // Count required vs optional
      if (field.required) {
        summary.required++;
      } else {
        summary.optional++;
      }

      // Count by type
      summary.byType[field.type] = (summary.byType[field.type] || 0) + 1;

      // Count verification enabled
      if (field.showVerifyButton) {
        summary.withVerification++;
      }

      // Count tooltips enabled
      if (field.showHelperTooltip) {
        summary.withTooltips++;
      }
    });

    return summary;
  }
  /**Add commentMore actions
   * Compare original data with edited data and return only the changed fields
   */
  static isProbablyDate(value: any): boolean {
    if (value instanceof Date) return isValid(value);

    if (typeof value === "string") {
      // Try ISO first
      const isoDate = parseISO(value);
      if (isValid(isoDate)) return true;

      // Try known common formats
      const formatsToTry = [
        "yyyy-MM-dd",
        "dd-MM-yyyy",
        "MM/dd/yyyy",
        "dd/MM/yyyy",
        "MMMM d, yyyy",
        "MMM d, yyyy",
        "yyyy/MM/dd",
      ];

      for (const format of formatsToTry) {
        const parsed = parse(value, format, new Date());
        if (isValid(parsed)) return true;
      }

      return false;
    }

    return false;
  }

  static safeParseDate(value: any): Date | null {
    if (value instanceof Date && isValid(value)) return value;

    if (typeof value === "string") {
      const isoDate = parseISO(value);
      if (isValid(isoDate)) return isoDate;

      const formatsToTry = [
        "yyyy-MM-dd",
        "dd-MM-yyyy",
        "MM/dd/yyyy",
        "dd/MM/yyyy",
        "MMMM d, yyyy",
        "MMM d, yyyy",
        "yyyy/MM/dd",
      ];

      for (const format of formatsToTry) {
        const parsed = parse(value, format, new Date());
        if (isValid(parsed)) return parsed;
      }

      return null;
    }

    return null;
  }

  static getUpdatedFields(
    originalData: Record<string, any>,
    editedData: Record<string, any>
  ): Record<string, any> {
    const updatedFields: Record<string, any> = {};

    Object.keys(editedData).forEach((key) => {
      const originalValue = originalData[key];
      const editedValue = editedData[key];

      if (Array.isArray(originalValue) && Array.isArray(editedValue)) {
        if (
          originalValue.length !== editedValue.length ||
          !originalValue.every((val, index) => val === editedValue[index])
        ) {
          updatedFields[key] = editedValue;
        }
      } else if (
        this.isProbablyDate(originalValue) &&
        this.isProbablyDate(editedValue)
      ) {
        const date1 = this.safeParseDate(originalValue);
        const date2 = this.safeParseDate(editedValue);

        console.log("debug dates", originalValue, editedValue);
        console.log("debug parsed dates", date1, date2);

        if (date1 && date2 && !isSameDay(date1, date2)) {
          updatedFields[key] = editedValue;
        }
      } else if (originalValue !== editedValue) {
        if (
          !(
            (originalValue === null ||
              originalValue === undefined ||
              originalValue === "") &&
            (editedValue === null ||
              editedValue === undefined ||
              editedValue === "")
          )
        ) {
          updatedFields[key] = editedValue;
        }
      }
    });

    return updatedFields;
  }
}

export { EnhancedFormService as FormService };
