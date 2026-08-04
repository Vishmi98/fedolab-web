/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCache, setCache } from "@/lib/cache";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BlogModel from "@/models/blog.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;

        // -----------------------------
        // Pagination
        // -----------------------------
        if (page && limit) {
            const cacheKey = `blogs:page:${page}:limit:${limit}`;

            // Check Redis first
            const cached = await getCache<any>(cacheKey);

            if (cached) {
                console.log("✅ Pagination Cache HIT");

                return sendSuccessResponse(
                    "Blogs fetched successfully (cache)",
                    cached
                );
            }

            console.log("❌ Pagination Cache MISS");

            const totalBlogs = await BlogModel.countDocuments();
            const totalPages = Math.ceil(totalBlogs / limit);
            const skip = (page - 1) * limit;

            const blogs = await BlogModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const responseData = {
                page,
                limit,
                totalPages,
                totalBlogs,
                blogs,
            };

            // Cache for 10 minutes
            await setCache(cacheKey, responseData, 600);

            return sendSuccessResponse(
                "Blogs fetched successfully",
                responseData
            );
        }

        // -----------------------------
        // Published Blogs
        // -----------------------------
        const cacheKey = "blogs:published";

        const cached = await getCache<any>(cacheKey);

        if (cached) {
            console.log("✅ Published Blogs Cache HIT");

            return sendSuccessResponse(
                "All blogs fetched successfully (cache)",
                cached
            );
        }

        console.log("❌ Published Blogs Cache MISS");

        const totalBlogs = await BlogModel.countDocuments({
            isPublish: true,
        });

        const blogs = await BlogModel.find({
            isPublish: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        const responseData = {
            totalBlogs,
            blogs,
        };

        // Cache for 10 minutes
        await setCache(cacheKey, responseData, 600);

        return sendSuccessResponse(
            "All blogs fetched successfully",
            responseData
        );
    } catch (error: any) {
        console.error(error);

        return sendErrorResponse(
            error?.message || "Unexpected error",
            200
        );
    }
}