/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import UserModel from "@/models/user.model";
import { EmailService } from "@/services/email.service";
import { generateAlphanumericVerificationCode } from "@/utils/user.util";
import PinModel from "@/models/pin.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return sendErrorResponse("Email is required", 200);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await UserModel.findOne({ email: normalizedEmail });

        if (!user) {
            return sendErrorResponse("User not found", 200);
        }

        const pin = generateAlphanumericVerificationCode();

        await PinModel.create({
            email: normalizedEmail,
            code: pin,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });

        const emailSuccess = await EmailService.sendVerificationEmail(normalizedEmail, pin);

        if (!emailSuccess) {
            return sendErrorResponse("Failed to send verification email", 200);
        }

        return sendSuccessResponse(
            "Verification code sent to email",
            {
                email: normalizedEmail,
            }
        );
    } catch (error: any) {
        console.error("Login request error:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
