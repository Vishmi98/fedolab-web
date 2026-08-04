/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BlogModel from "@/models/blog.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { url } = body;

        if (!url) {
            return sendErrorResponse("URL required", 200);
        }

        const blog = await BlogModel.findOne({ url }).lean();

        if (!blog) {
            return sendErrorResponse("Blog not found for the given URL.", 200);
        }

        return sendSuccessResponse("Blog fetched Successfully", { blog });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
