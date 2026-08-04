"use client";

import React from "react";

const ProjectCardSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse space-y-3 mb-2 md:mb-5">
            {/* Image Skeleton */}
            <div className="w-full h-[320px] sm:h-[350px] md:h-[420px] lg:h-[480px] xl:h-[500px] 2xl:h-[600px] bg-gray-200 animate-pulse rounded-4xl" />

            {/* Title & Short Description Skeleton */}
            <div className="space-y-2 pt-1">
                <div className="h-6 bg-gray-200 animate-pulse rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded-md w-full" />
            </div>
        </div>
    );
};

export default ProjectCardSkeleton;