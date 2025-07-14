export interface ApiResponse<T> {
  result: T;
  success: boolean;
  message?: string;
  error?: string;
  page_number: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: any;
}

export interface DropdownItem {
  key: string;
  value: string;
}