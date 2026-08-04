import axios from "axios";

import { BlogsResponseDataType, BlogsResponseType, PublishBlogResponseDataType, SingleBlogResponseDataType, SingleBlogResponseType } from "./blogs.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getBlogs = async (page?: number, limit?: number): Promise<BlogsResponseDataType> => {
    const response: BlogsResponseType = await apiCall({
        url: `${URL}/blog/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        blogs: data.blogs || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalBlogs: data.totalBlogs ?? 0,
    };
};

export const publishBlog = async (id: number, isPublish: boolean): Promise<PublishBlogResponseDataType> => {
    const response: PublishBlogResponseDataType = await apiCall({
        url: `${URL}/blog/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const createBlog = async (data: FormData) => {
    const res = await axios.post(`${URL}/blog/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            blog: response.data,
        },
    };
};

export const updateBlog = async (data: FormData) => {
    const res = await axios.post(`${URL}/blog/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            blog: response.data,
        },
    };
};

export const getBlogByUrl = async (props: { url: string }): Promise<SingleBlogResponseType> => {
    const { url } = props;

    const response: SingleBlogResponseDataType = await apiCall({
        url: `${URL}/blog/get-by-url`,
        method: 'POST',
        body: { url },
    })

    return ({
        success: response.success,
        message: response.message,
        blog: response.data.blog
    });
};