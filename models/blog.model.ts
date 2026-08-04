import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        date: { type: String, required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        paragraph1: { type: String, required: true },
        paragraph2: { type: String },
        paragraph3: { type: String },
        url: { type: String, required: true },
        coverImagePath: { type: String },
        coverImageId: { type: String },
        isPublish: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const BlogModel =
    mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default BlogModel;