import React, { useEffect, useState } from "react";
import {
  Table as BaseTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@shared/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@shared/ui/pagination";
import { Tooltip } from "@shared/ui/tooltip";
import { cn } from "@shared/lib/utils";

type Header = {
  Label: string;
  FieldName: string;
  type?: string;
  statusType?: "status" | "priority"; // Specify the type for custom styling
  textColor?: string; // NEW: Custom text color for this column
  render?: (value: any, row: any) => React.ReactNode; // NEW: Custom render function
  icons?: { key: string; title: string; icon: React.ReactNode }[];
};

type Props = {
  headers: Header[];
  data: any[];
  onIconClick?: (key: string, row: any) => void;
  showPagination?: boolean;
  currentPage?: number;
  totalItems?: number;
  pageSize?: number;
  nextPage?: any;
  previousPage?: any;
  isSelectable?: boolean;
  onPageChange?: (page: number) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  // NEW: Custom styling functions
  getStatusColor?: (status: string, type?: "status" | "priority") => string;
  getPriorityColor?: (priority: string) => string;
};

export const CustomTable: React.FC<Props> = ({
  headers,
  data,
  onIconClick,
  showPagination = false,
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  isSelectable = false,
  onPageChange,
  onRowSelect,
  getStatusColor: customGetStatusColor,
  getPriorityColor: customGetPriorityColor,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const getPageRange = (current: number, total: number) => {
    const delta = 3;
    const range: (number | string)[] = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (left > 2) range.unshift("...");
    if (right < total - 1) range.push("...");

    range.unshift(1);
    if (total > 1) range.push(total);

    return range.filter((v, i, arr) => arr[i] !== arr[i - 1]);
  };

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const allSelected = data.length > 0 && selectedRows.size === data.length;

  useEffect(() => {
    const selectedData = Array.from(selectedRows).map((i) => data[i]);
    onRowSelect?.(selectedData);
  }, [selectedRows, data, onRowSelect]);

  const toggleSelectAll = () => {
    setSelectedRows(
      allSelected ? new Set() : new Set(data.map((_, idx) => idx))
    );
  };

  const toggleRow = (index: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  // Enhanced status color function
  const getStatusColorClass = (
    status: string,
    type?: "status" | "priority"
  ) => {
    // Use custom functions if provided
    if (type === "priority" && customGetPriorityColor) {
      return customGetPriorityColor(status);
    }
    if (customGetStatusColor) {
      return customGetStatusColor(status, type);
    }

    // Fallback to default styling
    return getDefaultStatusColor(status, type);
  };

  // Default status color function (your existing logic)
  const getDefaultStatusColor = (
    status: string,
    type?: "status" | "priority"
  ) => {
    const value = status?.toLowerCase();

    if (type === "priority") {
      switch (value) {
        case "critical":
          return "bg-red-100 text-red-700";
        case "high":
          return "bg-orange-100 text-orange-700";
        case "medium":
          return "bg-yellow-100 text-yellow-700";
        case "low":
          return "bg-green-100 text-green-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    }

    // Status colors (existing logic)
    switch (value) {
      case "created":
        return "bg-green-100 text-gray-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "assigned":
        return "bg-purple-100 text-purple-700";
      case "unassigned":
        return "bg-orange-100 text-orange-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "completed":
      case "approved":
        return "bg-green-100 text-green-700";
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      case "retired":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="overflow-x-auto">
        <BaseTable>
          <TableHeader className="bg-gray-50 rounded">
            <TableRow>
              {isSelectable && (
                <TableHead>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
              )}
              {headers.map((header) => (
                <TableHead key={header.Label}>{header.Label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {isSelectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => toggleRow(rowIndex)}
                      />
                    </TableCell>
                  )}
                  {headers.map((header, colIndex) => {
                    if (header.icons?.length) {
                      return (
                        <TableCell key={`actions-${colIndex}`}>
                          <div className="flex gap-4 justify-start">
                            {header.icons.map((icon) => (
                              <Tooltip key={icon.key}>
                                <button
                                  type="button"
                                  onClick={() => onIconClick?.(icon.key, row)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  {icon.icon}
                                </button>
                              </Tooltip>
                            ))}
                          </div>
                        </TableCell>
                      );
                    }

                    const value = row[header.FieldName];

                    // Custom render function takes priority
                    if (header.render) {
                      return (
                        <TableCell key={`custom-${colIndex}`}>
                          {header.render(value, row)}
                        </TableCell>
                      );
                    }

                    // Status/Badge rendering
                    if (header.type === "status") {
                      return (
                        <TableCell key={`status-${colIndex}`}>
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-xs font-medium capitalize",
                              getStatusColorClass(value, header.statusType)
                            )}
                          >
                            {value}
                          </span>
                        </TableCell>
                      );
                    }

                    // Regular cell with optional custom text color
                    return (
                      <TableCell
                        key={`cell-${colIndex}`}
                        className={cn(
                          "max-w-[200px] truncate",
                          header.textColor || "text-gray-900" // Default to gray-900
                        )}
                      >
                        {value ?? "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </BaseTable>
      </div>

      {showPagination && (
        <Pagination>
          <PaginationContent className="max-w-lg truncate">
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={currentPage <= 1}
                className={cn({
                  "cursor-not-allowed opacity-50": currentPage <= 1,
                })}
                onClick={() =>
                  currentPage > 1 && onPageChange?.(currentPage - 1)
                }
              />
            </PaginationItem>

            {getPageRange(currentPage, totalPages).map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <span className="px-2">...</span>
                ) : (
                  <PaginationLink
                    isActive={currentPage === Number(page)}
                    onClick={() => onPageChange?.(Number(page))}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                aria-disabled={currentPage >= totalPages}
                className={cn({
                  "cursor-not-allowed opacity-50": currentPage >= totalPages,
                })}
                onClick={() =>
                  currentPage < totalPages && onPageChange?.(currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
