export interface prefrencesPayload {
  id: number | string; // depending on your API
  additional_data: {
    communication: Array<'email' | 'phone'>;
    preferences: {
      is_billing_and_payment: boolean;
      is_service_outage: boolean;
      is_usage_insights: boolean;
    };
  };
}

