/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";
import { ImageKitService } from "@/services/imagekit";
import { clearProjectCache, deleteCache } from "@/lib/cache";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Validate Identification Inputs
        const projectIdStr = formData.get("projectId");
        const imagePath = formData.get("imagePath") as string;

        if (!projectIdStr || !imagePath) {
            return sendErrorResponse("Both project ID and image Path are required parameters.", 200);
        }

        const projectId = Number(projectIdStr);

        // 2. Locate the Target Item
        const targetProject = await ProjectModel.findOne({ id: projectId });
        if (!targetProject) {
            return sendErrorResponse("Target project does not exist.", 200);
        }

        // 3. Match Array Index to extract the corresponding ImageKit File ID
        const imageIndex = targetProject.imagePaths?.indexOf(imagePath);

        if (imageIndex === undefined || imageIndex === -1) {
            return sendErrorResponse("The specified image path does not exist on this project.", 200);
        }

        // Fetch corresponding imageId if the array exists and matches indexes
        const imageKitFileId = targetProject.imageIds?.[imageIndex];

        // 4. Remote Cloud Housekeeping (ImageKit Asset Deletion)
        if (imageKitFileId) {
            try {
                await ImageKitService.deleteImage(imageKitFileId);
            } catch (imageKitError) {
                console.error(`Failed to wipe asset file ${imageKitFileId} from ImageKit:`, imageKitError);
                // Non-blocking fallback: Continue with database cleanup even if cloud file was missing or pre-deleted
            }
        }

        // 5. Atomic Update to pull elements from MongoDB arrays
        // Pulls the imagePath and the imageId out of their respective arrays by matching values
        const updatePayload: any = {
            $pull: { imagePaths: imagePath }
        };

        if (imageKitFileId) {
            updatePayload.$pull.imageIds = imageKitFileId;
        }

        const updatedProject = await ProjectModel.findOneAndUpdate(
            { id: projectId },
            updatePayload,
            { new: true, runValidators: true }
        );

        // ==========================
        // Clear Redis Cache
        // ==========================
        await clearProjectCache();
        if (targetProject.slug) {
            await deleteCache(`project:slug:${targetProject.slug}`);
        }

        return sendSuccessResponse("Image removed successfully.", updatedProject);

    } catch (error: any) {
        console.error("Gallery Delete Route Error:", error);
        return sendErrorResponse("Internal Server Error processing image removal.", 200);
    }
}