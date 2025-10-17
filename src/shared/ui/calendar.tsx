import { cn } from "@shared/lib/utils";
import * as React from "react";

type CalendarProps = {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: ((date: Date) => boolean) | boolean;
  selected?: Date;
  mode?: 'single' | 'range';
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  min?: string;
  max?: string;
  required?: boolean;
  name?: string;
  id?: string;
  placeholder?: string;
  initialFocus?: boolean;
};

function Calendar({
  className,
  label,
  value,
  onChange,
  disabled,
  selected,
  mode = 'single',
  onSelect,
  initialFocus,
  ...props
}: CalendarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialFocus]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    onChange?.(date);
    onSelect?.(date);
  }, [onChange, onSelect]);

  const isDisabled = React.useCallback((date: Date) => {
    if (typeof disabled === 'boolean') return disabled;
    if (typeof disabled === 'function') return disabled(date);
    return false;
  }, [disabled]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="date"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={value?.toISOString().split('T')[0] || ''}
        onChange={handleChange}
        disabled={typeof disabled === 'boolean' ? disabled : false}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
