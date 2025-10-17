import { cn } from "@shared/lib/utils";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent } from "@shared/ui/card";
import { Checkbox } from "@shared/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { Input } from "@shared/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shared/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shared/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  FileX,
  Filter,
  Loader2,
  MoreHorizontal,
  Search,
  X,
  icons,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { TableColumn, TableProps } from "../types/table";

// Extended TableProps interface
interface ExtendedTableProps<T extends Record<string, any>>
  extends Omit<TableProps<T>, "additionalControls"> {
  searchPlaceholder?: string;
  searchParamName?: string;
  searchDebounceMs?: number;
  onSearch?: (searchTerm: string, paramName: string) => void;
  filterPanel?: React.ReactNode;
  searchValue?: string;
  showFilters?: boolean;
  onSearchValueChange?: (value: string) => void;
  onShowFiltersChange?: (show: boolean) => void;
}
export type LucideIconName = keyof typeof icons;
export function GenericTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  rowKey,
  getRowClassName,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  bulkActions = [],
  actions = [],
  actionsType = "dropdown",
  pagination,
  onPageChange,
  sortConfig,
  onSort,
  onExport,
  exportLoading = false,
  filters,
  emptyMessage = "No data available",
  emptyIcon,
  searchPlaceholder = "Search...",
  searchParamName = "search",
  searchDebounceMs = 500,
  onSearch,
  filterPanel,
  searchValue: externalSearchValue,
  showFilters: externalShowFilters,
  onSearchValueChange,
  onShowFiltersChange,
}: ExtendedTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!onSearch) return;

    const timeoutId = setTimeout(() => {

      onSearch(searchValue, searchParamName);
    }, searchDebounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearch, searchParamName, searchDebounceMs]);

  const getRowId = (row: T): string => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    return String(row[rowKey]);
  };

  const isAllSelected = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return false;
    return data.every((row) => selectedRows.includes(getRowId(row)));
  }, [data, selectedRows, rowKey]);

  const isIndeterminate = useMemo(() => {
    return selectedRows.length > 0 && !isAllSelected;
  }, [selectedRows.length, isAllSelected]);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (isAllSelected) {
      const currentPageIds = data.map(getRowId);
      const newSelection = selectedRows.filter(
        (id) => !currentPageIds.includes(id)
      );
      onSelectionChange(newSelection);
    } else {
      const currentPageIds = data.map(getRowId);
      const newSelection = [...new Set([...selectedRows, ...currentPageIds])];
      onSelectionChange(newSelection);
    }
  };

  const handleRowSelect = (rowId: string) => {
    if (!onSelectionChange) return;

    if (selectedRows.includes(rowId)) {
      onSelectionChange(selectedRows.filter((id) => id !== rowId));
    } else {
      onSelectionChange([...selectedRows, rowId]);
    }
  };

  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.field === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    onSort(columnKey, direction);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  const renderSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return null;

    if (sortConfig?.field === column.key) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const renderCell = (column: TableColumn<T>, row: T, index: number) => {
    // Handle multiple keys for a single column
    let value;
    if (Array.isArray(column.key)) {
      // For multiple keys, we'll pass the first key's value to the render function
      // The render function can access all keys from the row object
      value = row[column.key[0]];
    } else {
      value = row[column.key];
    }

    if (column.render) {
      return column.render(value, row, index);
    }

    // Handle missing keys - show N/A if key doesn't exist in row
    if (!Array.isArray(column.key) && !row.hasOwnProperty(column.key)) {
      return "N/A";
    }

    switch (column.type) {
      case "badge":
        const badgeConfig = column.badgeConfig || {};
        let variant = badgeConfig.variant || "default";
        let className = "";

        if (badgeConfig.getVariant) {
          variant = badgeConfig.getVariant(value, row);
        }
        if (badgeConfig.getClassName) {
          className = badgeConfig.getClassName(value, row);
        }

        return (
          <Badge variant={variant} className={className}>
            {value ?? "N/A"}
          </Badge>
        );
      case "custom":
        return value ?? "N/A";
      default:
        return value ?? "N/A";
    }
  };

  const renderActions = (row: T, index: number) => {
    if (actions.length === 0) return null;

    const visibleActions = actions.filter((action) => !action.hidden?.(row));

    if (actionsType === "buttons") {
      return (
        <div className="flex items-center gap-2">
          {visibleActions.map((action, actionIndex) => (
            <Button
              key={actionIndex}
              variant={action.variant || "ghost"}
              size="sm"
              onClick={() => action.onClick(row, index)}
              disabled={action.disabled?.(row)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      );
    }
    if (actionsType === "icons") {
      return (
        <div className="flex items-center gap-2">
          {visibleActions.map((action, actionIndex) => {
            if (!action.icon) return null;

            return (
              <button
                key={actionIndex}
                onClick={() => action.onClick(row, index)}
                disabled={action.disabled?.(row)}
                className="p-1 rounded hover:bg-muted/60 disabled:opacity-50 disabled:pointer-events-none"
                title={action.label}
              >
                {typeof action.icon === "string"
                  ? React.createElement(icons[action.icon], {
                      className: "w-4 h-4",
                    })
                  : action.icon}
              </button>
            );
          })}
        </div>
      );
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {visibleActions.map((action, actionIndex) => (
            <React.Fragment key={actionIndex}>
              {action.separator && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => action.onClick(row, index)}
                disabled={action.disabled?.(row)}
                className={
                  action.variant === "destructive" ? "text-red-600" : ""
                }
              >
                {action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderPaginationItems = () => {
    const items = [];
    const { currentPage, totalPages } = pagination;

    // Always show first page
    if (currentPage > 2) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <span className="px-3 py-2">...</span>
        </PaginationItem>
      );
    }

    // Show current page and neighbors
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <span className="px-3 py-2">...</span>
        </PaginationItem>
      );
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const hasActions = actions.length > 0;
  const displayColumns = columns.filter((col) => col.type !== "actions");
  const hasFiltersOrSearch = filters || filterPanel || onSearch;

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      {hasFiltersOrSearch && (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            {/* Search Input */}
            {onSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  className="pl-8 pr-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Controls Section */}
            <div className="flex flex-wrap gap-2">
              {/* Inline Filters */}
              {filters}

              {/* Bulk Actions */}
              {bulkActions.length > 0 && selectedRows.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedRows.length} selected
                  </span>
                  {bulkActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => {
                        const selectedData = data.filter((row) =>
                          selectedRows.includes(getRowId(row))
                        );
                        action.onClick(selectedData, selectedRows);
                      }}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Filter Panel Toggle */}
              {filterPanel && (
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              )}

              {/* Export Button */}
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export CSV
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && filterPanel && (
            <Card>
              <CardContent className="pt-6">{filterPanel}</CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected}
                      // indeterminate={isIndeterminate}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                {displayColumns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      column.responsive?.hidden &&
                        `hidden ${column.responsive.hidden}`,
                      column.width,
                      column.sortable && onSort && "cursor-pointer select-none"
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {renderSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
                {hasActions && (
                  <TableHead className="text-center">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      displayColumns.length +
                      (selectable ? 1 : 0) +
                      (hasActions ? 1 : 0)
                    }
                    className="h-32 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      displayColumns.length +
                      (selectable ? 1 : 0) +
                      (hasActions ? 1 : 0)
                    }
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      {emptyIcon || (
                        <FileX className="h-8 w-8 text-muted-foreground mb-2" />
                      )}
                      <p className="text-muted-foreground">{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((row, index) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedRows.includes(rowId);

                  return (
                    <TableRow
                      key={rowId}
                      className={cn(
                        getRowClassName?.(row, index),
                        isSelected && "bg-muted/50"
                      )}
                    >
                      {selectable && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleRowSelect(rowId)}
                          />
                        </TableCell>
                      )}
                      {displayColumns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={cn(
                            column.responsive?.hidden &&
                              `hidden ${column.responsive.hidden}`,
                            column.width
                          )}
                        >
                          {renderCell(column, row, index)}
                        </TableCell>
                      ))}
                      {hasActions && (
                        <TableCell className="text-center">
                          {renderActions(row, index)}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && data?.length > 0 && pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <strong>
              {pagination.startItem}-{pagination.endItem}
            </strong>{" "}
            of <strong>{pagination.totalItems}</strong> results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    pagination.currentPage > 1 &&
                    onPageChange(pagination.currentPage - 1)
                  }
                  className={
                    pagination.currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    pagination.currentPage < pagination.totalPages &&
                    onPageChange(pagination.currentPage + 1)
                  }
                  className={
                    pagination.currentPage >= pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
export default GenericTable;