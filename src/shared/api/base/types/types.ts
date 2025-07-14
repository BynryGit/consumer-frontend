export interface ApiResponse<T> {
  result: T;
  success: boolean;
  message?: string;
  error?: string;
}
export interface ApiErrorResponse {
  message?: string;
  code?: string;
  details?: any;
}
