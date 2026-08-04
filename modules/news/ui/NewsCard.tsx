"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Assuming GNewsItem is extended to include author and category for this design
import { GNewsItem } from "../news.types";

interface Props {
    news: GNewsItem;
    onImageError: (id: string) => void;
}

export default function NewsCard({ news, onImageError }: Props) {
    if (!news.image) {
        return null;
    }

    // Helper function to format the date like "Jul 28, 2026"
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Link href={`/news/${news.id}`}>
            {/* Container holding image and text */}
            <motion.article
                whileHover={{ y: -4 }}
                className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-gray-50 transition-all duration-300 h-full"
            >
                {/* 1. The Image Section (Left) */}
                <div className="flex-shrink-0 w-full md:w-50 h-44 overflow-hidden">
                    <img
                        src={news.image}
                        alt={news.title}
                        className="h-full w-full object-cover"
                        onError={() => onImageError(news.id)}
                    />
                </div>

                {/* 2. The Text Section (Right) */}
                <div className="flex flex-col flex-grow py-2">
                    {/* Category/Source Tag (Matches 'TELEVISION' tag) */}
                    <div className="mb-3">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 uppercase tracking-wider rounded-sm">
                            {/* Prioritize category if available, otherwise use source name */}
                            {news.source.name}
                        </span>
                    </div>

                    {/* Title (Matches 'Domain opens...' title) */}
                    <h2 className="text-2xl font-bold text-gray-950 leading-tight line-clamp-2">
                        {news.title}
                    </h2>

                    {/* Description (Matches 'Viewers can explore...' description) */}
                    <p className="mt-2 text-gray-600 leading-relaxed line-clamp-2">
                        {news.description}
                    </p>

                    {/* Footer: Author and Date (Matches 'by Tom Gosby...') */}
                    <div className="mt-4 text-sm text-gray-900">
                        {/*  */}
                        <span className="text-gray-950">
                            {" "}
                            — {formatDate(news.publishedAt)}
                        </span>
                    </div>
                </div>
            </motion.article>
        </Link>
    );
}