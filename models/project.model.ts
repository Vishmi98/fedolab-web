import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        shortDescription: { type: String, required: true },
        description: { type: String, required: true },
        client: { type: String },
        technologies: [{ type: String }],
        thumbnailImagePath: { type: String },
        thumbnailImageId: { type: String },
        coverImagePath: { type: String },
        coverImageId: { type: String },
        imagePaths: { type: [String] },
        imageIds: { type: [String] },
        isPublish: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const ProjectModel =
    mongoose.models.Project || mongoose.model("Project", projectSchema);

export default ProjectModel;