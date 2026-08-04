/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { id, isPublish } = body;

        // Validate input
        if (id === undefined || isPublish === undefined) {
            return sendErrorResponse("Missing required fields: id or isPublish", 200);
        }

        // Find and update project
        const updatedProject = await ProjectModel.findOneAndUpdate(
            { id },
            { isPublish },
            { new: true }
        );

        if (!updatedProject) {
            return sendErrorResponse("Project not found", 200);
        }

        return sendSuccessResponse(
            `Project ${isPublish ? "published" : "unpublished"} successfully`,
            { project: updatedProject }
        );
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
