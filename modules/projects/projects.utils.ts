import * as Yup from "yup";

import { ProjectType } from "./projects.types";


export const addProjectInitialValues: ProjectType = {
    id: 0,
    title: "",
    slug: "",
    category: "",
    shortDescription: "",
    description: "",
    client: "",
    technologies: [],
    thumbnailImagePath: "",
    thumbnailImageId: "",
    coverImagePath: "",
    coverImageId: "",
    imagePaths: [],
    imageIds: [],
};

export const addProjectValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required"),

    slug: Yup.string()
        .required("Slug is required"),

    category: Yup.string()
        .required("Category is required"),

    shortDescription: Yup.string()
        .required("Short description is required")
        .min(50, "Short description must be at least 50 characters")
        .max(250, "Short description cannot exceed 250 characters"),

    description: Yup.string()
        .required("Description is required")
        .min(500, "Description must be at least 500 characters"),

    client: Yup.string(),

    technologies: Yup.array()
        .of(Yup.string().required())
        .min(1, "At least one technology is required"),
});