// @shared/utils/loginUtils.ts

interface LoginResult {
  result: {
    remoteUtilityId: string | number;
    consumerNo: string;
    consumerId:any;
    firstName:any;
    lastName:any;
    // Add other properties as needed
  };
}

interface LoginData {
  remoteUtilityId: string;
  remoteConsumerNumber: string;
  consumerId:any;
   firstName:any;
    lastName:any;
}

/**
 * Retrieves login data from localStorage
 * @returns {LoginData} Object containing remoteUtilityId and remoteConsumerNumber
 */
export const getLoginDataFromStorage = (): LoginData => {
  try {
    const loginResult: LoginResult = JSON.parse(localStorage.getItem('loginResult') || '{}');
    
    return {
      remoteUtilityId: loginResult.result?.remoteUtilityId?.toString() || '',
      remoteConsumerNumber: loginResult.result?.consumerNo || '',
      consumerId:loginResult.result?.consumerId || '',
      firstName:loginResult.result?.firstName || '',
      lastName:loginResult.result?.lastName || ''
    };
  } catch (error) {
    console.error('Error parsing login data from localStorage:', error);
    return {
      remoteUtilityId: '',
      remoteConsumerNumber: '',
      consumerId:'',
      lastName:'',
      firstName:''
    };
  }
};

/**
 * Checks if valid login data exists in localStorage
 * @returns {boolean} True if both remoteUtilityId and remoteConsumerNumber exist
 */
export const hasValidLoginData = (): boolean => {
  const { remoteUtilityId, remoteConsumerNumber,consumerId,lastName,
      firstName } = getLoginDataFromStorage();
  return !!(remoteUtilityId && remoteConsumerNumber && consumerId &&firstName&&lastName);
};

/**
 * Clears login data from localStorage
 */
export const clearLoginData = (): void => {
  localStorage.removeItem('loginResult');
};