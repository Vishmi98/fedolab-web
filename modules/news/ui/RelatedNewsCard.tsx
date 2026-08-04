"use client";

import Link from "next/link";
import { useState } from "react";

import { GNewsItem } from "../news.types";


interface Props {
    item: GNewsItem;
}

export default function RelatedNewsCard({ item }: Props) {
    const [imageError, setImageError] = useState(false);

    if (!item.image || imageError) {
        return null;
    }

    return (
        <Link
            href={`/news/${item.id}`}
            className="group flex gap-4 items-start"
        >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImageError(true)}
                />
            </div>

            <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-blue-600 block mb-1">
                    {item.source.name}
                </span>

                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                    {item.title}
                </h3>

                <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                    {item.description}
                </p>
            </div>
        </Link>
    );
}