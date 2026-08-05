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
            return sendErrorResponse("Missing required fields: id or isPublish", 200);
        }

        // Update publish status
        const updatedBlog = await BlogModel.findOneAndUpdate(
            { id },
            { isPublish },
            { new: true }
        );

        if (!updatedBlog) {
            return sendErrorResponse("Blog not found", 200);
        }

        // ==========================
        // Clear Redis Cache
        // ==========================
        await clearBlogCache();
        if (updatedBlog.url) {
            await deleteCache(`blog:url:${updatedBlog.url}`);
        }

        return sendSuccessResponse(
            `Blog ${isPublish ? "published" : "unpublished"} successfully`,
            { blog: updatedBlog }
        );
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}