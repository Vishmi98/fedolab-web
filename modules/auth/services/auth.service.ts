import { LoginFormType, LoginResponseDataType, LoginResponseType, VerifyDataType, VerifyUserResponseDataType, VerifyUserResponseType } from "../auth.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const handleUserLogin = async ({ email }: LoginFormType): Promise<LoginResponseDataType> => {
    const response: LoginResponseType = await apiCall({
        url: `${URL}/user/login`,
        method: 'POST',
        body: { email },
    })

    if (response?.success) {
        return {
            success: true,
            message: response?.message,
            email: response?.data?.email
        }
    }
    else {
        return {
            success: false,
            message: response?.message,
            email: ''
        }
    }
};

export const handleVerifyUser = async ({ email, pin }: VerifyDataType): Promise<VerifyUserResponseDataType> => {
    const response: VerifyUserResponseType = await apiCall({
        url: `${URL}/user/verify-pin`,
        method: 'POST',
        body: { email, pin },
    })

    if (response?.success) {
        return {
            success: true,
            message: response?.message,
            token: response?.data?.token
        }
    }
    else {
        return {
            success: false,
            message: response?.message,
        }
    }
};