/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ContactUsModel from "@/models/contactUs.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({})); // Fallback for empty body
        const { page, limit } = body;

        let leads;
        const totalLeads = await ContactUsModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalLeads / limit);

            leads = await ContactUsModel.find()
                .sort({ createDate: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse(
                "Leads fetched successfully",
                {
                    page,
                    limit,
                    totalPages,
                    totalLeads,
                    leads,
                },
            );
        } else {
            leads = await ContactUsModel.find().sort({ createDate: -1 }).lean();

            return sendSuccessResponse(
                "All leads fetched successfully", {
                totalLeads,
                leads,
            },
            );
        }
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
