/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCache, setCache } from "@/lib/cache";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BlogModel from "@/models/blog.model";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return sendErrorResponse("URL required", 200);
        }

        // Redis cache key
        const cacheKey = `blog:url:${url}`;

        // Check Redis first
        const cachedBlog = await getCache<any>(cacheKey);

        if (cachedBlog) {
            console.log("✅ Get Blog by Url Cache HIT");

            return sendSuccessResponse(
                "Blog fetched successfully (cache)",
                { blog: cachedBlog }
            );
        }

        console.log("❌ Get Blog by Url Cache MISS");

        // Connect MongoDB only on cache miss
        await connectDB();

        const blog = await BlogModel.findOne({ url }).lean();

        if (!blog) {
            return sendErrorResponse(
                "Blog not found for the given URL.",
                200
            );
        }

        // Cache for 1 hour (3600 seconds)
        await setCache(cacheKey, blog, 3600);

        return sendSuccessResponse(
            "Blog fetched successfully",
            { blog }
        );

    } catch (error: any) {
        console.error(error);

        return sendErrorResponse(
            error?.message || "Unexpected error",
            200
        );
    }
}