/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
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

        const project = await ProjectModel.findOne({ slug }).lean();

        if (!project) {
            return sendErrorResponse("Project not found for the given slug.", 200);
        }

        return sendSuccessResponse("Project fetched Successfully", { project });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
