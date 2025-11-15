/**
 * Utility function to format territory address based on configuration
 * 
 * Note: API responses use snake_case (sub_area, config_type), but interfaces use camelCase.
 * The utility functions handle the mapping between these naming conventions automatically.
 */

interface TerritoryAddressData {
  region?: string;
  country?: string;
  state?: string;
  county?: string;
  zone?: string;
  division?: string;
  area?: string;
  subArea?: string;
  premise?: string;
  unit?: string;
  zipcode?: string;
}

interface AddressConfiguration {
  [key: string]: number; // e.g., { "ZONE": 3, "COUNTY": 1, "DIVISION": 2 }
}

interface ConfigurationItem {
  id: number;
  remoteUtilityId: number;
  configType: string;
  configurationData: any;
  configTypeDisplay: string;
}

export interface DocumentCardConfig {
  id: string;
  name: string;
  code: string;
  required: boolean;
}

interface ConfigurationItem {
  id: number;
  remoteUtilityId: number;
  configType: string;
  configurationData: any;
  configTypeDisplay: string;
}

/**
 * Formats territory address based on configured display order from localStorage
 * 
 * @param territoryData - The territory data object containing service/billing information
 * @param addressType - Type of address to format: 'service' or 'billing' (default: 'service')
 * @returns Formatted address string with line breaks, or empty string if no configuration found
 * 
 * @example
 * // Returns: "Solosolo\nAtua Division\nWestern Zone"
 * formatTerritoryAddress(row.territoryData, 'service')
 * 
 * @example
 * // Returns billing address
 * formatTerritoryAddress(row.territoryData, 'billing')
 */
export const formatTerritoryAddress = (
  territoryData: any,
  addressType: 'service' | 'billing' = 'service'
): string => {
  try {
    // Get configuration from localStorage
    const configString = localStorage.getItem('NSC-Configuration');
    
    if (!configString) {
      console.warn('NSC-Configuration not found in localStorage');
      return '';
    }

    const configResponse: any = JSON.parse(configString);
    
    // Handle both formats: direct array or object with result property
    const configArray: ConfigurationItem[] = Array.isArray(configResponse) 
      ? configResponse 
      : configResponse.result;
    
    if (!configArray) {
      console.warn('Configuration array not found');
      return '';
    }
    
    // Find ADDRESS_DISPLAY configuration
    const addressConfig = configArray.find(
      (config) => config.configType === 'ADDRESS_DISPLAY'
    );

    if (!addressConfig || !addressConfig.configurationData) {
      console.warn('ADDRESS_DISPLAY configuration not found');
      return '';
    }

    // Get the address data based on type
    const addressData: TerritoryAddressData = territoryData?.[addressType];
    
    if (!addressData) {
      console.warn(`Address data for type "${addressType}" not found`);
      return '';
    }

    // Get configuration data (e.g., { "ZONE": 3, "COUNTY": 1, "DIVISION": 2 })
    const configData: AddressConfiguration = addressConfig.configurationData;

    // Mapping between config keys (uppercase) and interface keys (camelCase)
        const fieldMapping: Record<string, keyof TerritoryAddressData> = {
          'region': 'region',
          'country': 'country',
          'state': 'state',
          'county': 'county',
          'zone': 'zone',
          'division': 'division',
          'area': 'area',
          'sub_area': 'subArea',
          'subarea': 'subArea',
          'premise': 'premise',
          'unit': 'unit',
          'zipcode': 'zipcode',
        };
    
    // Create array of [fieldName, orderValue] and sort by order
    const sortedFields = Object.entries(configData)
      .map(([fieldKey, orderValue]) => ({
        fieldKey: fieldKey.toLowerCase(), // Convert to lowercase for matching
        orderValue,
      }))
      .sort((a, b) => a.orderValue - b.orderValue);

    // Build address parts array
    const addressParts: string[] = [];

    for (const { fieldKey } of sortedFields) {
      // Map the config key to the interface key
      const mappedKey = fieldMapping[fieldKey];
      
      if (mappedKey) {
        // Get value from addressData using mapped key
        const value = addressData[mappedKey];
        
        // Skip empty, null, or undefined values
        if (value && value.trim() !== '') {
          addressParts.push(value.trim());
        }
      }
    }

    // Join with line breaks
    return addressParts.join('\n');
  } catch (error) {
    console.error('Error formatting territory address:', error);
    return '';
  }
};



