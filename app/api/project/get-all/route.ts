/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCache, setCache } from "@/lib/cache";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;

        // -----------------------------
        // Paginated Projects
        // -----------------------------
        if (page && limit) {
            const cacheKey = `projects:page:${page}:limit:${limit}`;

            // Check Redis cache
            const cached = await getCache<any>(cacheKey);

            if (cached) {
                console.log("✅ Paginated Projects Cache HIT");

                return sendSuccessResponse(
                    "Projects fetched successfully (cache)",
                    cached
                );
            }

            console.log("❌ Paginated Projects Cache MISS");

            const totalProjects = await ProjectModel.countDocuments();
            const totalPages = Math.ceil(totalProjects / limit);
            const skip = (page - 1) * limit;

            const projects = await ProjectModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const responseData = {
                page,
                limit,
                totalPages,
                totalProjects,
                projects,
            };

            // Cache for 10 minutes
            await setCache(cacheKey, responseData, 600);

            return sendSuccessResponse(
                "Projects fetched successfully",
                responseData
            );
        }

        // -----------------------------
        // Published Projects
        // -----------------------------
        const cacheKey = "projects:published";

        // Check Redis cache
        const cached = await getCache<any>(cacheKey);

        if (cached) {
            console.log("✅ Published Projects Cache HIT");

            return sendSuccessResponse(
                "All projects fetched successfully (cache)",
                cached
            );
        }

        console.log("❌ Published Projects Cache MISS");

        const totalProjects = await ProjectModel.countDocuments({
            isPublish: true,
        });

        const projects = await ProjectModel.find({
            isPublish: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        const responseData = {
            totalProjects,
            projects,
        };

        // Cache for 10 minutes
        await setCache(cacheKey, responseData, 600);

        return sendSuccessResponse(
            "All projects fetched successfully",
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