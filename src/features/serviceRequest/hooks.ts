import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { serviceRequestApi } from "./api";
import { CreateDisconnectionRequestPayload, CreateServiceRequestPayload, UtilityConfigFilters } from "./types";
import { useNavigate } from "react-router-dom";
import { formDataToJson } from "@shared/utils/jsonToObjectTransformer";

export const useComplaintConfigurations = (remoteUtilityId: number) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.complaint.complaintConfigurations(
      remoteUtilityId
    ),
    () => serviceRequestApi.getConfigurations(remoteUtilityId),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes (configurations don't change often)
      enabled: !!remoteUtilityId,
    }
  );
};

export const useCreateComplaint = () => {
  const navigate = useNavigate();
  return useSmartMutation(
    (payload: { data: any }) => serviceRequestApi.createComplaint(payload.data),
    
        {
      onSuccess: async (data, variables) => {
       
       

        // Convert FormData to JSON if it's FormData
        const formDataJson =
          variables.data instanceof FormData
            ? formDataToJson(variables.data)
            : variables.data;

        navigate("/complaints/success", {
          state: { ...data, formData: formDataJson },
        });
      },
     
    }
  );

};

export const useTimeSlotChoices = () => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.disconnection.timeSlotChoices(),
    () => serviceRequestApi.getTimeSlotChoices(),
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  );
};

export const usePaymentMethod = (params: { remote_utility_id: any;}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.request.paymentMethod(params), // Include params in query key for caching
    () => serviceRequestApi.getPaymentMethod(params),
    {
      enabled: !!params.remote_utility_id,
      staleTime: 10 * 60 * 1000,
    }
  );
};
export const useCreateServiceRequest = () => {
  const navigate = useNavigate();
  return useSmartMutation(
    (payload: { consumerId: string; remoteUtilityId: string; utilityServices: any, serviceCharges: any,  serviceName: any, data: any }) =>
      serviceRequestApi.createServiceRequest(
        payload.consumerId,
        payload.remoteUtilityId,
        payload.data
      ),
    {
     
      onSuccess: (data, variables) => {
        // toast.success('Service request created successfully!');
        navigate("/newService/success", {
          state: { ...data, formData: variables.data, serviceCharges: variables.serviceCharges, utilityServices: variables.utilityServices, serviceName: variables.serviceName },
        });
      },
    }
  );
};
// export const useCreateServiceRequest = () => {
//   const navigate = useNavigate();
//   return useSmartMutation(
//     (payload: CreateServiceRequestPayload) =>
//       serviceRequestApi.createServiceRequest(payload),
//     // {

//     //   onSuccess: (data: any, variables: any) => {
//     //     navigate("/disconnections/success", {
//     //       state: { ...data, formData: variables },
//     //     });
//     //   },
    
//     // }
//   );
// };
export const useUtilityRequestConfiguration = (
  filters: UtilityConfigFilters
) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.disconnection.utilityConfig(filters),
    () => serviceRequestApi.getUtilityRequestConfiguration(filters),
    {
      enabled: !!filters.requestType,
      staleTime: 10 * 60 * 1000,
    }
  );
};
export const useCreateDisconnectionRequest = () => {
  const navigate = useNavigate();
  return useSmartMutation(
    (payload: CreateDisconnectionRequestPayload) =>
      serviceRequestApi.createDisconnectionRequest(payload),
    {

      onSuccess: (data: any, variables: any) => {
        navigate("/disconnections/success", {
          state: { ...data, formData: variables },
        });
      },
    
    }
  );
};

export const usePremise = (params: {
  remote_utility_id: any;
  config_level: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transfer.list(params), // Include params in query key for caching
    () => serviceRequestApi.getPremise(params),
    {
      enabled: !!params.remote_utility_id,
    }
  );
};

export const useConsumerDetails = (params: {
  remote_utility_id: any;
  consumer_no: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.login.consumerDetails(params), // Include params in query key for caching
    () => serviceRequestApi.consumerDetails(params),
    {
      enabled: !!params.remote_utility_id,
    }
  );
};

export const useConsumerRelation = () => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.transfer.list(), // Unique query key
    () => serviceRequestApi.getConsumerRelation(),
   
  );
};

export const useKycInfo = (
  params: {
    remote_utility_id: any;
    consumer_id: any;
    is_kyc_info: any;
  },
  p0: { enabled: boolean }
) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.document.kycInfo(params), // Include params in query key for caching
    () => serviceRequestApi.getKycInfo(params),
    {
      enabled: !!params.remote_utility_id && p0.enabled,
    }
  );
};

export const useDocumentType = (params: {
  remote_utility_id: any;
  config_level: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.document.documentType(params), // Include params in query key for caching
    () => serviceRequestApi.getDocumentType(params)
  );
};


export const useDocumentSubtype = (
  params: {
    remote_utility_id: any;
    config_level: string;
    code_list: string;
  },
  p0: { enabled: boolean }
) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.document.documentSubType(params), // Include params in query key for caching
    () => serviceRequestApi.getDocumentSubtype(params)
  );
};

export const useCreateTransferRequest = () => {
  const navigate = useNavigate();
  return useSmartMutation(
    (payload: {data: FormData}) => serviceRequestApi.createTransferRequest(payload.data),
    {
        onSuccess: (data: any, variables: any) => {
        // Convert FormData to JSON if it's FormData
        const formDataJson = variables.data instanceof FormData 
          ? formDataToJson(variables.data)
          : variables.data;

          navigate('/transfer/success', { state: { ...data, formData: formDataJson } });  
      },
     
    }
  );
};
