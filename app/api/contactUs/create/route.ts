import { NextRequest } from 'next/server';

import ContactUsModel from '@/models/contactUs.model';
import { connectDB } from '@/lib/mongodb';
import { sendErrorResponse, sendSuccessResponse } from '@/services/apiResponse';
import { EmailService } from '@/services/email.service';


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();

        const {
            name,
            email,
            subject,
            phoneNo,
            message,
        } = body;

        if (
            !name ||
            !email ||
            !phoneNo ||
            !message
        ) {
            return sendErrorResponse('Missing required fields', 200);
        }

        const last = await ContactUsModel.findOne().sort({ id: -1 });
        const nextId = last ? last.id + 1 : 1;

        const lead = await ContactUsModel.create({
            id: nextId,
            name,
            email,
            phoneNo,
            subject,
            message,
            createDate: new Date(),
            updatedDate: new Date(),
        });

        await EmailService.sendThankYouEmail(lead.email)
        await EmailService.forwardMessageToAdmin(lead.email, lead.name, lead.message)

        return sendSuccessResponse('Lead created successfully', { lead });
    } catch (error) {
        console.error("Server error", error);
        return sendErrorResponse("Server error");
    }
}
