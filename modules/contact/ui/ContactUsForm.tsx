"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

import { ContactUsType } from "../contact.types";
import {
  contactUsInitialValues,
  contactUsValidationSchema,
} from "../contact.utils";
import { createLead } from "../contact.service";


const ContactUsForm = () => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const router = useRouter();

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600); // match animation duration
  };

  const handleSubmit = async (
    values: ContactUsType,
    {
      resetForm,
      setSubmitting,
    }: {
      resetForm: () => void;
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    setSubmitting(true);

    try {
      const response = await createLead(values);
      if (response.success) {
        toast.success(response.message || "Form submitted successfully");
        resetForm();
        router.push('/');
      } else {
        toast.error(response.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred during form submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5 bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-xl">
      <Formik
        initialValues={contactUsInitialValues}
        validationSchema={contactUsValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-gray-600 text-sm">Name</label>
              <Field
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-sm"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-xs text-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-gray-600 text-sm">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-sm"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-gray-600 text-sm">Phone Number</label>
                <Field
                  name="phoneNo"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-sm"
                />
                <ErrorMessage
                  name="phoneNo"
                  component="p"
                  className="text-xs text-red-500"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-gray-600 text-sm">Subject</label>
              <Field
                name="subject"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-sm"
              />
              <ErrorMessage
                name="subject"
                component="p"
                className="text-xs text-red-500"
              />
            </div>

            {/* Message */}
            <div className="space-y-1">
              <label className="text-gray-600 text-sm">Message</label>
              <Field
                as="textarea"
                name="message"
                rows={4}
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 border border-gray-300 text-sm"
              />
              <ErrorMessage
                name="message"
                component="p"
                className="text-xs text-red-500"
              />
            </div>

            {/* Submit Button with Ripple */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              onClick={handleRipple}
              className={`relative overflow-hidden cursor-pointer py-3 px-6 rounded-xl w-full font-bold transition ${isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-black/80 text-white"
                }`}
            >
              <span className="relative">
                {isSubmitting ? "Sending..." : "Get In Touch"}
              </span>

              {/* Ripples */}
              {ripples.map((ripple) => (
                <motion.span
                  key={ripple.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.3, scale: 4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute bg-white rounded-full pointer-events-none"
                  style={{
                    width: 20,
                    height: 20,
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                  }}
                />
              ))}
            </motion.button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUsForm;
