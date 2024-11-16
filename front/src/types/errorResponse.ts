export type ErrorResponse = {
  message?: string;
  error_type?: string;
  details?: string;
};

export function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === 'object' && data !== null && ('message' in data || 'error_type' in data);
}
