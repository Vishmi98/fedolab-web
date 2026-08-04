import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";
import { ImageKitService } from "@/services/imagekit";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Validate Project Identification
        const projectIdStr = formData.get("projectId");
        if (!projectIdStr) {
            return sendErrorResponse("Project ID is required.", 200);
        }
        const projectId = Number(projectIdStr);

        // Find the target document
        const targetProject = await ProjectModel.findOne({ id: projectId });
        if (!targetProject) {
            return sendErrorResponse("Target project does not exist.", 200);
        }

        // 2. Extract and Filter Inbound Images
        // Enforces pulling files regardless of whether frontend appended via repeated standard keys or individual keys
        const incomingFiles = formData.getAll("images") as File[];
        const validFiles = incomingFiles.filter(
            (file) => file instanceof File && file.size > 0
        );

        if (validFiles.length === 0) {
            return sendErrorResponse("Please select at least one image to upload.", 200);
        }

        // 3. Enforce Strict Maximum Cap Rule (Max 3 Total)
        const existingCount = targetProject.imagePaths?.length || 0;
        const potentialTotalCount = existingCount + validFiles.length;

        if (potentialTotalCount > 3) {
            return sendErrorResponse(
                `Upload rejected. A project can have a maximum of 3 gallery images. This project already has ${existingCount} image(s), meaning you can only add ${3 - existingCount} more.`,
                200
            );
        }

        const uploadedPaths: string[] = [];
        const uploadedIds: string[] = [];

        // 4. Sequence Process Uploads to ImageKit Buffer Stream
        for (const file of validFiles) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

                const uploadedAsset = await ImageKitService.uploadImage(
                    buffer,
                    filename,
                    "fedo_projects/gallery"
                );

                uploadedPaths.push(uploadedAsset.url);
                uploadedIds.push(uploadedAsset.fileId);
            } catch (uploadError) {
                console.error(`Failed to push asset file ${file.name} to ImageKit:`, uploadError);

                // Rollback strategy: Clean up already uploaded assets during this partial failure block
                if (uploadedIds.length > 0) {
                    for (const id of uploadedIds) {
                        try {
                            await ImageKitService.deleteImage(id); // Assumes delete method exists in your service
                        } catch (delErr) {
                            console.error(`Rollback failed to delete asset ID: ${id}`, delErr);
                        }
                    }
                }
                return sendErrorResponse(`Image upload pipeline failed during processing of: ${file.name}`, 200);
            }
        }

        // 5. Atomic Safe Push Array Values straight into MongoDB Document
        const updatedItem = await ProjectModel.findOneAndUpdate(
            { id: projectId },
            {
                $push: {
                    imagePaths: { $each: uploadedPaths },
                    imageIds: { $each: uploadedIds }
                }
            },
            { new: true, runValidators: true }
        );

        return sendSuccessResponse("Images added successfully.", updatedItem);

    } catch (error) {
        console.error("Gallery Upload Route Error:", error);
        return sendErrorResponse("Internal Server Error processing image upload.", 200);
    }
}