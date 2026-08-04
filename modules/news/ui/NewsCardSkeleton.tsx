"use client";

import { motion } from "framer-motion";

export default function NewsCardSkeleton() {
    return (
        <motion.article
            className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-gray-50 h-full animate-pulse"
        >
            {/* Image Skeleton */}
            <div className="flex-shrink-0 w-full md:w-50 h-44 bg-gray-200 animate-pulse rounded-lg" />

            {/* Content Skeleton */}
            <div className="flex flex-col flex-grow py-2 w-full">

                {/* Source Tag */}
                <div className="mb-3">
                    <div className="h-5 w-24 bg-gray-200 animate-pulse rounded-sm" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-7 bg-gray-200 animate-pulse rounded w-full" />
                    <div className="h-7 bg-gray-200 animate-pulse rounded w-4/5" />
                </div>

                {/* Description */}
                <div className="mt-3 space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                </div>

                {/* Date */}
                <div className="mt-5">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
                </div>

            </div>
        </motion.article>
    );
}