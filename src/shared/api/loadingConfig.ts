type LoadingType = 'skeleton' | 'basic';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Define loading types based on HTTP methods
const methodLoadingTypes: Record<HttpMethod, LoadingType> = {
  GET: 'skeleton',    // Show skeleton for data fetching
  POST: 'basic',      // Show basic loader for create operations
  PUT: 'basic',       // Show basic loader for update operations
  PATCH: 'basic',     // Show basic loader for partial updates
  DELETE: 'basic'     // Show basic loader for delete operations
};

// List of endpoints that should use basic loading instead of skeleton
const basicLoadingEndpoints = [
  'dropdown',
  'select',
  'options',
  'lookup',
  'enums',
  'choices',
  'autocomplete',
  'search',
  'multi-select',
  'metadata',
  'meta-data',
  'multiselect'
];

export const getLoadingTypeForRequest = (method: HttpMethod, url?: string): LoadingType => {
  // If URL is provided, check if it matches any basic loading endpoints
  if (url) {
    console.log('url', url);
    const isBasicLoadingEndpoint = basicLoadingEndpoints.some(endpoint => 
      url.toLowerCase().includes(endpoint.toLowerCase())
    );
    console.log('isBasicLoadingEndpoint', isBasicLoadingEndpoint);
    if (isBasicLoadingEndpoint) {
      return 'basic';
    }
  }
  
  return methodLoadingTypes[method] || 'basic';
}; 