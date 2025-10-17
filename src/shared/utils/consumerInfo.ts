const getLoginDataFromStorage = () => {
    const loginResult = JSON.parse(localStorage.getItem('loginResult') || '{}');
    console.log('Login Result from localStorage:', loginResult);
    console.log('Remote Utility ID:', loginResult.result.remoteUtilityId);
    console.log('Consumer Number:', loginResult.result.consumerNo);
    return {
      remoteUtilityId: loginResult.remoteUtilityId?.toString() ,
      remoteConsumerNumber: loginResult.consumerNo,
    };
  };