import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { coreApi } from "./api";
import { Utility } from "./types";
import { useNavigate } from "react-router-dom";

const UTILITY_STORAGE_KEY = "utility";

export const useUtility = (tenantId: string) => {
  const navigate = useNavigate();

  const [selectedUtility, setSelectedUtility] = useState<string | null>(null);
  const [selectedUtilityObject, setSelectedUtilityObject] =
    useState<Utility | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: utilities = [], isLoading } = useQuery<Utility[], Error>({
    queryKey: ["utilities", tenantId],
    queryFn: () => coreApi.getUtility(tenantId),
    enabled: !!tenantId, // Only fetch when tenantId exists
  });

  // Initialize utility selection when utilities are loaded
  useEffect(() => {
    if (utilities.length > 0) {
      initializeUtilitySelection();
    }
  }, [utilities]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getStoredUtility = (): Utility | null => {
    try {
      const storedUtility = localStorage.getItem(UTILITY_STORAGE_KEY);
      return storedUtility ? JSON.parse(storedUtility) : null;
    } catch (error) {
      console.error("Error parsing stored utility:", error);
      setError("Failed to load stored utility");
      return null;
    }
  };

  const initializeUtilitySelection = () => {
    // Check if utility is already stored in localStorage
    const storedUtility = getStoredUtility();

    if (storedUtility) {
      // Verify that the stored utility still exists in the utilities list
      const utilityExists = utilities.find(
        (utility) => utility.id === storedUtility.id
      );

      if (utilityExists) {
        // Use stored utility
        setSelectedUtility(storedUtility.name);
        setSelectedUtilityObject(storedUtility);
        return;
      } else {
        // Remove invalid stored utility
        localStorage.removeItem(UTILITY_STORAGE_KEY);
      }
    }

    // Set default utility (2nd item like in Angular code, or 1st if only one exists)
    const defaultUtility = utilities.length > 1 ? utilities[1] : utilities[0];
    if (defaultUtility) {
      setUtilityValue(defaultUtility);
    }
  };

  const setUtilityValue = (utility: Utility) => {
    try {
      // Store in localStorage
      localStorage.setItem(UTILITY_STORAGE_KEY, JSON.stringify(utility));

      // Update state
      setSelectedUtility(utility.name);
      setSelectedUtilityObject(utility);

      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error storing utility:", error);
      setError("Failed to save utility selection");
    }
  };

  const handleUtilityChange = (utilityName: string) => {
    const selectedUtilityObj = utilities.find(
      (utility) => utility.name === utilityName
    );

    if (selectedUtilityObj) {
      setUtilityValue(selectedUtilityObj);
      navigate(0); // Refresh current route without changing URL
    } else {
      setError("Selected utility not found in utilities list");
      console.error("Selected utility not found in utilities list");
    }
  };

  const clearUtility = () => {
    try {
      localStorage.removeItem(UTILITY_STORAGE_KEY);
      setSelectedUtility(null);
      setSelectedUtilityObject(null);
      setError(null);
    } catch (error) {
      console.error("Error clearing utility:", error);
      setError("Failed to clear utility data");
    }
  };

  return {
    utilities,
    selectedUtility,
    selectedUtilityObject, // New: provides the full utility object
    setSelectedUtility: handleUtilityChange,
    setUtilityValue, // New: directly set utility object
    clearUtility, // New: clear utility data (useful for logout)
    loading: isLoading,
    error,
  };
};
