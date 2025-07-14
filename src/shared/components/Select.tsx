import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@shared/ui/select";

type Option = {
  label: string;
  value: any;
};

type GenericSelectProps = {
  value: any;
  onValueChange: (value: any) => void;
  options: Option[];
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
};

export const GenericSelect: React.FC<GenericSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  loading = false,
  disabled = false,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger loading={loading} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent loading={loading}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
