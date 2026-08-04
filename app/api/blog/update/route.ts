/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { ImageKitService } from "@/services/imagekit";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BlogModel from "@/models/blog.model";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    // 1. Identify Target Resource
    const blogIdStr = formData.get("blogId") || formData.get("id");
    if (!blogIdStr) {
      return sendErrorResponse("Valid item Identification (blogId/id) is required.", 200);
    }
    const blogId = Number(blogIdStr);

    const blog = await BlogModel.findOne({ id: blogId });
    if (!blog) {
      return sendErrorResponse("Blog not found", 200);
    }

    // Text fields
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const date = formData.get("date") as string;
    const paragraph1 = formData.get("paragraph1") as string;
    const paragraph2 = formData.get("paragraph2") as string;
    const paragraph3 = formData.get("paragraph3") as string;
    const url = formData.get("url") as string;

    // Images
    const coverImage = formData.get("coverImage") as File | null;

    // Store updated paths & IDs
    let coverImagePath = blog.coverImagePath;
    let coverImageId = blog.coverImageId;

    const uploadToImageKit = async (file: File, folder: string) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      return await ImageKitService.uploadImage(buffer, filename, folder);
    };

    // Handle cover image
    if (coverImage) {
      if (coverImageId) {
        await ImageKitService.deleteImage(coverImageId);
      }
      const uploaded = await uploadToImageKit(coverImage, "fedo_blogs/covers");
      coverImagePath = uploaded.url;
      coverImageId = uploaded.fileId;
    }

    // Update blog document
    blog.title = title || blog.title;
    blog.author = author || blog.author;
    blog.date = date || blog.date;
    blog.paragraph1 = paragraph1 || blog.paragraph1;
    blog.paragraph2 = paragraph2 || blog.paragraph2;
    blog.paragraph3 = paragraph3 || blog.paragraph3;
    blog.url = url || blog.url;
    blog.coverImagePath = coverImagePath;
    blog.coverImageId = coverImageId;

    await blog.save();

    return sendSuccessResponse(
      "Blog updated successfully",
      {
        blog,
      }
    );
  } catch (error: any) {
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}

