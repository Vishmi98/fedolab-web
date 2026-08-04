"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { CgClose } from "react-icons/cg";

import { BlogType, EditBlogModalProps } from "../../blogs.types";
import { updateBlog } from "../../blogs.service";
import { addBlogValidationSchema } from "../../blogs.utils";

import { MAX_SIZE_MB } from "@/constants/data";
import CropModal from "@/components/ImageCropper";


const EditBlogModal: React.FC<EditBlogModalProps> = ({ isOpen, onClose, initialValues, reloadData }) => {
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // Crop modal state
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);
    const [cropFor, setCropFor] = useState<"thumbnail" | "cover">("thumbnail");

    // Image change handler
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, type: "thumbnail" | "cover") => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_SIZE_MB) {
            toast.error(`Please upload ${type} image smaller than 1.1 MB.`);
            return;
        }

        setTempImageFile(file);
        setCropFor(type);
        setIsCropOpen(true);
    };

    // Cropping complete handler
    const handleCropComplete = (croppedFile: File) => {
        setCoverImage(croppedFile);

        setTempImageFile(null);
        setIsCropOpen(false);
    };

    const handleSubmit = async (
        values: BlogType,
        { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        if (!initialValues) return;

        try {
            setIsLoading(true);

            const formattedDate = new Date(values.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "2-digit",
            });

            const formData = new FormData();
            formData.append("blogId", String(initialValues.id));
            formData.append("title", values.title);
            formData.append("author", values.author);
            formData.append("date", formattedDate);
            formData.append("url", values.url);
            formData.append("paragraph1", values.paragraph1 || "");
            formData.append("paragraph2", values.paragraph2 || "");
            formData.append("paragraph3", values.paragraph3 || "");

            if (coverImage) {
                formData.append("coverImage", coverImage);
            }

            const response = await updateBlog(formData);

            if (response.success) {
                toast.success(response.message);
                resetForm();
                setCoverImage(null);
                setTimeout(() => {
                    onClose();
                    reloadData();
                }, 300);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the blog.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen || !initialValues) return null;

    const formattedDate = (() => {
        const dateObj = new Date(initialValues.date);
        const year = dateObj.getFullYear();
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
        const day = dateObj.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    })();

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold">Edit Blog</h2>
                    <CgClose className="w-4 h-4 cursor-pointer" onClick={onClose} />
                </div>

                <Formik
                    initialValues={{
                        ...initialValues,
                        date: formattedDate,
                    }}
                    validationSchema={addBlogValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form>
                            <div className="flex flex-col gap-4 h-[60vh] overflow-y-auto p-4">
                                <label className="text-sm">
                                    Title
                                    <Field name="title" type="text" className="border border-gray-300 rounded-sm text-sm p-2 w-full " />
                                    <ErrorMessage name="title" component="div" className="text-red-600 text-xs" />
                                </label>
                                <label className="text-sm">
                                    Author
                                    <Field name="author" type="text" className="border border-gray-300 rounded-sm text-sm p-2 w-full " />
                                    <ErrorMessage name="author" component="div" className="text-red-600 text-xs" />
                                </label>
                                <label className="text-sm">
                                    Date
                                    <Field name="date" type="date" className="border border-gray-300 rounded-sm text-sm p-2 w-full " />
                                    <ErrorMessage name="date" component="div" className="text-red-600 text-xs" />
                                </label>
                                <label className="text-sm">
                                    Url
                                    <Field name="url" type="text" className="border border-gray-300 rounded-sm text-sm p-2 w-full " />
                                    <ErrorMessage name="url" component="div" className="text-red-600 text-xs" />
                                </label>
                                <label className="text-sm">
                                    Paragraph 1
                                    <Field as="textarea" name="paragraph1" className="border border-gray-300 rounded-sm text-sm p-2 w-full h-24  resize-none" />
                                    <ErrorMessage name="paragraph1" component="div" className="text-red-600 text-xs" />
                                </label>
                                <label className="text-sm">
                                    Paragraph 2
                                    <Field as="textarea" name="paragraph2" className="border border-gray-300 rounded-sm text-sm p-2 w-full h-24  resize-none" />
                                    <ErrorMessage name="paragraph2" component="div" className="text-red-600 text-xs" />
                                </label>
                                <label className="text-sm">
                                    Paragraph 3
                                    <Field as="textarea" name="paragraph3" className="border border-gray-300 rounded-sm text-sm p-2 w-full h-24  resize-none" />
                                    <ErrorMessage name="paragraph3" component="div" className="text-red-600 text-xs" />
                                </label>

                                {/* Cover Image */}
                                <label className="text-sm flex flex-col">
                                    Cover Image (≤ 1.1 MB)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, "cover")}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3
      file:rounded-md file:border file:text-xs file:font-semibold
      file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                    />
                                    {coverImage ? (
                                        <Image
                                            src={URL.createObjectURL(coverImage)}
                                            alt="Cover Preview"
                                            width={300}
                                            height={120}
                                            className="mt-2"
                                        />
                                    ) : initialValues.coverImagePath ? (
                                        <Image
                                            src={initialValues.coverImagePath}
                                            alt="Cover Preview"
                                            width={300}
                                            height={120}
                                            className="mt-2"
                                        />
                                    ) : null}
                                </label>

                            </div>
                            {/* Crop modal */}
                            {isCropOpen && tempImageFile && (
                                <CropModal
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={cropFor === "thumbnail" ? 320 : 1800}
                                    cropHeight={cropFor === "thumbnail" ? 350 : 900}
                                />
                            )}
                            <div className="flex justify-end space-x-2 p-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm bg-gray-300 rounded-lg w-full cursor-pointer"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-black text-white rounded-lg w-full cursor-pointer"
                                >
                                    Update
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditBlogModal;