import mongoose, { Schema, Document, models, model } from "mongoose";

export interface INews extends Document {
    id: number;
    hnStoryId: number;
    title: string;
    slug: string;
    author: string;
    category: string;
    score: number;
    url: string;
    summary?: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    coverImagePath?: string;
    isPublish: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const newsSchema = new Schema<INews>(
    {
        id: { type: Number, required: true, unique: true },
        hnStoryId: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        author: { type: String, required: true },
        category: { type: String, default: "Tech" },
        score: { type: Number, default: 0 },
        url: { type: String, required: true },
        summary: { type: String },
        paragraph1: { type: String },
        paragraph2: { type: String },
        paragraph3: { type: String },
        coverImagePath: { type: String },
        isPublish: { type: Boolean, default: true },
        publishedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const NewsModel = models.News || model<INews>("News", newsSchema);

export default NewsModel;