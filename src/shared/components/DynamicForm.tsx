import React, { useState, useRef, useCallback, useMemo } from "react";
import { UseFormReturn, Controller, useFieldArray } from "react-hook-form";
import { Switch } from "@shared/ui/switch";
import {
  HelpCircle,
  Check,
  X,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import {
  FormField,
  FormConfig,
  FormService,
  defaultFormClasses,
} from "../services/FormServices";

interface DynamicFormProps {
  fields: FormField[];
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void | Promise<void>;
  onReset?: () => void;
  loading?: boolean;
  config?: Partial<FormConfig>;
  className?: string;
  onFieldChange?: (fieldName: string, value: any) => void;
  style?: React.CSSProperties;
  renderCustomFooter?: () => React.ReactNode;
  gridColumns?: number;
  responsiveColumns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  onVerificationStatusChange?: (
    fieldName: string,
    status: FormField["verificationStatus"]
  ) => void;
}

// Optimized Tooltip Component with React.memo
interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

const Tooltip = React.memo<TooltipProps>(
  ({ content, position = "top", children, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Memoize position and arrow classes
    const { positionClass, arrowClass } = useMemo(() => {
      const positionClasses = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
      };

      const arrowClasses = {
        top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800",
        bottom:
          "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800",
        left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800",
        right:
          "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800",
      };

      return {
        positionClass: positionClasses[position],
        arrowClass: arrowClasses[position],
      };
    }, [position]);

    // Memoize event handlers
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);
    const handleClick = useCallback(
      () => setIsVisible(!isVisible),
      [isVisible]
    );

    const arrowStyle = useMemo(
      () => ({
        borderTopColor: position === "top" ? "#ffffff" : "transparent",
        borderBottomColor: position === "bottom" ? "#ffffff" : "transparent",
        borderLeftColor: position === "left" ? "#ffffff" : "transparent",
        borderRightColor: position === "right" ? "#ffffff" : "transparent",
      }),
      [position]
    );

    return (
      <div className={`relative inline-block ${className}`}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {children}
        </div>
        {isVisible && (
          <div
            className={`absolute z-50 px-3 py-2 text-sm text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 whitespace-normal ${positionClass}`}
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              minWidth: "280px",
              maxWidth: "320px",
              lineHeight: "1.4",
            }}
          >
            {content}
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClass}`}
              style={arrowStyle}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

// Optimized Multi-Select Dropdown Component with React.memo
interface MultiSelectDropdownProps {
  name: string;
  control: any;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
    description?: string;
  }>;
  onChange?: (values: (string | number)[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayItems?: number;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  error?: string;
}

interface MultiSelectDropdownProps {
  name: string;
  control: any;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
    description?: string;
  }>;
  onChange?: (values: (string | number)[]) => void;
  onSearchTermChange?: (searchTerm: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxDisplayItems?: number;
  searchable?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  error?: string;
  maxSelection?: number;
}

const MultiSelectDropdown = React.memo<MultiSelectDropdownProps>(
  ({
    name,
    control,
    options = [],
    placeholder = "Select options...",
    disabled = false,
    className = "",
    maxDisplayItems = 3,
    searchable = true,
    clearable = true,
    closeOnSelect = false,
    onChange,
    onSearchTermChange,
    maxSelection,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = useMemo(() => {
      if (!searchable || !searchTerm) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [options, searchTerm, searchable]);

    const baseClasses = useMemo(
      () =>
        `
    ${className} relative w-full min-h-[40px] border border-gray-300 rounded-md
    bg-white text-sm text-gray-900 
    focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
    ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
  `.trim(),
      [className, disabled]
    );

    const dropdownClasses = useMemo(
      () =>
        `
    absolute top-full left-0 right-0 z-50 mt-1
    bg-white border border-gray-300 rounded-md shadow-lg
    max-h-60 overflow-y-auto
  `.trim(),
      []
    );

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }, []);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (typeof onSearchTermChange === "function") {
          onSearchTermChange(term);
        }
      },
      [onSearchTermChange]
    );

    const handleSearchClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    React.useEffect(() => {
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, handleClickOutside]);

    const getDisplayText = useCallback(
      (selectedValues: (string | number)[]) => {
        if (!selectedValues || selectedValues.length === 0) {
          return placeholder;
        }

        const selectedOptions = options.filter((option) =>
          selectedValues.includes(option.value)
        );

        if (selectedOptions.length <= maxDisplayItems) {
          return selectedOptions.map((option) => option.label).join(", ");
        }

        return `${selectedOptions
          .slice(0, maxDisplayItems)
          .map((option) => option.label)
          .join(", ")} +${selectedOptions.length - maxDisplayItems} more`;
      },
      [options, maxDisplayItems, placeholder]
    );

    const toggleOption = useCallback(
      (
        optionValue: string | number,
        currentValues: (string | number)[],
        onChange: (values: (string | number)[]) => void
      ) => {
        let newValues;

        const isSelected = currentValues.includes(optionValue);

        if (isSelected) {
          newValues = currentValues.filter((value) => value !== optionValue);
        } else {
          if (maxSelection && maxSelection === 1) {
            newValues = [optionValue];
          } else if (maxSelection && currentValues.length >= maxSelection) {
            newValues = [...currentValues]; // Don't add more
          } else {
            newValues = [...currentValues, optionValue];
          }
        }

        onChange(newValues);
        if (typeof onChange === "function") {
          onChange(newValues);
        }

        if (closeOnSelect) {
          setIsOpen(false);
          setSearchTerm("");
        }
      },
      [maxSelection, closeOnSelect]
    );

    const clearAll = useCallback(
      (onChange: (values: (string | number)[]) => void) => {
        onChange([]);
        if (typeof onChange === "function") {
          onChange([]);
        }
      },
      []
    );

    const handleDropdownToggle = useCallback(() => {
      if (!disabled) setIsOpen(!isOpen);
    }, [disabled, isOpen]);

    const handleClearClick = useCallback(
      (
        e: React.MouseEvent,
        onChange: (values: (string | number)[]) => void
      ) => {
        e.stopPropagation();
        clearAll(onChange);
      },
      [clearAll]
    );

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { value = [], onChange } }) => (
          <div ref={dropdownRef} className={baseClasses}>
            <div
              className="flex items-center justify-between px-3 py-2 min-h-[36px]"
              onClick={handleDropdownToggle}
            >
              <span
                className={`flex-1 ${
                  !value || value.length === 0
                    ? "text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {getDisplayText(value)}
              </span>

              <div className="flex items-center gap-1">
                {clearable && value && value.length > 0 && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleClearClick(e, onChange)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                    title="Clear all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                <div
                  className={`transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {isOpen && !disabled && (
              <div className={dropdownClasses}>
                {searchable && (
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      onClick={handleSearchClick}
                    />
                  </div>
                )}

                <div className="py-1">
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {searchTerm ? "No options found" : "No options available"}
                    </div>
                  ) : (
                    filteredOptions.map((option) => {
                      const isSelected = value.includes(option.value);
                      const isDisabled = option.disabled;

                      return (
                        <div
                          key={String(option.value)}
                          onClick={() =>
                            !isDisabled &&
                            toggleOption(option.value, value, onChange)
                          }
                          className={`
                          flex items-center px-3 py-2 text-sm cursor-pointer
                          ${
                            isDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-900 hover:bg-gray-100"
                          }
                          ${isSelected ? "bg-blue-50 text-blue-900" : ""}
                        `.trim()}
                          title={option.description}
                        >
                          <div className="flex items-center flex-1">
                            <div
                              className={`
                            w-4 h-4 mr-3 border-2 rounded flex items-center justify-center
                            ${
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "border-gray-300"
                            }
                            ${isDisabled ? "border-gray-200 bg-gray-100" : ""}
                          `.trim()}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="font-medium">{option.label}</div>
                              {option.description && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {value && value.length > maxDisplayItems && (
              <div className="px-3 py-1 text-xs text-gray-500 border-t border-gray-200">
                {value.length} items selected
              </div>
            )}
          </div>
        )}
      />
    );
  }
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";

// FormArray Component - FIXED AND PROPERLY INTEGRATED
interface FormArrayProps {
  name: string;
  form: UseFormReturn<any>;
  itemFields: FormField[];
  label?: string;
  helperText?: string;
  minItems?: number;
  maxItems?: number;
  className?: string;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  showReorderButtons?: boolean;
  addButtonText?: string;
  emptyMessage?: string;
}

const FormArrayComponent = React.memo<FormArrayProps>(
  ({
    name,
    form,
    itemFields,
    label,
    helperText,
    minItems = 1,
    maxItems,
    className = "",
    showAddButton = true,
    showRemoveButton = true,
    showReorderButtons = false,
    addButtonText = "Add Item",
    emptyMessage = "No items added yet",
  }) => {
    console.log("Rendering FormArrayComponent:", name);
    const { fields, append, remove, move } = useFieldArray({
      control: form.control,
      name,
    });
    console.log(`🔄 FieldArray registered for: ${name}`, fields);


    // Create default item based on itemFields
    const createDefaultItem = useCallback(() => {
      const defaultItem: any = {};
      itemFields.forEach((field) => {
        switch (field.type) {
          case "number":
          case "decimal":
            defaultItem[field.name] = field.min || 0;
            break;
          case "checkbox":
            defaultItem[field.name] = false;
            break;
          case "multi-select":
          case "form-array":
            defaultItem[field.name] = [];
            break;
          default:
            defaultItem[field.name] = field.defaultValue || "";
        }
      });
      return defaultItem;
    }, [itemFields]);

    // Handle add item
    const handleAddItem = useCallback(() => {
      if (!maxItems || fields.length < maxItems) {
        append(createDefaultItem());
      }
    }, [append, createDefaultItem, fields.length, maxItems]);

    // Handle remove item
    const handleRemoveItem = useCallback(
      (index: number) => {
        if (fields.length > minItems) {
          remove(index);
        }
      },
      [remove, fields.length, minItems]
    );

    // Handle move item
    const handleMoveItem = useCallback(
      (from: number, to: number) => {
        move(from, to);
      },
      [move]
    );

    // Memoize grid classes
    const gridClasses = useMemo(() => {
      const columnCount = itemFields.length;
      if (columnCount <= 3) {
        return `grid grid-cols-${columnCount} gap-4`;
      } else if (columnCount <= 6) {
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(
          columnCount,
          3
        )} gap-4`;
      } else {
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
      }
    }, [itemFields.length]);

    // Render individual field
    const renderField = useCallback(
      (field: FormField, itemIndex: number) => {
        const fieldName = `${name}.${itemIndex}.${field.name}`;
        const error = FormService.getFieldError(form, fieldName);

        return (
          <div key={field.name} className="space-y-1">
            {field.label && (
              <label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            <Controller
              name={fieldName}
              control={form.control}
              defaultValue={field.defaultValue || ""}
              render={({ field: controllerField }) => {
                const commonProps = {
                  ...controllerField,
                  id: fieldName,
                  className: `w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? "border-red-500" : ""
                  }`,
                  placeholder: field.placeholder,
                  disabled: field.disabled,
                  readOnly: field.readonly,
                };

                switch (field.type) {
                  case "text":
                  case "email":
                  case "password":
                  case "phone":
                  case "url":
                    return (
                      <div className="relative">
                        {field.prefix && (
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {field.prefix}
                          </span>
                        )}
                        <input
                          {...commonProps}
                          type={field.type}
                          className={
                            field.prefix
                              ? `${commonProps.className} pl-8`
                              : commonProps.className
                          }
                          minLength={field.minLength}
                          maxLength={field.maxLength}
                        />
                        {field.suffix && (
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {field.suffix}
                          </span>
                        )}
                      </div>
                    );

                  case "number":
                  case "decimal":
                  case "negative-decimal":
                    return (
                      <div className="relative">
                        {field.prefix && (
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            {field.prefix}
                          </span>
                        )}
                        <input
                          {...commonProps}
                          type="number"
                          className={
                            field.prefix
                              ? `${commonProps.className} pl-8`
                              : commonProps.className
                          }
                          min={field.min}
                          max={field.max}
                          // step={
                          //   field.step || (field.type === "decimal" ? 0.01 : 1)
                          // }
                        />
                      </div>
                    );

                  case "datepicker":
                    return <input {...commonProps} type="date" />;

                  case "time":
                    return <input {...commonProps} type="time" />;

                  case "select":
                    return (
                      <select {...commonProps}>
                        <option value="">
                          {field.placeholder ||
                            `-- Select ${field.label || field.name} --`}
                        </option>
                        {field.options?.map((option) => (
                          <option
                            key={String(option.value)}
                            value={String(option.value)}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    );

                  case "textarea":
                    return (
                      <textarea
                        {...commonProps}
                        rows={field.rows || 3}
                        cols={field.cols}
                      />
                    );

                  case "checkbox":
                    return (
                      <div className="flex items-center">
                        <input
                          {...controllerField}
                          type="checkbox"
                          id={fieldName}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          checked={controllerField.value || false}
                        />
                        <label
                          htmlFor={fieldName}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {field.label}
                        </label>
                      </div>
                    );

                  default:
                    return <input {...commonProps} type="text" />;
                }
              }}
            />

            {error && <span className="text-red-500 text-sm">{error}</span>}

            {field.helperText && !error && (
              <span className="text-gray-500 text-sm">{field.helperText}</span>
            )}
          </div>
        );
      },
      [name, form]
    );

    // Check if we can add more items
    const canAddItem = !maxItems || fields.length < maxItems;
    const canRemoveItem = fields.length > minItems;

    return (
      <div className={`space-y-4 ${className}`}>
        {/* Header */}
        {label && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{label}</h3>
            {showAddButton && canAddItem && (
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {addButtonText}
              </button>
            )}
          </div>
        )}

        {helperText && <p className="text-sm text-gray-600">{helperText}</p>}

        {/* Items */}
        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>{emptyMessage}</p>
            {showAddButton && canAddItem && (
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
              >
                <Plus className="w-4 h-4" />
                {addButtonText}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Reorder handle */}
                  {showReorderButtons && fields.length > 1 && (
                    <div className="flex flex-col gap-1 mt-8">
                      <button
                        type="button"
                        onClick={() =>
                          index > 0 && handleMoveItem(index, index - 1)
                        }
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Move up"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Fields */}
                  <div className={`flex-1 ${gridClasses}`}>
                    {itemFields.map((itemField) =>
                      renderField(itemField, index)
                    )}
                  </div>

                  {/* Remove button */}
                  {showRemoveButton && canRemoveItem && (
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Item number */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Item #{index + 1}
                  </span>
                  {maxItems && (
                    <span className="text-xs text-gray-500">
                      {fields.length} of {maxItems} items
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add button at bottom */}
        {fields.length > 0 && showAddButton && canAddItem && (
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 text-sm font-medium text-blue-600 bg-blue-50 border-2 border-dashed border-blue-200 rounded-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            {addButtonText}
          </button>
        )}
      </div>
    );
  }
);

FormArrayComponent.displayName = "FormArray";
MultiSelectDropdown.displayName = "MultiSelectDropdown";

// Memoized Field Component
interface FieldRendererProps {
  field: FormField;
  form: UseFormReturn<any>;
  formClasses: any;
  loading: boolean;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  verificationStatuses: Record<string, FormField["verificationStatus"]>;
  onFieldChange?: (fieldName: string, value: any) => void;
  onVerificationStatusChange?: (
    fieldName: string,
    status: FormField["verificationStatus"]
  ) => void;
}

const FieldRenderer = React.memo<FieldRendererProps>(
  ({
    field,
    form,
    formClasses,
    loading,
    focusedField,
    setFocusedField,
    verificationStatuses,
    onFieldChange,
    onVerificationStatusChange,
  }) => {
    const error = FormService.getFieldError(form, field.name);
    const isDisabled = loading || field.disabled;
    const isFocused = focusedField === field.name;

    // Memoize field classes
    const fieldClasses = useMemo(
      () =>
        FormService.getFieldClasses(field, formClasses, !!error, isDisabled),
      [field, formClasses, error, isDisabled]
    );

    const currentVerificationStatus =
      verificationStatuses[field.name] ||
      field.verificationStatus ||
      "unverified";
    const currentValue = form.watch(field.name);

    // Memoize container classes
    const containerClasses = useMemo(
      () =>
        [
          fieldClasses.container,
          field.className,
          field.fullWidth ? "form-field-full-width" : "",
          field.inline ? "form-field-inline" : "",
          isFocused ? formClasses.focused : "",
          error ? formClasses.invalid : formClasses.valid,
        ]
          .filter(Boolean)
          .join(" "),
      [
        fieldClasses.container,
        field.className,
        field.fullWidth,
        field.inline,
        isFocused,
        formClasses.focused,
        formClasses.invalid,
        formClasses.valid,
        error,
      ]
    );

    // Memoize common props
    const commonProps = useMemo(
      () => ({
        ...form.register(field.name),
        id: field.name,
        defaultValue: field.defaultValue,
        disabled: isDisabled,
        readOnly: field.readonly,
        autoComplete: field.autoComplete,
        autoFocus: field.autoFocus,
        tabIndex: field.tabIndex,
        style: { width: field.width, ...field.style },
      }),
      [form, field, isDisabled]
    );

    // Memoize event handlers
    const handleFocus = useCallback(
      () => setFocusedField(field.name),
      [setFocusedField, field.name]
    );
    const handleBlur = useCallback(
      () => setFocusedField(null),
      [setFocusedField]
    );

    const handleFieldChange = useCallback(
      (value: any) => {
        form.setValue(field.name, value);
        onFieldChange?.(field.name, value);
      },
      [form, field.name, onFieldChange]
    );

    const handleVerify = useCallback(async () => {
      const currentValue = form.getValues(field.name);
      await FormService.handleFieldVerification(
        field,
        currentValue,
        onVerificationStatusChange
      );
    }, [field, form, onVerificationStatusChange]);

    const renderVerifyButton = useCallback(() => {
      if (!field.showVerifyButton) return null;

      const isVerifyDisabled = FormService.isVerifyButtonDisabled(
        { ...field, verificationStatus: currentVerificationStatus },
        currentValue
      );

      const buttonText = FormService.getVerifyButtonText({
        ...field,
        verificationStatus: currentVerificationStatus,
      });

      const buttonClasses = useMemo(() => {
        let baseClasses =
          "h-10 px-3 py-2 text-sm transition-all duration-200 flex items-center gap-1 rounded-r";
        if (isVerifyDisabled) {
          baseClasses += " bg-blue-400 text-white cursor-not-allowed";
        } else {
          switch (currentVerificationStatus) {
            case "verified":
              baseClasses +=
                " bg-green-100 text-green-700 border border-green-200";
              break;
            case "failed":
              baseClasses +=
                " bg-red-100 text-red-700 border border-red-200 hover:bg-red-200";
              break;
            case "verifying":
              baseClasses +=
                " bg-blue-100 text-blue-700 border border-blue-200";
              break;
            default:
              baseClasses += " bg-blue-600 text-white hover:bg-blue-700";
          }
        }
        return baseClasses;
      }, [isVerifyDisabled, currentVerificationStatus]);

      const renderButtonIcon = () => {
        switch (currentVerificationStatus) {
          case "verifying":
            return <Loader2 className="w-3 h-3 animate-spin" />;
          case "verified":
            return <Check className="w-3 h-3" />;
          case "failed":
            return <X className="w-3 h-3" />;
          default:
            return null;
        }
      };

      return (
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifyDisabled}
          className={buttonClasses}
        >
          {renderButtonIcon()}
          {buttonText}
        </button>
      );
    }, [
      field.showVerifyButton,
      currentVerificationStatus,
      currentValue,
      handleVerify,
    ]);

    const renderLabel = useCallback(() => {
      if (!field.label && field.type !== "checkbox" && field.type !== "radio")
        return null;

      return (
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor={field.name} className={fieldClasses.label}>
            {field.icon && (
              <span className="form-field-icon">{field.icon}</span>
            )}
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.showHelperTooltip && field.tooltipText && (
            <Tooltip
              content={field.tooltipText}
              position={field.tooltipPosition || "top"}
              className="flex items-center text-black font-semibold"
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          )}
        </div>
      );
    }, [field, fieldClasses.label]);

    const renderInput = useCallback(() => {
      if (field.customRender) {
        return field.customRender(field, form, error);
      }

      const inputProps = {
        ...commonProps,
        onFocus: handleFocus,
        onBlur: handleBlur,
      };

      switch (field.type) {
        case "hidden":
          return <input {...inputProps} type="hidden" />;

        case "text":
        case "email":
        case "password":
        case "phone":
        case "url":
          return (
            <div className="flex items-center">
              <div className="form-input-wrapper flex-1">
                {field.prefix && (
                  <span className="form-input-prefix">{field.prefix}</span>
                )}
                <input
                  {...inputProps}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={fieldClasses.input}
                  minLength={field.minLength}
                  maxLength={field.maxLength}
                />
                {field.suffix && (
                  <span className="form-input-suffix">{field.suffix}</span>
                )}
              </div>
              {renderVerifyButton()}
            </div>
          );

        case "textarea":
          return (
            <div className="flex items-start">
              <textarea
                {...inputProps}
                placeholder={field.placeholder}
                className={`${fieldClasses.textarea} flex-1`}
                rows={field.rows || 4}
                cols={field.cols}
                minLength={field.minLength}
                maxLength={field.maxLength}
              />
              {renderVerifyButton()}
            </div>
          );

        case "number":
        case "decimal":
        case "negative-decimal":
          return (
            <div className="flex items-center">
              <input
                {...inputProps}
                type="number"
                placeholder={field.placeholder}
                className={`${fieldClasses.input} flex-1`}
                min={field.min}
                max={field.max}
                step={field.step || (field.type === "decimal" ? 0.01 : 1)}
              />
              {renderVerifyButton()}
            </div>
          );

        case "range":
          return (
            <div className="form-range-wrapper">
              <input
                {...inputProps}
                type="range"
                className={fieldClasses.input}
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 1}
              />
              <span className="form-range-value">{currentValue}</span>
            </div>
          );

        case "color":
          return (
            <input
              {...inputProps}
              type="color"
              className={fieldClasses.input}
            />
          );

        case "datepicker":
          return (
            <input {...inputProps} type="date" className={fieldClasses.input} />
          );

        case "time":
          return (
            <input {...inputProps} type="time" className={fieldClasses.input} />
          );

        case "select":
          return (
            <select
              {...inputProps}
              className={fieldClasses.select}
              onChange={(e) => handleFieldChange(e.target.value)}
            >
              <option value="">
                {field.placeholder ||
                  `-- Select ${field.label || field.name} --`}
              </option>
              {field.options?.map((option, index) => (
                <option
                  // ✅ FIX: Use index + value combination for unique keys
                  key={`${field.name}-${String(option.value)}-${index}`}
                  value={String(option.value)}
                  disabled={option.disabled}
                  title={option.description}
                >
                  {option.label}
                </option>
              ))}
            </select>
          );

        case "multi-select":
          return (
            <MultiSelectDropdown
              name={field.name}
              control={form.control}
              options={(field.options as any) || []}
              placeholder={
                field.placeholder || `Select ${field.label || field.name}...`
              }
              disabled={isDisabled}
              onSearchTermChange={(term) => {
                field.onSearchChange(term);
              }}
              maxSelection={field.maxSelection}
              onChange={(values) => handleFieldChange(values)}
              className={fieldClasses.select}
              searchable={field.searchable !== false}
              clearable={field.clearable !== false}
              maxDisplayItems={field.maxDisplayItems || 3}
              closeOnSelect={field.closeOnSelect || false}
              error={error}
            />
          );

        case "radio":
          return (
            <div className="form-radio-group flex gap-3">
              {field.options?.map((option) => (
                <label key={String(option.value)} className="form-radio-option">
                  <input
                    {...form.register(field.name)}
                    type="radio"
                    value={String(option.value)}
                    disabled={isDisabled || option.disabled}
                    className={fieldClasses.radio}
                  />
                  <span className="form-radio-label pl-1">{option.label}</span>
                  {option.description && (
                    <span className="form-radio-description">
                      {option.description}
                    </span>
                  )}
                </label>
              ))}
            </div>
          );

        case "checkbox":
          return (
            <label className="form-checkbox-wrapper">
              <input
                {...inputProps}
                type="checkbox"
                className={fieldClasses.checkbox}
              />
              <span className="form-checkbox-label">
                {field.label}
                {field.required && (
                  <span className={fieldClasses.required}>*</span>
                )}
              </span>
            </label>
          );

        case "switch":
          return (
            <Controller
              name={field.name}
              control={form.control}
              render={({ field: { value, onChange } }) => {
                const handleSwitchChange = useCallback(
                  (checked: boolean) => {
                    onChange(checked);
                    onFieldChange?.(field.name, checked);
                    field.onChange?.(checked);
                  },
                  [onChange, onFieldChange, field]
                );

                return (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {field.label}
                        {field.required && (
                          <span className={fieldClasses.required}>*</span>
                        )}
                      </div>
                      {field.helperText && (
                        <div className="text-sm text-gray-500 mt-1">
                          {field.helperText}
                        </div>
                      )}
                    </div>
                    <Switch
                      id={field.name}
                      checked={value || false}
                      disabled={isDisabled}
                      onCheckedChange={handleSwitchChange}
                    />
                  </div>
                );
              }}
            />
          );

        case "file":
          return (
            <input
              {...inputProps}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              className={fieldClasses.file}
            />
          );

        case "form-array":
          console.log("Rendering FormArray for field:", field.name);
          return (
            <FormArrayComponent
              name={field.name}
              form={form}
              itemFields={field.itemFields || []}
              label={field.label}
              helperText={field.helperText}
              minItems={field.minItems}
              maxItems={field.maxItems}
              className={field.className}
              showAddButton={field.showAddButton}
              showRemoveButton={field.showRemoveButton}
              showReorderButtons={field.showReorderButtons}
              addButtonText={field.addButtonText}
              emptyMessage={field.emptyMessage}
            />
          );

        default:
          return null;
      }
    }, [
      field,
      commonProps,
      handleFocus,
      handleBlur,
      fieldClasses,
      error,
      form,
      isDisabled,
      currentValue,
      handleFieldChange,
      renderVerifyButton,
      onFieldChange,
    ]);

    const renderError = useCallback(() => {
      if (!error) return null;
      return (
        <span className={fieldClasses.error} role="alert">
          {error}
        </span>
      );
    }, [error, fieldClasses.error]);

    const renderHelperText = useCallback(() => {
      if (
        !field.helperText ||
        field.type === "switch" ||
        field.type === "form-array"
      )
        return null;
      return (
        <span className={fieldClasses.helperText}>{field.helperText}</span>
      );
    }, [field.helperText, field.type, fieldClasses.helperText]);

    if (field.type === "hidden") {
      return renderInput();
    }

    return (
      <div className={`${containerClasses} w-full`} style={field.style}>
        {field.type !== "checkbox" &&
          field.type !== "switch" &&
          field.type !== "form-array" &&
          renderLabel()}
        {renderInput()}
        {renderError()}
        {renderHelperText()}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for optimal re-rendering
    return (
      prevProps.field === nextProps.field &&
      prevProps.loading === nextProps.loading &&
      prevProps.focusedField === nextProps.focusedField &&
      prevProps.verificationStatuses[prevProps.field.name] ===
        nextProps.verificationStatuses[nextProps.field.name] &&
      FormService.getFieldError(prevProps.form, prevProps.field.name) ===
        FormService.getFieldError(nextProps.form, nextProps.field.name) &&
      prevProps.form.watch(prevProps.field.name) ===
        nextProps.form.watch(nextProps.field.name)
    );
  }
);

FieldRenderer.displayName = "FieldRenderer";

// Main DynamicForm Component
export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  form,
  onSubmit,
  onReset,
  loading = false,
  config = {},
  onFieldChange,
  className = "",
  style = {},
  renderCustomFooter,
  gridColumns = 1,
  responsiveColumns,
  onVerificationStatusChange,
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [verificationStatuses, setVerificationStatuses] = useState<
    Record<string, FormField["verificationStatus"]>
  >({});

  // Single form watch - optimization to prevent multiple subscriptions
  const formValues = form.watch();
  const formErrors = form.formState.errors;

  // Memoize expensive calculations
  const visibleFields = useMemo(
    () => FormService.getVisibleFields(fields, formValues),
    [fields, formValues]
  );

  const groupedFields = useMemo(
    () => FormService.getGroupedFields(visibleFields, formValues),
    [visibleFields, formValues]
  );

  // Merge default classes with config classes - memoized
  const formClasses = useMemo(
    () => ({ ...defaultFormClasses, ...config.classes }),
    [config.classes]
  );

  // Memoize grid column classes
  const gridColumnClasses = useMemo(() => {
    let gridClasses = [];
    if (gridColumns > 1) {
      gridClasses.push(`grid grid-cols-${gridColumns}`);
    }

    if (responsiveColumns) {
      if (responsiveColumns.sm)
        gridClasses.push(`sm:grid-cols-${responsiveColumns.sm}`);
      if (responsiveColumns.md)
        gridClasses.push(`md:grid-cols-${responsiveColumns.md}`);
      if (responsiveColumns.lg)
        gridClasses.push(`lg:grid-cols-${responsiveColumns.lg}`);
      if (responsiveColumns.xl)
        gridClasses.push(`xl:grid-cols-${responsiveColumns.xl}`);
    }

    if (gridColumns > 1 || responsiveColumns) {
      gridClasses.push("gap-4");
    }

    return gridClasses.join(" ");
  }, [gridColumns, responsiveColumns]);

  // Memoize layout classes
  const layoutClasses = useMemo(() => {
    const baseClass = formClasses.form;
    const layoutClass = config.layout ? `form-layout-${config.layout}` : "";
    const spacingClass = config.spacing ? `form-spacing-${config.spacing}` : "";
    const columnsClass = config.columns ? `form-columns-${config.columns}` : "";

    return [baseClass, layoutClass, spacingClass, columnsClass, className]
      .filter(Boolean)
      .join(" ");
  }, [
    formClasses.form,
    config.layout,
    config.spacing,
    config.columns,
    className,
  ]);

  // Memoize form watch subscription effect
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && onFieldChange) {
        onFieldChange(name, value[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onFieldChange]);

  // Memoize verification status change handler
  const handleVerificationStatusChange = useCallback(
    (fieldName: string, status: FormField["verificationStatus"]) => {
      setVerificationStatuses((prev) => ({
        ...prev,
        [fieldName]: status,
      }));

      onVerificationStatusChange?.(fieldName, status);
    },
    [onVerificationStatusChange]
  );

  // Memoize submit handler
  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        const payload = FormService.createPayload
          ? FormService.createPayload(data, fields)
          : data;

        await onSubmit(payload);

        if (config.resetOnSubmit) {
          form.reset();
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [onSubmit, fields, config.resetOnSubmit, form]
  );

  // Memoize reset handler
  const handleReset = useCallback(() => {
    form.reset();
    setVerificationStatuses({});
    onReset?.();
  }, [form, onReset]);

  // Memoize field renderer
  const renderField = useCallback(
    (field: FormField) => (
      <FieldRenderer
        key={field.name}
        field={field}
        form={form}
        formClasses={formClasses}
        loading={loading}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
        verificationStatuses={verificationStatuses}
        onFieldChange={onFieldChange}
        onVerificationStatusChange={handleVerificationStatusChange}
      />
    ),
    [
      form,
      formClasses,
      loading,
      focusedField,
      verificationStatuses,
      onFieldChange,
      handleVerificationStatusChange,
    ]
  );

  // Memoize field group renderer
  const renderFieldGroup = useCallback(
    (groupName: string, groupFields: FormField[]) => {
      if (groupName === "default") {
        return (
          <div key={groupName} className={gridColumnClasses}>
            {groupFields.map(renderField)}
          </div>
        );
      }

      return (
        <div key={groupName} className={formClasses.fieldGroup}>
          <h3 className="form-group-title mb-4 text-lg font-semibold text-gray-900 pb-2">
            {groupName}
          </h3>
          <div className={`form-group-fields ${gridColumnClasses}`}>
            {groupFields.map(renderField)}
          </div>
        </div>
      );
    },
    [gridColumnClasses, renderField, formClasses.fieldGroup]
  );

  // Memoize progress calculation and rendering
  const progressData = useMemo(() => {
    if (!config.showProgress) return null;

    const totalFields = fields.filter((f) => f.type !== "hidden").length;
    const filledFields = fields.filter((f) => {
      const value = formValues[f.name];
      return value !== undefined && value !== null && value !== "";
    }).length;

    const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;

    return { progress, filledFields, totalFields };
  }, [config.showProgress, fields, formValues]);

  const renderProgress = useCallback(() => {
    if (!progressData) return null;

    const { progress, filledFields, totalFields } = progressData;

    return (
      <div className="form-progress mb-6">
        <div className="form-progress-bar bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="form-progress-fill bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="form-progress-text text-sm text-gray-600">
          {Math.round(progress)}% Complete ({filledFields}/{totalFields})
        </span>
      </div>
    );
  }, [progressData]);

  // Memoize form validation state
  const hasErrors = useMemo(
    () => FormService.hasErrors(form),
    [form, formErrors]
  );

  // Memoize actions renderer
  const renderActions = useCallback(
    () => (
      <div
        className={`${formClasses.buttonContainer} flex gap-3 pt-6 border-t border-gray-200`}
      >
        {config.showResetButton && (
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className={`${formClasses.button} ${formClasses.resetButton} px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50`}
          >
            {config.resetButtonText || "Reset"}
          </button>
        )}

        {config.showSubmitButton !== false && (
          <button
            type="submit"
            disabled={loading || hasErrors}
            className={`${formClasses.button} ${formClasses.submitButton} ${
              loading ? formClasses.loading : ""
            } px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2`}
          >
            {loading && (
              <span className="form-button-spinner animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {loading ? "Submitting..." : config.submitButtonText || "Submit"}
          </button>
        )}
      </div>
    ),
    [
      formClasses,
      config.showResetButton,
      config.showSubmitButton,
      config.resetButtonText,
      config.submitButtonText,
      handleReset,
      loading,
      hasErrors,
    ]
  );

  // Memoize grouped field entries for stable references
  const groupedFieldEntries = useMemo(
    () => Object.entries(groupedFields),
    [groupedFields]
  );

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={layoutClasses}
      style={style}
      noValidate
    >
      {renderProgress()}

      <div className="form-fields space-y-6">
        {groupedFieldEntries.map(([groupName, groupFields]) =>
          renderFieldGroup(groupName, groupFields)
        )}
      </div>

      {/* Use custom footer if provided, otherwise use default actions */}
      {renderCustomFooter ? renderCustomFooter() : renderActions()}
    </form>
  );
};