/**
 * Gets a specific address field value
 * Useful when you need just one field
 */
export const getAddressField = (
  territoryData: any,
  fieldName: string,
  addressType: 'service' | 'billing' = 'service'
): string => {
  try {
    const addressData: TerritoryAddressData = territoryData?.[addressType];
    if (!addressData) return '';
    
    // Mapping between field names
    const fieldMapping: Record<string, keyof TerritoryAddressData> = {
      'region': 'region',
      'country': 'country',
      'state': 'state',
      'county': 'county',
      'zone': 'zone',
      'division': 'division',
      'area': 'area',
      'sub_area': 'subArea',
      'subarea': 'subArea',
      'premise': 'premise',
      'unit': 'unit',
      'zipcode': 'zipcode',
    };
    
    const mappedKey = fieldMapping[fieldName.toLowerCase()];
    if (!mappedKey) return '';
    
    const value = addressData[mappedKey];
    return value && value.trim() !== '' ? value.trim() : '';
  } catch (error) {
    console.error('Error getting address field:', error);
    return '';
  }
};

/**
 * Parse document configuration key
 * Example: "Invoice#1" → { name: "Invoice", code: "Invoice#1" }
 * 
 * IMPORTANT: We preserve the entire original key as the code
 * This ensures we pass the full key string to the API
 */
const parseDocumentKey = (key: string): { name: string; code: string } => {
  if (!key) return { name: "", code: "" };
  
  const parts = key.split("#");
  return {
    name: parts[0] || key,
    code: key, // Keep the full original key as the code
  };
};

/**
 * Get enabled document types from localStorage configuration
 */
export const getConfiguredDocumentTypes = (): DocumentCardConfig[] => {
  try {
    const configString = localStorage.getItem("NSC-Configuration");
    
    if (!configString) {
      console.warn("NSC-Configuration not found in localStorage");
      return [];
    }

    console.log("NSC-Configuration", configString);
    
    const configResponse: any = JSON.parse(configString);
    
    const configArray: ConfigurationItem[] = Array.isArray(configResponse) 
      ? configResponse 
      : configResponse.result;
    
    if (!configArray) {
      console.warn("Configuration array not found");
      return [];
    }
    
    const documentConfig = configArray.find(
      (config) => config.configType === "DOCUMENT_TYPE"
    );

    if (!documentConfig || !documentConfig.configurationData) {
      console.warn("DOCUMENT_TYPE configuration not found");
      return [];
    }

    console.log("✅ Document Configuration Found:", documentConfig.configurationData);

    const configData = documentConfig.configurationData;
    const documentTypes: DocumentCardConfig[] = [];

    Object.entries(configData).forEach(([key, value]) => {
      // Include both required (value === 1) and optional (value === 0) document types
      if (value === 1 || value === 0) {
        const { name, code } = parseDocumentKey(key);
        const isRequired = value === 1;
        
        console.log(`➕ ${isRequired ? 'Required' : 'Optional'} Document Type: ${name} (Full Code: ${code})`);
        
        documentTypes.push({
          id: code,
          name: name,
          code: code, // Using the full key like "Skills Documents#3"
          required: isRequired, // Set required based on value
        });
      }
    });

    console.log("📋 All Document Types (Required + Optional):", documentTypes);
    return documentTypes;
  } catch (error) {
    console.error("❌ Error reading document configuration:", error);
    return [];
  }
};