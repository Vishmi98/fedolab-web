/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { CgClose } from "react-icons/cg";
import { RiCloseLine } from "react-icons/ri";

import { createProject } from "../../projects.service";
import {
    addProjectInitialValues,
    addProjectValidationSchema,
} from "../../projects.utils";
import { ProjectType } from "../../projects.types";

import { MAX_SIZE_MB } from "@/constants/data";
import CropModal from "@/components/ImageCropper";
import { AddModalProps } from "@/constants/types";


const AddProjectModal: FC<AddModalProps> = ({
    isOpen,
    onClose,
    handleReload,
}) => {
    const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [techInput, setTechInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Crop modal state
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);
    const [cropFor, setCropFor] = useState<"thumbnail" | "cover">("thumbnail");

    // Handle image selection
    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        type: "thumbnail" | "cover"
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_SIZE_MB) {
            toast.error(`Please upload a ${type} image smaller than 1.1 MB.`);
            return;
        }

        setTempImageFile(file);
        setCropFor(type);
        setIsCropOpen(true);
    };

    // Handle finished crop operation
    const handleCropComplete = (croppedFile: File) => {
        if (cropFor === "thumbnail") {
            setThumbnailImage(croppedFile);
        } else {
            setCoverImage(croppedFile);
        }

        setTempImageFile(null);
        setIsCropOpen(false);
    };

    // Auto-generate slug from title
    const handleTitleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const title = e.target.value;
        setFieldValue("title", title);

        const generatedSlug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        setFieldValue("slug", generatedSlug);
    };

    // Form submission logic
    const handleSubmit = async (
        values: ProjectType,
        {
            resetForm,
            setSubmitting,
        }: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("slug", values.slug);
            formData.append("category", values.category);
            formData.append("shortDescription", values.shortDescription);
            formData.append("description", values.description);
            formData.append("client", values.client || "");

            // Append array items for technologies
            values.technologies.forEach((tech: string) => {
                formData.append("technologies", tech);
            });

            if (thumbnailImage) {
                formData.append("thumbnailImage", thumbnailImage);
            }

            if (coverImage) {
                formData.append("coverImage", coverImage);
            }

            const response = await createProject(formData);

            if (response.success) {
                toast.success(response.message || "Project created successfully");
                resetForm();
                setThumbnailImage(null);
                setCoverImage(null);
                setTimeout(() => {
                    onClose();
                    handleReload();
                }, 300);
            } else {
                toast.error(response.message || "Failed to create project");
            }
        } catch (error) {
            toast.error("An error occurred while adding the project.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold">Add New Project</h2>
                    <CgClose className="w-4 h-4 cursor-pointer" onClick={onClose} />
                </div>

                {/* Form Body */}
                <Formik
                    initialValues={addProjectInitialValues}
                    validationSchema={addProjectValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="flex flex-col gap-4 h-[60vh] overflow-y-auto p-4">
                                {/* Title & Slug Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm">
                                            Title
                                            <Field
                                                name="title"
                                                type="text"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleTitleChange(e, setFieldValue)
                                                }
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full "
                                            />
                                            <ErrorMessage
                                                name="title"
                                                component="div"
                                                className="text-red-600 text-xs"
                                            />
                                        </label>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm">
                                            Slug
                                            <Field
                                                name="slug"
                                                type="text"
                                                placeholder="e.g. e-commerce-platform"
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full "
                                            />
                                            <ErrorMessage
                                                name="slug"
                                                component="div"
                                                className="text-red-600 text-xs"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Category & Client Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm">
                                            Category
                                            <Field
                                                name="category"
                                                type="text"
                                                placeholder="e.g. Web Development"
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full "
                                            />
                                            <ErrorMessage
                                                name="category"
                                                component="div"
                                                className="text-red-600 text-xs"
                                            />
                                        </label>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-sm">
                                            Client
                                            <Field
                                                name="client"
                                                type="text"
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full "
                                            />
                                            <ErrorMessage
                                                name="client"
                                                component="div"
                                                className="text-red-600 text-xs"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Short Description */}
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm">
                                            Short Description
                                        </label>
                                        <span className="text-xs text-gray-400">
                                            {values.shortDescription.length}/250 (Min: 50)
                                        </span>
                                    </div>
                                    <Field
                                        as="textarea"
                                        name="shortDescription"
                                        rows={2}
                                        className="border border-gray-300 rounded-md text-sm p-2 w-full focus:outline-none focus:ring-1 focus:ring-black resize-none"
                                    />
                                    <ErrorMessage
                                        name="shortDescription"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </div>

                                {/* Full Description */}
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm">
                                            Description
                                        </label>
                                        <span className="text-xs text-gray-400">
                                            {values.description.length} chars (Min: 500)
                                        </span>
                                    </div>
                                    <Field
                                        as="textarea"
                                        name="description"
                                        rows={4}
                                        className="border border-gray-300 rounded-md text-sm p-2 w-full focus:outline-none focus:ring-1 focus:ring-black resize-y"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </div>

                                {/* Technologies Tag Field */}
                                <div className="flex flex-col">
                                    <label className="text-sm">
                                        Technologies
                                    </label>
                                    <FieldArray name="technologies">
                                        {({ push, remove }) => (
                                            <div>
                                                <div className="flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        value={techInput}
                                                        onChange={(e) => setTechInput(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                if (techInput.trim()) {
                                                                    push(techInput.trim());
                                                                    setTechInput("");
                                                                }
                                                            }
                                                        }}
                                                        placeholder="Type tech (e.g. Next.js) and press Enter"
                                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full "
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (techInput.trim()) {
                                                                push(techInput.trim());
                                                                setTechInput("");
                                                            }
                                                        }}
                                                        className="text-xs text-white bg-black px-3 py-1 rounded cursor-pointer"
                                                    >
                                                        Add
                                                    </button>
                                                </div>

                                                {/* Selected Tech Chips */}
                                                {values.technologies.length > 0 && (
                                                    values.technologies.map((tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-200 mr-1"
                                                        >
                                                            {tech}
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="hover:text-red-300"
                                                            >
                                                                <RiCloseLine className="w-3.5 h-3.5" />
                                                            </button>
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </FieldArray>
                                    <ErrorMessage
                                        name="technologies"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </div>

                                {/* Images Upload Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Thumbnail Image */}
                                    <div className="flex flex-col">
                                        <label className="text-sm">
                                            Thumbnail Image (≤ 1.1 MB)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, "thumbnail")}
                                            className="block w-full text-xs text-gray-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                        />
                                        {thumbnailImage && (
                                            <div className="mt-2 relative w-32 h-24 rounded-md overflow-hidden border">
                                                <Image
                                                    src={URL.createObjectURL(thumbnailImage)}
                                                    alt="Thumbnail Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Cover Image */}
                                    <div className="flex flex-col">
                                        <label className="text-sm">
                                            Cover Image (≤ 1.1 MB)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, "cover")}
                                            className="block w-full text-xs text-gray-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                        />
                                        {coverImage && (
                                            <div className="mt-2 relative w-full h-24 rounded-md overflow-hidden border">
                                                <Image
                                                    src={URL.createObjectURL(coverImage)}
                                                    alt="Cover Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Crop Modal */}
                            {isCropOpen && tempImageFile && (
                                <CropModal
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={cropFor === "thumbnail" ? 250 : 500}
                                    cropHeight={cropFor === "thumbnail" ? 230 : 250}
                                />
                            )}

                            {/* Actions Footer */}
                            <div className="flex justify-end space-x-2 p-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm bg-gray-300 rounded-lg w-full cursor-pointer"
                                    onClick={onClose}
                                    disabled={isLoading || isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isLoading || isSubmitting}
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-black text-white rounded-lg w-full cursor-pointer"
                                >
                                    {isLoading || isSubmitting ? "Creating..." : "Add Project"}
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

export default AddProjectModal;