import { useSmartMutation, useSmartQuery } from "@shared/api/queries/hooks";
import { QueryKeyFactory } from "@shared/api/queries/queryKeyFactory";
import { requestTrackerApi } from "./api";
import { AddNotePayload } from "./types";

// Add your feature-specific hooks here
export const useRequestTracker = () => {
  // Define your hooks
  return {};
};

export const useRequestData = (params: {
  consumer_id: string;
  remote_utility_id: string;
  page: any;
  limit: any;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.request.requestData(params),
    () => requestTrackerApi.getRequestData(params)
  );
};
export const useAddNote = () => {
  return useSmartMutation(
    (payload: AddNotePayload ) =>
      requestTrackerApi.addNote(payload)
  );
};
export const useRequestSummary = (params: {
   remote_utility_id: string;
      consumer_id:string
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.request.requestSummary(params),
    () => requestTrackerApi.getRequestSummary(params)
  );
};

export const useRequestType = (params: {
  remote_utility_id: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.request.requestType(params),
    () => requestTrackerApi.getRequestType(params)
  );
};

export const useConsumerStatus = (params: {
  remote_utility_id: string;
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.request.consumerStatus(params),
    () => requestTrackerApi.getConsumerStatus(params)
  );
};


export const useRequestDetail = (params: {
  remote_utility_id: string;
  id:string
}) => {
  return useSmartQuery(
    QueryKeyFactory.module.cx.request.requestDetail(params),
    () => requestTrackerApi.getRequestDetail(params)
  );
};