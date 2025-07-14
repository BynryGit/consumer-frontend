// Add your feature-specific types here
export interface AddressMap {
  city: string;
  address: string;
}

export interface Utility {
  id: number;
  name: string;
  contact_number: string | null;
  address_map: AddressMap | null;
  short_name: string;
  tenant: number;
  user_spoc: number;
  status: string | null;
  website: string | null;
  email: string | null;
  logo: string | null;
  is_active: boolean;
  is_activity_log: boolean;
  created_date: string;
  gst_hst_number: string | null;
  e_transfer_email: string | null;
  created_user: string | null;
}

export interface UtilityResponse {
  result: Utility[];
}

export interface coreState {
  utilities: Utility[];
  selectedUtility: string | null;
  loading: boolean;
  error: string | null;
}
