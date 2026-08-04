import * as Yup from 'yup';

import { EmailModalTypes, LoginFormType } from "./auth.types";


export const loginFormInitialValues: LoginFormType = {
    email: '',
};

export const loginFormValidationSchema = Yup.object({
    email: Yup.string().required("Email is required"),
});

export const verifyEmailModalInitialValues: EmailModalTypes = {
    pin: '',
};

export const verifyEmailModalValidationSchema = Yup.object({
    pin: Yup.string()
        .required("PIN is required")
        .length(6, "PIN must be exactly 6 characters")
        .matches(/^[A-Z0-9]{6}$/, "PIN must contain only uppercase letters and numbers"),
});
