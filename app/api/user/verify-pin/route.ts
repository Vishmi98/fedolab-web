/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { generateUserToken } from "@/utils/jwt";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import PinModel from "@/models/pin.model";
import UserModel from "@/models/user.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email, pin } = await req.json();

        if (!email || !pin) {
            return sendErrorResponse("Email and PIN are required", 200);
        }

        const normalizedEmail = email.trim().toLowerCase();

        const pinRecord = await PinModel.findOne({
            email: normalizedEmail,
            code: pin,
            isUserLog: false,
        });

        if (!pinRecord) {
            return sendErrorResponse("Invalid or used PIN", 200);
        }

        // Check expiration using expiresAt field
        if (new Date() > pinRecord.expiresAt) {
            return sendErrorResponse("PIN expired", 200);
        }

        const user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            return sendErrorResponse("User not found", 200);
        }

        // Mark the pin as used
        pinRecord.isUserLog = true;
        await pinRecord.save();

        // Generate JWT token
        const token = generateUserToken({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userType: user.userType,
            phoneNumber: user.phoneNumber,
        });

        return sendSuccessResponse(
            "PIN verified successfully",
            {
                token
            }
        );
    } catch (error: any) {
        console.error("Verify PIN error:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
