import { ContactUsType, InquiriesResponseDataType, InquiriesResponseType, SubmitFormResponseDataType, SubmitFormResponseType } from "./contact.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const createLead = async (body: ContactUsType): Promise<SubmitFormResponseDataType> => {
    const response: SubmitFormResponseType = await apiCall({
        url: `${URL}/contactUs/create`,
        method: 'POST',
        body: body,
    });

    return {
        success: response.success,
        message: response.message,
        data: {
            lead: response.data,
        },
    };
};

export const getLeads = async (page?: number, limit?: number): Promise<InquiriesResponseDataType> => {
    const response: InquiriesResponseType = await apiCall({
        url: `${URL}/contactUs/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        leads: data.leads || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalLeads: data.totalLeads ?? 0,
    };
};