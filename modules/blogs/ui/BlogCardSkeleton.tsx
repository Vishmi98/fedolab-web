"use client";

import React from "react";

const BlogCardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse space-y-4">
            {/* Image Skeleton */}
            <div className="w-full h-80 sm:h-96 md:h-100 bg-gray-200 animate-pulse rounded-4xl" />

            {/* Content Skeleton */}
            <div className="py-2 space-y-3">
                {/* Date & Author */}
                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/3" />

                {/* Title */}
                <div className="h-6 bg-gray-200 animate-pulse rounded-md w-3/4" />

                {/* Paragraph Preview Lines */}
                <div className="space-y-2 pt-1">
                    <div className="h-3.5 bg-gray-200 animate-pulse rounded-md w-full" />
                    <div className="h-3.5 bg-gray-200 animate-pulse rounded-md w-11/12" />
                </div>

                {/* Action Link Skeleton */}
                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-24 pt-2" />
            </div>
        </div>
    );
};

export default BlogCardSkeleton;