
import { RequestCreationSuccess } from '@shared/components/RequestCreationSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

function DisconnectionSuccessPage() {
  const navigate = useNavigate();
  // The state contains the merged data from your navigation
  const { formData, ...apiResponse } = useLocation().state || {};
  
  const requestData = {
    ...apiResponse,
    formData: formData
  };
  if (!requestData) {
    return <div>No request data found</div>;
  }

  return (
    <RequestCreationSuccess 
      requestData={requestData}
      requestType="disconnection"
        onReturnToDashboard={() => navigate('/request-tracker')}
      onAddNewRequest={() => navigate('/service/disconnect')}
    />
  );
}

export default DisconnectionSuccessPage;
