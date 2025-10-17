import React, { useState, useEffect } from 'react';

// Type definitions
interface Option {
  label: string;
  value: string | number;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface NumberRange {
  min?: string | number;
  max?: string | number;
}

type FilterValue = string | string[] | DateRange | NumberRange;

interface BaseFilterConfig {
  key: string;
  label: string;
  placeholder?: string;
  defaultValue?: FilterValue;
}

interface DropdownConfig extends BaseFilterConfig {
  type: 'dropdown';
  options?: (Option | string)[];
  useHook?: () => Promise<(Option | string)[]>;
}

interface MultiSelectConfig extends BaseFilterConfig {
  type: 'multiselect';
  options?: (Option | string)[];
  useHook?: () => Promise<(Option | string)[]>;
}

interface TextConfig extends BaseFilterConfig {
  type: 'text';
}

interface DateRangeConfig extends BaseFilterConfig {
  type: 'daterange';
}

interface NumberRangeConfig extends BaseFilterConfig {
  type: 'numberrange';
  min?: number;
  max?: number;
}

type FilterConfig = DropdownConfig | MultiSelectConfig | TextConfig | DateRangeConfig | NumberRangeConfig;

interface FilterProps {
  filterConfig: FilterConfig[];
  onFilterChange?: (filters: Record<string, FilterValue>) => void;
  initialValues?: Record<string, FilterValue>;
  className?: string;
}

interface FilterFieldProps {
  config: FilterConfig;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

interface DropdownFilterProps {
  label: string;
  options?: (Option | string)[];
  useHook?: () => Promise<(Option | string)[]>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface MultiSelectFilterProps {
  label: string;
  options?: (Option | string)[];
  useHook?: () => Promise<(Option | string)[]>;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

interface TextFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface DateRangeFilterProps {
  label: string;
  value: DateRange;
  onChange: (value: DateRange) => void;
}

interface NumberRangeFilterProps {
  label: string;
  value: NumberRange;
  onChange: (value: NumberRange) => void;
  min?: number;
  max?: number;
}

// Main Filter Component
const Filter: React.FC<FilterProps> = ({ 
  filterConfig, 
  onFilterChange, 
  initialValues = {},
  className = '' 
}) => {
  const [filters, setFilters] = useState<Record<string, FilterValue>>(initialValues);

  // Handle filter value changes
  const handleFilterChange = (key: string, value: FilterValue) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Real-time callback to parent component
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters: Record<string, FilterValue> = {};
    filterConfig.forEach(config => {
      resetFilters[config.key] = config.defaultValue || '';
    });
    setFilters(resetFilters);
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 mb-5 shadow-sm ${className}`}>
      <div className="flex flex-wrap gap-4 items-end">
        {filterConfig.map((config) => (
          <FilterField
            key={config.key}
            config={config}
            value={filters[config.key] || config.defaultValue || getDefaultValue(config.type)}
            onChange={(value) => handleFilterChange(config.key, value)}
          />
        ))}
        
        {/* Reset Button */}
        <div className="flex flex-col min-w-[120px]">
          <button 
            type="button" 
            className="px-5 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200 transition-all duration-200 h-fit"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get default values
const getDefaultValue = (type: string): FilterValue => {
  switch (type) {
    case 'multiselect':
      return [];
    case 'daterange':
      return { startDate: '', endDate: '' };
    case 'numberrange':
      return { min: '', max: '' };
    default:
      return '';
  }
};

// Individual Filter Field Component
const FilterField: React.FC<FilterFieldProps> = ({ config, value, onChange }) => {
  const { type, label, placeholder, ...fieldProps } = config;

  switch (type) {
    case 'dropdown':
      return (
        <DropdownFilter 
          {...fieldProps}
          label={label}
          value={value as string}
          onChange={onChange as (value: string) => void}
          placeholder={placeholder}
        />
      );
    
    case 'multiselect':
      return (
        <MultiSelectFilter 
          {...fieldProps}
          label={label}
          value={value as string[]}
          onChange={onChange as (value: string[]) => void}
          placeholder={placeholder}
        />
      );
    
    case 'text':
      return (
        <TextFilter 
          {...fieldProps}
          label={label}
          value={value as string}
          onChange={onChange as (value: string) => void}
          placeholder={placeholder}
        />
      );
    
    case 'daterange':
      return (
        <DateRangeFilter 
          {...fieldProps}
          label={label}
          value={value as DateRange}
          onChange={onChange as (value: DateRange) => void}
        />
      );
    
    case 'numberrange':
      return (
        <NumberRangeFilter 
          {...fieldProps}
          label={label}
          value={value as NumberRange}
          onChange={onChange as (value: NumberRange) => void}
        />
      );
    
    default:
      return null;
  }
};

// Dropdown Filter Component
const DropdownFilter: React.FC<DropdownFilterProps> = ({ 
  label, 
  options = [], 
  useHook, 
  value, 
  onChange, 
  placeholder, 
  ...props 
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<(Option | string)[]>(options);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useHook && typeof useHook === 'function') {
      setLoading(true);
      const fetchData = async () => {
        try {
          const data = await useHook();
          setDropdownOptions(data || []);
        } catch (error) {
          console.error('Error fetching dropdown options:', error);
          setDropdownOptions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (options.length > 0) {
      setDropdownOptions(options);
    }
  }, [useHook, options]);

  return (
    <div className="flex flex-col min-w-[150px] flex-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
        disabled={loading}
        {...props}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {dropdownOptions.map((option, index) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;
          return (
            <option key={index} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {loading && <span className="text-xs text-gray-500 mt-1">Loading...</span>}
    </div>
  );
};

// Multi-Select Filter Component
const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({ 
  label, 
  options = [], 
  useHook, 
  value, 
  onChange, 
  placeholder, 
  ...props 
}) => {
  const [dropdownOptions, setDropdownOptions] = useState<(Option | string)[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useHook && typeof useHook === 'function') {
      setLoading(true);
      const fetchData = async () => {
        try {
          const data = await useHook();
          setDropdownOptions(data || []);
        } catch (error) {
          console.error('Error fetching options:', error);
          setDropdownOptions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (options.length > 0) {
      setDropdownOptions(options);
    }
  }, [useHook, options]);

  const handleOptionToggle = (optionValue: string | number) => {
    const stringValue = String(optionValue);
    const newValue = value.includes(stringValue)
      ? value.filter(v => v !== stringValue)
      : [...value, stringValue];
    onChange(newValue);
  };

  return (
    <div className="flex flex-col min-w-[150px] flex-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          className="flex justify-between items-center w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
        >
          <span className="truncate">
            {value.length > 0 ? `${value.length} selected` : placeholder || `Select ${label}`}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg max-h-48 overflow-y-auto z-50">
            {dropdownOptions.map((option, index) => {
              const optionValue = typeof option === 'object' ? option.value : option;
              const optionLabel = typeof option === 'object' ? option.label : option;
              return (
                <label key={index} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150">
                  <input
                    type="checkbox"
                    checked={value.includes(String(optionValue))}
                    onChange={() => handleOptionToggle(optionValue)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{optionLabel}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Text Filter Component
const TextFilter: React.FC<TextFilterProps> = ({ label, value, onChange, placeholder, ...props }) => {
  return (
    <div className="flex flex-col min-w-[150px] flex-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label}`}
        className="px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
        {...props}
      />
    </div>
  );
};

// Date Range Filter Component
const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ label, value, onChange, ...props }) => {
  const handleDateChange = (field: 'startDate' | 'endDate', date: string) => {
    const newValue = { ...value, [field]: date };
    onChange(newValue);
  };

  return (
    <div className="flex flex-col min-w-[250px] flex-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value.startDate || ''}
          onChange={(e) => handleDateChange('startDate', e.target.value)}
          className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          {...props}
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">to</span>
        <input
          type="date"
          value={value.endDate || ''}
          onChange={(e) => handleDateChange('endDate', e.target.value)}
          className="flex-1 min-w-[120px] px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          {...props}
        />
      </div>
    </div>
  );
};

// Number Range Filter Component
const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({ label, value, onChange, min, max, ...props }) => {
  const handleNumberChange = (field: 'min' | 'max', number: string) => {
    const newValue = { ...value, [field]: number };
    onChange(newValue);
  };

  return (
    <div className="flex flex-col min-w-[200px] flex-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value.min || ''}
          onChange={(e) => handleNumberChange('min', e.target.value)}
          placeholder="Min"
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          min={min}
          max={max}
          {...props}
        />
        <span className="text-sm text-gray-500 whitespace-nowrap">to</span>
        <input
          type="number"
          value={value.max || ''}
          onChange={(e) => handleNumberChange('max', e.target.value)}
          placeholder="Max"
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          min={min}
          max={max}
          {...props}
        />
      </div>
    </div>
  );
};

export default Filter;