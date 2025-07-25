// Add your feature-specific types here
export interface requestTrackerState {
  // Define your state types
}
export interface AddNotePayload {
  source: any;
  request_id: any;
  remote_utility_id: any;
  notes: {
    note: string;
  };
}