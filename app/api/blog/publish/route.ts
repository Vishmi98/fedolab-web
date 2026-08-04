/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { clearBlogCache, deleteCache } from "@/lib/cache";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BlogModel from "@/models/blog.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const { id, isPublish } = body;

        // Validate input
        if (id === undefined || isPublish === undefined) {
            return sendErrorResponse(
                "Missing required fields: id or isPublish",
                200
            );
        }

        // Find blog first (needed for cache key)
        const blog = await BlogModel.findOne({ id });

        if (!blog) {
            return sendErrorResponse(
                "Blog not found",
                200
            );
        }

        const blogUrl = blog.url;

        // Update publish status
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { id },
            {
                isPublish,
            },
            {
                new: true,
            }
        );

        if (!updatedBlog) {
            return sendErrorResponse(
                "Blog not found",
                200
            );
        }

        // ===========================
        // Redis Cache Invalidation
        // ===========================

        // Remove single blog cache
        await deleteCache(
            `blog:url:${blogUrl}`
        );

        // Remove blog listing caches
        await clearBlogCache();

        return sendSuccessResponse(
            `Blog ${isPublish ? "published" : "unpublished"
            } successfully`,
            {
                blog: updatedBlog,
            }
        );
    } catch (error: any) {
        console.error(
            "Publish Blog Error:",
            error
        );
        return sendErrorResponse(
            error?.message || "Unexpected error",
            200
        );
    }
}