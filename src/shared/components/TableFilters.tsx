import React from 'react';
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/ui/popover";
import { Calendar } from "@shared/ui/calendar";
import { Badge } from "@shared/ui/badge";
import { CalendarIcon, X, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@shared/lib/utils";
import { FilterConfig, TableFiltersProps } from '@shared/types/tableFilters';

export function TableFilters({
  filters,
  values,
  onChange,
  onClear,
  loading = false
}: TableFiltersProps) {
  const hasActiveFilters = Object.values(values).some(value => 
    value !== undefined && value !== null && value !== '' && 
    !(Array.isArray(value) && value.length === 0)
  );

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            className="max-w-sm"
          />
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(val) => onChange(filter.key, val)}
          >
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All {filter.label}</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="max-w-sm justify-start">
                <Filter className="mr-2 h-4 w-4" />
                {selectedValues.length === 0 
                  ? filter.placeholder || `Select ${filter.label.toLowerCase()}`
                  : `${selectedValues.length} selected`
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <div className="p-4 space-y-2">
                <div className="font-medium">{filter.label}</div>
                {filter.options?.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onChange(filter.key, [...selectedValues, option.value]);
                        } else {
                          onChange(filter.key, selectedValues.filter(v => v !== option.value));
                        }
                      }}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "max-w-sm justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : filter.placeholder || "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(filter.key, date?.toISOString())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            {filter.label}
          </label>
          {renderFilter(filter)}
        </div>
      ))}
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClear}
          size="sm"
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      )}
      
      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(values).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            const filter = filters.find(f => f.key === key);
            if (!filter) return null;
            
            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = `${value.length} selected`;
            } else if (filter.type === 'date') {
              displayValue = format(new Date(value), "MMM dd, yyyy");
            } else if (filter.options) {
              const option = filter.options.find(o => o.value === value);
              displayValue = option?.label || value;
            }
            
            return (
              <Badge key={key} variant="secondary" className="text-xs">
                {filter.label}: {displayValue}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs"
                  onClick={() => onChange(key, Array.isArray(value) ? [] : '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}