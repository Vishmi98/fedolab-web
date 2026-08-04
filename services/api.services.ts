import axios, { AxiosResponse } from 'axios';

import { ApiCallOptions } from '@/constants/types';


const apiCall = async <T>({
    url,
    method = 'GET',
    body = {},
    params = {},
}: ApiCallOptions): Promise<T> => {
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Configure the Axios request
        const response: AxiosResponse<T> = await axios({
            url,
            method,
            headers,
            data: body,
            params,
        });

        return response.data; // Returns only the data from the response
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

export default apiCall;
