// import { RequestCreationSuccess } from '@features/cx/shared/components/RequestCreationSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

function ComplaintSuccessPage() {
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
    // <RequestCreationSuccess 
    //   requestData={requestData}
    //   requestType="complaint"
    //   onReturnToDashboard={() => navigate('/cx/complaints')}
    //   onAddNewRequest={() => navigate('/cx/complaints/create')}
    // />
    <h1>test</h1>
  );
}

export default ComplaintSuccessPage;
