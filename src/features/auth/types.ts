// Add your feature-specific types here
export interface authState {
  // Define your state types
}
// Feature-specific types
export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    token: string;
  };
}

export interface UserProfile {
  id: number;
  utility: {
    id: number;
    name: string;
    contactNumber: string | null;
    addressMap: any | null;
    shortName: string;
    tenant: {
      id: number;
      name: string;
      contactNumber: string;
      addressMap: {
        city: string;
        state: string;
        country: string;
      };
      shortName: string | null;
      userSpoc: {
        id: number;
        email: string;
        username: string;
        name: string;
        isActive: boolean;
      };
      status: string | null;
      isActive: boolean;
      currency: string;
      product: string[];
      dateFormat: string;
      extraDataMap: {
        timezone: string;
        country: string;
      };
    };
    userSpoc: number;
    status: string | null;
    website: string | null;
    email: string | null;
    logo: string | null;
    isActive: boolean;
    isActivityLog: boolean;
    createdDate: string;
    gstHstNumber: string | null;
    eTransferEmail: string | null;
  };
  roleCode: string[];
  gender: string;
  slug: string;
  user: {
    id: number;
    email: string;
    username: string;
    name: string;
    isActive: boolean;
  };
  extraDataMap: any | null;
  isSetupCompleted: boolean;
  landingPage: string;
  numFormat: any[];
  modulesPermission: Array<{
    name: string;
    id: number;
    submodule: string[];
    isNumFormat: boolean;
    active: boolean;
    editable: boolean;
  }>;
  routes: Array<{
    code: string;
    source: string;
    isActive: boolean;
  }>;
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}


export interface ConsumerWebLoginPayload {
  username?: string;
  email?: string;
  password: string;
  consumer_number?: string;
  // Add other login fields as needed
}

export interface forgotPassword{
   email?: string;
}

export interface ConsumerWebLoginResponse {
  user: any;
  consumerId: any;
  consumerNo(arg0: string, consumerNo: any): unknown;
  // Standard OAuth fields
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  message?: string;
  
  // Actual API response structure
  result: {
    user: {
      id: number;
      email: string;
      token: string;
      username?: string;
    };
    consumer_id: number;
    consumer_no: string;
    remote_utility_id: number;
    first_name: string;
    last_name: string;
    mobile_no: string;
    status: string;
  };
}

export interface UserUtilityResponse {
  id: string;
  name: string;
  tenant_alias: string;
  logo_url?: string;
  contact_info?: {
    phone: string;
    email: string;
    address: string;
  };
  settings?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
