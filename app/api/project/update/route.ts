/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { ImageKitService } from "@/services/imagekit";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProjectModel from "@/models/project.model";
import { clearProjectCache, deleteCache } from "@/lib/cache";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const projectIdStr =
      formData.get("projectId") || formData.get("id");

    if (!projectIdStr) {
      return sendErrorResponse(
        "Valid projectId/id is required",
        200
      );
    }

    const projectId = Number(projectIdStr);

    const project = await ProjectModel.findOne({
      id: projectId,
    });

    if (!project) {
      return sendErrorResponse(
        "Project not found",
        200
      );
    }

    const oldSlug = project.slug;

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const description = formData.get("description") as string;
    const client = formData.get("client") as string;

    const technologies = formData.getAll("technologies") as string[];

    const thumbnailImage =
      formData.get("thumbnailImage") as File | null;

    const coverImage =
      formData.get("coverImage") as File | null;

    const uploadImage = async (
      file: File,
      folder: string
    ) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      const filename = `${Date.now()}-${file.name}`;

      return await ImageKitService.uploadImage(
        buffer,
        filename,
        folder
      );
    };

    // Thumbnail

    if (thumbnailImage) {
      if (project.thumbnailImageId) {
        await ImageKitService.deleteImage(
          project.thumbnailImageId
        );
      }

      const uploaded = await uploadImage(
        thumbnailImage,
        "fedo_projects/thumbnails"
      );

      project.thumbnailImagePath = uploaded.url;
      project.thumbnailImageId = uploaded.fileId;
    }

    // Cover

    if (coverImage) {
      if (project.coverImageId) {
        await ImageKitService.deleteImage(
          project.coverImageId
        );
      }

      const uploaded = await uploadImage(
        coverImage,
        "fedo_projects/covers"
      );

      project.coverImagePath = uploaded.url;
      project.coverImageId = uploaded.fileId;
    }

    if (slug && slug !== project.slug) {
      const existing = await ProjectModel.findOne({
        slug,
        id: { $ne: project.id },
      });

      if (existing) {
        return sendErrorResponse(
          "Slug already exists",
          200
        );
      }

      project.slug = slug;
    }

    project.title = title || project.title;
    project.category = category || project.category;
    project.shortDescription =
      shortDescription || project.shortDescription;
    project.description =
      description || project.description;
    project.client = client || project.client;

    if (technologies.length > 0) {
      project.technologies = technologies;
    }

    await project.save();

    // ==========================
    // Clear Redis Cache
    // ==========================
    await clearProjectCache();
    if (oldSlug) {
      await deleteCache(`project:slug:${oldSlug}`);
    }
    if (project.slug && project.slug !== oldSlug) {
      await deleteCache(`project:slug:${project.slug}`);
    }

    return sendSuccessResponse(
      "Project updated successfully",
      { project }
    );
  } catch (error: any) {
    return sendErrorResponse(
      error?.message || "Unexpected error",
      200
    );
  }
}