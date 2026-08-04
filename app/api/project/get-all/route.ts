/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));

        const { page, limit } = body;

        const totalProjects = await ProjectModel.countDocuments();

        let projects;

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalProjects / limit);

            projects = await ProjectModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse(
                "Projects fetched successfully",
                {
                    page,
                    limit,
                    totalPages,
                    totalProjects,
                    projects,
                }
            );
        }

        projects = await ProjectModel.find({
            isPublish: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse(
            "All projects fetched successfully",
            {
                totalProjects,
                projects,
            }
        );
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}