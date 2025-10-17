import { icons } from "lucide-react";
import { ReactNode } from "react";

export interface TableColumn<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  responsive?: {
    hidden?: string; // e.g., "md:table-cell", "lg:table-cell"
  };
  type?: "text" | "badge" | "custom" | "actions";
  width?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  badgeConfig?: {
    variant?: "default" | "destructive" | "outline" | "secondary";
    getVariant?: (
      value: any,
      row: T
    ) => "default" | "destructive" | "outline" | "secondary";
    getClassName?: (value: any, row: T) => string;
  };
}

export interface TableAction<T = any> {
  label: string;
  icon?: keyof typeof icons | React.ReactElement;
  onClick: (row: T, index: number) => void;
  variant?: "default" | "destructive" | "ghost" | "outline";
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
  separator?: boolean;
}

export interface BulkAction<T = any> {
  label: string;
  onClick: (selectedRows: T[], selectedIds: string[]) => void;
  variant?: "default" | "destructive" | "ghost" | "outline";
  icon?: ReactNode;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;

  // Row configuration
  rowKey: keyof T | ((row: T) => string);
  getRowClassName?: (row: T, index: number) => string;

  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  bulkActions?: BulkAction<T>[];

  // Actions
  actions?: TableAction<T>[];
  actionsType?: "dropdown" | "buttons" | "icons";

  // Pagination
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;

  // Sorting
  sortConfig?: SortConfig;
  onSort?: (field: string, direction: "asc" | "desc") => void;

  // Export
  onExport?: () => void;
  exportLoading?: boolean;

  // Filters (passed from parent)
  filters?: ReactNode;

  // Additional controls
  additionalControls?: ReactNode;

  // Empty state
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}
