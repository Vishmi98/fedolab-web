/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UserModel from "@/models/user.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { firstName, lastName, email, password, userType } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !userType) {
            return sendErrorResponse("All fields are required", 200);
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return sendErrorResponse("An account with this email already exists", 200);
        }

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password, // ⚠️ NOTE: You should hash this in production
            userType,
        });

        return sendSuccessResponse("User Created Successfully", { user });
    } catch (error: any) {
        console.error("Error creating user:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
