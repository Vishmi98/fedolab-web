import * as Yup from 'yup';

import { ContactUsType } from './contact.types';


export const contactUsInitialValues: ContactUsType = {
    name: '',
    email: '',
    subject: '',
    phoneNo: '',
    message: ''
};

export const contactUsValidationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    subject: Yup.string(),
    phoneNo: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must contain only digits')
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be less than 15 digits')
        .required('Phone number is required'),
    message: Yup.string()
        .min(10, 'Message must be at least 10 characters')
        .max(500, 'Message must be less than 500 characters')
});