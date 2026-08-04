/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { ImageKitService } from "@/services/imagekit";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string;
    const client = formData.get("client") as string;

    const technologies = formData.getAll("technologies") as string[];

    const thumbnailImage = formData.get("thumbnailImage") as File | null;
    const coverImage = formData.get("coverImage") as File | null;

    if (
      !title?.trim() ||
      !slug?.trim() ||
      !category?.trim() ||
      !shortDescription?.trim() ||
      !description?.trim()
    ) {
      return sendErrorResponse("All required fields are required", 200);
    }

    const existingSlug = await ProjectModel.findOne({ slug });

    if (existingSlug) {
      return sendErrorResponse("Slug already exists", 200);
    }

    let thumbnailImagePath = "";
    let thumbnailImageId = "";

    let coverImagePath = "";
    let coverImageId = "";

    const uploadImage = async (file: File, folder: string) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      return await ImageKitService.uploadImage(buffer, filename, folder);
    };

    if (thumbnailImage) {
      const uploaded = await uploadImage(
        thumbnailImage,
        "fedo_projects/thumbnails"
      );
      thumbnailImagePath = uploaded.url;
      thumbnailImageId = uploaded.fileId;
    }

    if (coverImage) {
      const uploaded = await uploadImage(
        coverImage,
        "fedo_projects/covers"
      );
      coverImagePath = uploaded.url;
      coverImageId = uploaded.fileId;
    }

    const lastItem = await ProjectModel.findOne().sort({ id: -1 });
    const nextId = lastItem ? lastItem.id + 1 : 1;

    const project = await ProjectModel.create({
      id: nextId,
      title,
      slug,
      category,
      shortDescription,
      description,
      client,
      technologies,
      thumbnailImagePath,
      thumbnailImageId,
      coverImagePath,
      coverImageId
    });

    return sendSuccessResponse(
      "Project created successfully",
      { project }
    );
  } catch (error: any) {
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}