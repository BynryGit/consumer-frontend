import { useSmartMutation } from "@shared/api/queries/hooks";
import { prefrencesPayload } from "./types";
import { PreferencesApi } from "./api";

export const useAddPreferences = () => {
  return useSmartMutation(
    ({ id, payload }: { id:any; payload: prefrencesPayload }) =>
      PreferencesApi.addPreferences(id, payload)
  );
};  