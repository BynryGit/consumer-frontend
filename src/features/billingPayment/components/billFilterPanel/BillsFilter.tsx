import React from 'react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@shared/ui/dropdown-menu';
import { ChevronDown, Filter } from 'lucide-react';

interface BillsFilterProps {
  filterType: string | null;
  onFilterChange: (type: string | null) => void;
  availableTypes?: string[];
}

export const BillsFilter: React.FC<BillsFilterProps> = ({ 
  filterType, 
  onFilterChange,
  availableTypes = ['Electric', 'Water', 'Gas']
}) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter by Type</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onFilterChange(null)}>
            All Types
          </DropdownMenuItem>
          {availableTypes.map(type => (
            <DropdownMenuItem 
              key={type} 
              onClick={() => onFilterChange(type)}
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {filterType && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Type: {filterType}
          <button
            onClick={() => onFilterChange(null)}
            className="ml-1 hover:text-destructive"
            title="Clear filter"
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );
};