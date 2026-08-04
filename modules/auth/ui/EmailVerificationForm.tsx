"use client";

import React, { useRef } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";

import { handleVerifyUser } from "../services/auth.service";
import { verifyEmailModalInitialValues, verifyEmailModalValidationSchema } from "../auth.utils";

import { getCookieEmail } from "@/utils/cookie.util";
import { handleSaveCookieToken, handleSaveCookieUser, handleRemoveCookieEmail } from "@/utils/cookie.util";
import { UserStoreUserType } from "@/constants/types";


const EmailVerificationForm = () => {
    const router = useRouter();
    const email = getCookieEmail();
    const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(6).fill(null));
    console.log("email", email);

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
            <Formik
                initialValues={verifyEmailModalInitialValues}
                validationSchema={verifyEmailModalValidationSchema}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        const res = await handleVerifyUser({ email, pin: values.pin });
                        if (res.success && res?.token) {
                            const decoded = jwt.decode(res?.token) as { user: UserStoreUserType };
                            handleSaveCookieToken(res?.token);
                            handleSaveCookieUser(JSON.stringify(decoded.user));
                            handleRemoveCookieEmail();
                            toast.success(res.message);

                            router.push("/admin/blogs");
                            resetForm();
                        } else {
                            toast.error(res.message);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }}
            >
                {({ values, setFieldValue, isSubmitting }) => {
                    const otpArray = values.pin.split("").concat(new Array(6 - values.pin.length).fill(""));

                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
                        const value = e.target.value.toUpperCase();
                        if (!/^[A-Z0-9]?$/.test(value)) return; // Allow only letters & numbers

                        const newOtp = [...otpArray];
                        newOtp[index] = value;
                        setFieldValue("pin", newOtp.join(""));

                        if (value && index < 5) {
                            inputRefs.current[index + 1]?.focus();
                        }
                    };

                    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
                        if (e.key === "Backspace") {
                            if (otpArray[index]) {
                                // Clear current value
                                const newOtp = [...otpArray];
                                newOtp[index] = "";
                                setFieldValue("pin", newOtp.join(""));
                            } else if (index > 0) {
                                // Move focus to previous input
                                inputRefs.current[index - 1]?.focus();
                            }
                        }
                    };

                    return (
                        <Form className="flex flex-col gap-3 w-full">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-sm font-semibold">
                                    Verify Your Email
                                </label>
                                <p className="text-xs">To verify email, please enter the six-letter code from {email}</p>
                                <div className="flex gap-2 justify-center my-3 w-full">
                                    {otpArray.map((char, i) => (
                                        <Field
                                            key={i}
                                            type="text"
                                            name={`pin-${i}`}
                                            className="border p-2 rounded-md w-10 h-10 md:w-12 md:h-12 text-center text-lg font-bold"
                                            value={char}
                                            maxLength={1}
                                            innerRef={(el: HTMLInputElement | null) => (inputRefs.current[i] = el)}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, i)}
                                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, i)}
                                        />
                                    ))}
                                </div>
                                <ErrorMessage name="pin" component="div" className="text-red-600 text-xs" />
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="flex justify-center items-center rounded-md bg-black hover:opacity-80 py-2 text-sm font-semibold text-white transition-all duration-200"
                            >
                                Verify
                            </button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default EmailVerificationForm;
