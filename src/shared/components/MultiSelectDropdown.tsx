import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface MultiSelectDropdownProps {
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
  maxSelection?: number;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options = [],
  onChange,
  placeholder = "Select options...",
  disabled = false,
  className = "",
  maxDisplayItems = 3,
  searchable = true,
  clearable = true,
  closeOnSelect = false,
  maxSelection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setSearchTerm("");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const toggleOption = (value: string | number) => {
    let newValues = [...selectedValues];
    const index = newValues.indexOf(value);

    if (index > -1) {
      newValues.splice(index, 1);
    } else {
      if (maxSelection && newValues.length >= maxSelection) return;
      newValues.push(value);
    }

    setSelectedValues(newValues);
    onChange?.(newValues);

    if (closeOnSelect) {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    onChange?.([]);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map((opt) => opt.label).join(", ");
    }

    return `${selectedOptions
      .slice(0, maxDisplayItems)
      .map((opt) => opt.label)
      .join(", ")} +${selectedOptions.length - maxDisplayItems} more`;
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full border rounded px-3 py-2 bg-white cursor-pointer ${
        disabled ? "bg-gray-100 text-gray-400" : "text-gray-900"
      } ${className}`}
    >
      <div className="flex items-center justify-between" onClick={handleToggle}>
        <span>{getDisplayText()}</span>
        <div className="flex items-center gap-1">
          {clearable && selectedValues.length > 0 && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded text-gray-500"
              title="Clear"
            >
              ×
            </button>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 left-0 right-0 mt-1 border rounded bg-white shadow max-h-60 overflow-auto">
          {searchable && (
            <div className="p-2 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-2 py-1 border rounded"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div>
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No options</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={String(option.value)}
                    onClick={() => !option.disabled && toggleOption(option.value)}
                    className={`flex items-center px-3 py-2 cursor-pointer ${
                      option.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    } ${isSelected ? "bg-blue-50 text-blue-900" : ""}`}
                    title={option.description}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mr-2"
                    />
                    {option.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
