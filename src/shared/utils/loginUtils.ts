// @shared/utils/loginUtils.ts

interface LoginResult {
  result: {
    remoteUtilityId: string | number;
    consumerNo: string;
    consumerId:any;
    // Add other properties as needed
  };
}

interface LoginData {
  remoteUtilityId: string;
  remoteConsumerNumber: string;
  consumerId:any;
}

/**
 * Retrieves login data from localStorage
 * @returns {LoginData} Object containing remoteUtilityId and remoteConsumerNumber
 */
export const getLoginDataFromStorage = (): LoginData => {
  try {
    const loginResult: LoginResult = JSON.parse(localStorage.getItem('loginResult') || '{}');
    
    console.log('Login Result from localStorage:', loginResult);
    console.log('Remote Utility ID:', loginResult.result?.remoteUtilityId);
    console.log('Consumer Number:', loginResult.result?.consumerNo);
    
    return {
      remoteUtilityId: loginResult.result?.remoteUtilityId?.toString() || '',
      remoteConsumerNumber: loginResult.result?.consumerNo || '',
      consumerId:loginResult.result?.consumerId || ''
    };
  } catch (error) {
    console.error('Error parsing login data from localStorage:', error);
    return {
      remoteUtilityId: '',
      remoteConsumerNumber: '',
      consumerId:''
    };
  }
};

/**
 * Checks if valid login data exists in localStorage
 * @returns {boolean} True if both remoteUtilityId and remoteConsumerNumber exist
 */
export const hasValidLoginData = (): boolean => {
  const { remoteUtilityId, remoteConsumerNumber,consumerId } = getLoginDataFromStorage();
  return !!(remoteUtilityId && remoteConsumerNumber && consumerId);
};

/**
 * Clears login data from localStorage
 */
export const clearLoginData = (): void => {
  localStorage.removeItem('loginResult');
};