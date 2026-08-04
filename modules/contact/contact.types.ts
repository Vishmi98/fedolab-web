export type ContactUsType = {
    name: string;
    email: string;
    subject: string;
    phoneNo: string;
    message: string;
}
export type SubmitFormResponseType = {
    success: boolean;
    message: string;
    data: ContactUsType;
}

export type SubmitFormResponseDataType = {
    success: boolean;
    message: string;
    data: {
        lead: ContactUsType;
    }
}

export interface ContactUsDataType {
    id: number;
    name: string;
    email: string;
    subject: string;
    phoneNo: string;
    message: string;
}

export type InquiriesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalLeads: number;
    leads: ContactUsDataType[];
}

export type InquiriesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalLeads: number;
        leads: ContactUsDataType[];
    }
}