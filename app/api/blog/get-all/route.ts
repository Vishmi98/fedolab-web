/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BlogModel from "@/models/blog.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({})); // Fallback for empty body
        const { page, limit } = body;

        let blogs;
        const totalBlogs = await BlogModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalBlogs / limit);

            blogs = await BlogModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse(
                "Blogs fetched successfully",
                {
                    page,
                    limit,
                    totalPages,
                    totalBlogs,
                    blogs,
                },
            );
        } else {
            blogs = await BlogModel.find({ isPublish: true }).sort({ createdAt: -1 }).lean();

            return sendSuccessResponse(
                "All blogs fetched successfully", {
                totalBlogs,
                blogs,
            },
            );
        }
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
