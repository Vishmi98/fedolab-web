"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';

import { LoginFormType } from '../auth.types';
import { handleUserLogin } from '../services/auth.service';
import { loginFormInitialValues, loginFormValidationSchema } from '../auth.utils';

import { handleSaveCookieEmail } from '@/utils/cookie.util';
import Loader from '@/components/Loader';


const LoginForm = () => {
    const router = useRouter();

    const handleSubmit = async (values: LoginFormType, { resetForm }: { resetForm: () => void }) => {
        try {
            const res = await handleUserLogin(values);
            if (res.success && res?.email) {
                handleSaveCookieEmail(res?.email);
                toast.success(res.message)
                router.push("/verify_email");
                resetForm();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Error login user:", error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
                <div className="flex flex-col leading-tight">
                    <div
                        className="font-extrabold text-xl tracking-wide"
                    >
                        FEDOLAB
                    </div>
                </div>
            </div>

            {/* Form */}
            <Formik
                initialValues={loginFormInitialValues}
                validationSchema={loginFormValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-4">
                        {/* Email Field */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">Email Address</label>
                            <Field type="text" name="email" className="border border-gray-300 rounded-sm text-sm p-2 w-full" />
                            <ErrorMessage name="email" component="div" className="text-red-600 text-xs" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex justify-center items-center rounded-md bg-black hover:opacity-80 py-2 text-sm font-semibold text-white transition-all duration-200"
                        >
                            {isSubmitting ? <Loader h={15} /> : "Sign in"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginForm;
