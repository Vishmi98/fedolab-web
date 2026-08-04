/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UserModel from "@/models/user.model";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
    try {
        await connectDB();

        const users = await UserModel.find().sort({ createdAt: -1 }).lean();

        return sendSuccessResponse(
            "Users fetched successfully",
            { users }
        );
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return sendErrorResponse("Server error", 200);
    }
}
