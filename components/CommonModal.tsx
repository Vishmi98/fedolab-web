"use client";

import React, { FC } from "react";
import { CgClose } from "react-icons/cg";

import { CommonModalProps } from "@/constants/types";


const CommonModal: FC<CommonModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-xl",
}) => {
    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-lg w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col mx-3`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold w-[90%]">{title}</h2>

                    <CgClose
                        className="w-4 h-4 cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                {/* Body */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default CommonModal;