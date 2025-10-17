import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@shared/services/FormServices';
import { useMemo, useCallback } from 'react';

// API Response Interface (based on your current structure)
export interface ApiCustomField {
  id?: string;
  key?: string;
  label: string;
  fieldType: string;
  required?: boolean;
  helperText?: string;
  tooltipText?: string;
  step?: number;
  min?: number;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

// Configuration Interfaces
export interface CustomFieldClasses {
  container?: string;
  label?: string;
  input?: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
}

export type FieldNamingStrategy = 
  | 'key'           // Use field.key first
  | 'id'            // Use field.id first  
  | 'label'         // Use field.label first
  | 'key-fallback'  // key -> id -> label -> index (current default)
  | ((field: ApiCustomField, index: number) => string);

export type DefaultValueStrategy = 
  | 'typed'         // Type-based defaults (numbers: 0, booleans: false, etc.)
  | 'empty'         // Empty strings/arrays for all
  | ((field: ApiCustomField) => any);

export interface CustomFieldConfig {
  namingStrategy?: FieldNamingStrategy;
  classes?: CustomFieldClasses;
  defaultValueStrategy?: DefaultValueStrategy;
  gridColumns?: number;
  responsiveColumns?: { sm?: number; md?: number; lg?: number };
  fullWidth?: boolean;
  enableTooltips?: boolean;
  fieldNameCleaning?: boolean; // Clean special characters from field names
}

// Default Configuration
export const DEFAULT_CUSTOM_FIELD_CONFIG: Required<CustomFieldConfig> = {
  namingStrategy: 'key-fallback',
  classes: {
    container: "w-full mb-6",
    label: "block text-sm font-medium text-gray-700 mb-2",
    input: "w-full h-12 px-4 border border-gray-300 rounded-lg bg-white text-gray-500",
    error: "text-red-600 text-sm mt-1",
    helperText: "text-xs text-gray-500 mt-1",
    tooltip: "inline-block ml-1 text-gray-400 hover:text-gray-600 cursor-help"
  },
  defaultValueStrategy: 'typed',
  gridColumns: 1,
  responsiveColumns: { sm: 1, md: 2, lg: 3 },
  fullWidth: true,
  enableTooltips: true,
  fieldNameCleaning: true
};

/**
 * Maps API fieldType to FormField type
 */
export const mapFieldType = (fieldType: string): FormField['type'] => {
  switch (fieldType.toLowerCase()) {
    case 'text':
    case 'string':
      return 'text';
    case 'number':
    case 'integer':
      return 'number';
    case 'decimal':
    case 'float':
      return 'decimal';
    case 'email':
      return 'email';
    case 'password':
      return 'password';
    case 'textarea':
      return 'textarea';
    case 'select':
    case 'dropdown':
      return 'select';
    case 'multiselect':
      return 'multi-select';
    case 'checkbox':
      return 'checkbox';
    case 'radio':
      return 'radio';
    case 'date':
    case 'datepicker':
      return 'datepicker';
    case 'time':
      return 'time';
    case 'file':
      return 'file';
    case 'phone':
      return 'phone';
    case 'url':
      return 'url';
    default:
      return 'text';
  }
};

/**
 * Generates field name based on strategy
 */
export const generateFieldName = (
  field: ApiCustomField, 
  index: number, 
  strategy: FieldNamingStrategy,
  cleanName: boolean = true
): string => {
  let fieldName: string;

  if (typeof strategy === 'function') {
    fieldName = strategy(field, index);
  } else {
    switch (strategy) {
      case 'key':
        fieldName = field.key || `field_${index}`;
        break;
      case 'id':
        fieldName = field.id || `field_${index}`;
        break;
      case 'label':
        fieldName = field.label || `field_${index}`;
        break;
      case 'key-fallback':
      default:
        fieldName = field.key || field.id || field.label || `field_${index}`;
        break;
    }
  }

  // Ensure fieldName is a string and not empty
  if (typeof fieldName !== 'string' || !fieldName.trim()) {
    fieldName = `field_${index}`;
  }

  // Clean field name if enabled
  if (cleanName) {
    fieldName = fieldName.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  return fieldName;
};

/**
 * Generates default value based on field type and strategy
 */
export const generateDefaultValue = (
  field: ApiCustomField, 
  strategy: DefaultValueStrategy
): any => {
  if (typeof strategy === 'function') {
    return strategy(field);
  }

  if (strategy === 'empty') {
    return field.fieldType.toLowerCase() === 'multiselect' ? [] : '';
  }

  // 'typed' strategy
  switch (field.fieldType.toLowerCase()) {
    case 'checkbox':
      return false;
    case 'number':
    case 'integer':
    case 'decimal':
    case 'float':
      return field.min || 0;
    case 'multiselect':
      return [];
    default:
      return '';
  }
};

/**
 * Generates FormField array from API custom fields
 */
export const generateFormFields = (
  apiFields: ApiCustomField[] | undefined | null,
  config: CustomFieldConfig = {}
): FormField[] => {
  if (!apiFields || !Array.isArray(apiFields)) {
    return [];
  }

  const finalConfig = { ...DEFAULT_CUSTOM_FIELD_CONFIG, ...config };

  return apiFields
    .map((field, index) => {
      const fieldName = generateFieldName(
        field, 
        index, 
        finalConfig.namingStrategy,
        finalConfig.fieldNameCleaning
      );

      const formField: FormField = {
        name: fieldName,
        label: field.label || `Field ${index + 1}`,
        type: mapFieldType(field.fieldType),
        required: field.required || false,
        helperText: field.helperText,
        showHelperTooltip: finalConfig.enableTooltips && !!field.tooltipText,
        tooltipText: field.tooltipText,
        step: field.step,
        min: field.min,
        rows: field.rows,
        options: field.options?.map(opt => ({
          label: opt.label,
          value: opt.value
        })),
        fullWidth: finalConfig.fullWidth,
        classes: finalConfig.classes,
        disabled: field.disabled || false,
      };

      return formField;
    })
    .filter(field => field.name && field.name.length > 0);
};

/**
 * Generates default values object for form initialization
 */
export const generateDefaultValues = (
  apiFields: ApiCustomField[] | undefined | null,
  config: CustomFieldConfig = {}
): Record<string, any> => {
  if (!apiFields || !Array.isArray(apiFields)) {
    return {};
  }

  const finalConfig = { ...DEFAULT_CUSTOM_FIELD_CONFIG, ...config };
  const defaultValues: Record<string, any> = {};

  apiFields.forEach((field, index) => {
    const fieldName = generateFieldName(
      field, 
      index, 
      finalConfig.namingStrategy,
      finalConfig.fieldNameCleaning
    );
    
    if (fieldName && fieldName.length > 0) {
      defaultValues[fieldName] = generateDefaultValue(field, finalConfig.defaultValueStrategy);
    }
  });

  return defaultValues;
};

/**
 * React Hook Form integration helper
 */
export const useCustomFieldsForm = (
  apiFields: ApiCustomField[] | undefined | null,
  form: UseFormReturn<any>,
  config: CustomFieldConfig = {}
) => {
  // Merge config with defaults once
  const mergedConfig = useMemo(() => ({ 
    ...DEFAULT_CUSTOM_FIELD_CONFIG, 
    ...config 
  }), [config]);
  
  // Generate form fields - only regenerate when apiFields or config actually change
  const formFields = useMemo(() => {
    if (!apiFields || !Array.isArray(apiFields)) {
      return [];
    }
    return generateFormFields(apiFields, mergedConfig);
  }, [apiFields, mergedConfig]);
  
  // Generate default values
  const defaultValues = useMemo(() => {
    if (!apiFields || !Array.isArray(apiFields)) {
      return {};
    }
    return generateDefaultValues(apiFields, mergedConfig);
  }, [apiFields, mergedConfig]);

  // Stable reset function
  const resetFormWithDefaults = useCallback(() => {
    if (Object.keys(defaultValues).length > 0) {
      form.reset(defaultValues);
    }
  }, [form, defaultValues]);

  // Simple boolean check
  const hasFields = formFields.length > 0;

  return {
    formFields,
    defaultValues,
    resetFormWithDefaults,
    hasFields
  };
};
/**
 * Field filtering and manipulation utilities
 */
export const CustomFieldUtils = {
  /**
   * Filter fields by step
   */
  filterByStep: (fields: ApiCustomField[], step: number): ApiCustomField[] => {
    return fields.filter(field => field.step === step);
  },

  /**
   * Filter required fields
   */
  filterRequired: (fields: ApiCustomField[]): ApiCustomField[] => {
    return fields.filter(field => field.required);
  },

  /**
   * Group fields by step
   */
  groupByStep: (fields: ApiCustomField[]): Record<number, ApiCustomField[]> => {
    return fields.reduce((groups, field) => {
      const step = field.step || 0;
      if (!groups[step]) {
        groups[step] = [];
      }
      groups[step].push(field);
      return groups;
    }, {} as Record<number, ApiCustomField[]>);
  },

  /**
   * Validate field structure
   */
  validateField: (field: ApiCustomField): boolean => {
    return !!(field && field.label && field.fieldType);
  },

  /**
   * Clean and validate fields array
   */
  cleanFields: (fields: ApiCustomField[]): ApiCustomField[] => {
    return fields.filter(CustomFieldUtils.validateField);
  }
};

/**
 * Form validation helpers
 */
export const CustomFieldValidation = {
  /**
   * Generate basic validation rules for a field
   */
  generateValidationRules: (field: ApiCustomField) => {
    const rules: any = {};

    if (field.required) {
      rules.required = `${field.label} is required`;
    }

    switch (field.fieldType.toLowerCase()) {
      case 'email':
        rules.pattern = {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        };
        break;
      case 'number':
      case 'integer':
        if (field.min !== undefined) {
          rules.min = {
            value: field.min,
            message: `Minimum value is ${field.min}`
          };
        }
        break;
      case 'url':
        rules.pattern = {
          value: /^https?:\/\/.+/,
          message: 'Invalid URL format'
        };
        break;
    }

    return rules;
  },

  /**
   * Generate validation schema object for react-hook-form
   */
  generateValidationSchema: (apiFields: ApiCustomField[], config: CustomFieldConfig = {}) => {
    const finalConfig = { ...DEFAULT_CUSTOM_FIELD_CONFIG, ...config };
    const schema: Record<string, any> = {};

    apiFields.forEach((field, index) => {
      const fieldName = generateFieldName(
        field, 
        index, 
        finalConfig.namingStrategy,
        finalConfig.fieldNameCleaning
      );
      
      if (fieldName && fieldName.length > 0) {
        schema[fieldName] = CustomFieldValidation.generateValidationRules(field);
      }
    });

    return schema;
  }
};