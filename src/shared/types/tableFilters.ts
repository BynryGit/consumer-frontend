
export interface FilterOption {
    label: string;
    value: string;
  }
  
  export interface FilterConfig {
    key: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange';
    placeholder?: string;
    options?: FilterOption[];
    defaultValue?: any;
  }
  
  export interface FilterValues {
    [key: string]: any;
  }
  
  export interface TableFiltersProps {
    filters: FilterConfig[];
    values: FilterValues;
    onChange: (key: string, value: any) => void;
    onClear: () => void;
    loading?: boolean;
  }
  