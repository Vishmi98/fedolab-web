/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCache, setCache } from "@/lib/cache";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { slug } = body;

        if (!slug) {
            return sendErrorResponse("Slug required", 200);
        }

        const cacheKey = `project:slug:${slug}`;

        // Check Redis cache first
        const cachedProject = await getCache<any>(cacheKey);

        if (cachedProject) {
            console.log("✅ Get Project by Slug Cache HIT");
            return sendSuccessResponse("Project fetched Successfully (cache)", {
                project: cachedProject,
            });
        }

        console.log("❌ Get Project by Slug Cache MISS");

        const project = await ProjectModel.findOne({ slug }).lean();

        if (!project) {
            return sendErrorResponse("Project not found for the given slug.", 200);
        }

        // Cache for 10 minutes
        await setCache(cacheKey, project, 600);

        return sendSuccessResponse("Project fetched Successfully", { project });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}