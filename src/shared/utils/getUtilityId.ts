export const getRemoteUtilityId = (): number => {
  try {
    const utilityData = localStorage.getItem("utility");
    if (utilityData) {
      const parsedUtility = JSON.parse(utilityData);
      // Get the id from the utility object
      return parsedUtility?.id;
      // return 699;
    }
  } catch (error) {
    console.error("Error parsing utility from localStorage:", error);
  }
};
