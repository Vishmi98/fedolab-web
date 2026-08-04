"use client";

import React, { FC, useState, useRef } from "react";
import { toast } from "react-toastify";
import { BiLoader, BiTrash, BiUpload, BiErrorCircle } from "react-icons/bi";
import Image from "next/image";

import { ProjectModalProps } from "../../projects.types";
import { addImage } from "../../projects.service";

import { MAX_SIZE_MB } from "@/constants/data";
import CommonModal from "@/components/CommonModal";


const AddImagesModal: FC<ProjectModalProps> = ({
    isOpen,
    onClose,
    project,
    handleReload
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle multiple file selections with a strict maximum limit of 3
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);

        // Check if the total combined files would exceed 3
        if (selectedFiles.length + filesArray.length > 4) {
            toast.error("You can only upload a maximum of 3 gallery images per product.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        const validFiles: File[] = [];

        filesArray.forEach((file) => {
            if (file.size > MAX_SIZE_MB) {
                toast.error(`"${file.name}" exceeds the 1.1 MB size limit.`);
            } else {
                validFiles.push(file);
            }
        });

        setSelectedFiles((prev) => [...prev, ...validFiles]);

        // Reset input value so the same file can be re-selected if removed
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Remove an image from local state selection list
    const removeImage = (indexToRemove: number) => {
        setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    // Form submission to API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image to upload.");
            return;
        }

        if (selectedFiles.length > 3) {
            toast.error("Maximum limit exceeded. Please keep it to 3 images or fewer.");
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            formData.append("projectId", String(project.id));

            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            const res = await addImage(formData);

            if (res.success) {
                toast.success("Image uploaded successfully!");
                setSelectedFiles([]);
                handleReload();
                onClose();
            } else {
                toast.error(res.message || "Failed to upload images.");
            }
        } catch (error) {
            console.error("Gallery Upload Error:", error);
            toast.error("An error occurred while uploading gallery image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Add Images to: ${project.title}`}
            maxWidth="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
                {/* Drag and drop / selection zone */}
                <div
                    onClick={() => {
                        if (selectedFiles.length >= 3) {
                            toast.warning("Maximum of 3 images already selected. Remove one to add an alternative.");
                            return;
                        }
                        fileInputRef.current?.click();
                    }}
                    className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-colors ${selectedFiles.length >= 3
                        ? "border-gray-200 bg-gray-100/50 cursor-not-allowed opacity-60"
                        : "border-gray-300 hover:border-primary bg-gray-50/50 cursor-pointer"
                        }`}
                >
                    <BiUpload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                        {selectedFiles.length >= 3 ? "Maximum selections reached" : "Click to upload multiple images"}
                    </span>
                    <span className="text-xs text-gray-400">
                        PNG, JPG, WEBP up to 1.1MB each • **Max 3 images**
                    </span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        disabled={selectedFiles.length >= 3}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Visual Limit Warning Banner */}
                {selectedFiles.length > 3 && (
                    <div className="flex items-center gap-2 p-3 text-sm rounded-lg bg-amber-50 border border-amber-200 text-amber-800 animate-fadeIn">
                        <BiErrorCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                        <p className="font-medium">
                            Maximum upload capacity reached (3/3 images). You must remove a file if you wish to swap selections.
                        </p>
                    </div>
                )}

                {/* Previews section */}
                {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                            <span>Selected items:</span>
                            <span className={selectedFiles.length === 3 ? "text-amber-600 font-bold" : ""}>
                                {selectedFiles.length} / 3 images
                            </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto p-1 border border-gray-100 rounded-lg">
                            {selectedFiles.map((file, index) => {
                                const previewUrl = URL.createObjectURL(file);
                                return (
                                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={previewUrl}
                                            alt={`preview-${index}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow duration-200 hover:bg-red-600 cursor-pointer"
                                        >
                                            <BiTrash className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom Trigger Action Buttons */}
                <div className="flex gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full bg-gray-300 p-2 rounded hover:bg-gray-400/80 transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading || selectedFiles.length === 0 || selectedFiles.length > 3}
                        className="w-full bg-black text-white p-2 rounded flex justify-center items-center gap-2 hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <BiLoader className="animate-spin text-lg" />
                        ) : (
                            `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length}) ` : ""}Images`
                        )}
                    </button>
                </div>
            </form>
        </CommonModal>
    );
};

export default AddImagesModal;