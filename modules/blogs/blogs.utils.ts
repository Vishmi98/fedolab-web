import * as Yup from 'yup';

import { BlogType } from "./blogs.types";


export const addBlogInitialValues: BlogType = {
    id: 0,
    date: "",
    title: "",
    author: "",
    paragraph1: "",
    paragraph2: "",
    paragraph3: "",
    url: "",
    coverImagePath: "",
    coverImageId: ""
};

export const addBlogValidationSchema = Yup.object().shape({
    date: Yup.string()
        .required("Date is required")
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Invalid date format"
        ),
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Title is required"),
    url: Yup.string().required("Url is required"),
    paragraph1: Yup.string()
        .required("Paragraph 1 is required")
        .min(300, "Paragraph 1 must be at least 300 characters")
        .max(500, "Paragraph 1 cannot exceed 500 characters"),

    paragraph2: Yup.string()
        .min(300, "Paragraph 2 must be at least 300 characters")
        .max(500, "Paragraph 2 cannot exceed 500 characters"),

    paragraph3: Yup.string()
        .min(300, "Paragraph 3 must be at least 300 characters")
        .max(500, "Paragraph 3 cannot exceed 500 characters"),
});