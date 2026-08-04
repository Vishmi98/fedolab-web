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

    const date = formData.get("date") as string;
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const paragraph1 = formData.get("paragraph1") as string;
    const paragraph2 = formData.get("paragraph2") as string;
    const paragraph3 = formData.get("paragraph3") as string;
    const url = formData.get("url") as string;

    const coverImage = formData.get("coverImage") as File | null;

    if (!date?.trim() || !title?.trim() || !paragraph1?.trim() || !url?.trim()) {
      return sendErrorResponse("All fields are required", 200);
    }

    // ✅ Initialize image variables
    let coverImagePath = "";
    let coverImageId = "";

    // ✅ Upload cover image if provided
    if (coverImage) {
      const buffer = Buffer.from(await coverImage.arrayBuffer());
      const filename = `${Date.now()}-${coverImage.name}`;
      const uploaded = await ImageKitService.uploadImage(buffer, filename, "fedo_blogs/covers");
      coverImagePath = uploaded.url;
      coverImageId = uploaded.fileId;
    }

    const lastItem = await BlogModel.findOne().sort({ id: -1 });
    const nextId = lastItem ? lastItem.id + 1 : 1;

    const blog = await BlogModel.create({
      id: nextId,
      date,
      title,
      author,
      paragraph1,
      paragraph2,
      paragraph3,
      url,
      coverImagePath,
      coverImageId,
    });

    return sendSuccessResponse("Blog Created Successfully", { blog });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}
