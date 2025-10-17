
import { RequestCreationSuccess } from '@shared/components/RequestCreationSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

function TransferRequestSuccessPage() {
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
      requestType="transfer"
      onReturnToDashboard={() => navigate('/request-tracker')}
      onAddNewRequest={() => navigate('/service/transfer')}
    />
  );
}

export default TransferRequestSuccessPage;
