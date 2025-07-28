import { ApiEndpoints } from "@shared/api/api-endpoints";
import { cxApiClient } from "@shared/api/clients/apiClientFactory";

export const contactUsApi = {

  //localhost:4007/api/cx/consumer-service-center/?remote_utility_id=604&consumer_id=20167
 getServiceDetail: async (params: {
     remote_utility_id: string;
     consumer_id:string;
   }): Promise<any> => {
     const url = ApiEndpoints.createUrlWithQueryParameters(
       "consumerWeb",
       "consumer-service-center",
       (qs) => {
         qs.push("remote_utility_id", params.remote_utility_id);
          qs.push("consumer_id", params.consumer_id);
       }
     );
     const response = await cxApiClient.get(url); 
     return response.data;
   },
};
