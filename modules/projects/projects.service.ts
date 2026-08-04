import axios from "axios";

import { ProjectsResponseDataType, ProjectsResponseType, PublishProjectResponseDataType, SingleProjectResponseDataType, SingleProjectResponseType } from "./projects.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getProjects = async (page?: number, limit?: number): Promise<ProjectsResponseDataType> => {
    const response: ProjectsResponseType = await apiCall({
        url: `${URL}/project/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        projects: data.projects || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalProjects: data.totalProjects ?? 0,
    };
};

export const publishProject = async (id: number, isPublish: boolean): Promise<PublishProjectResponseDataType> => {
    const response: PublishProjectResponseDataType = await apiCall({
        url: `${URL}/project/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const createProject = async (data: FormData) => {
    const res = await axios.post(`${URL}/project/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            project: response.data,
        },
    };
};

export const updateProject = async (data: FormData) => {
    const res = await axios.post(`${URL}/project/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            project: response.data,
        },
    };
};

export const getProjectByUrl = async (props: { slug: string }): Promise<SingleProjectResponseType> => {
    const { slug } = props;

    const response: SingleProjectResponseDataType = await apiCall({
        url: `${URL}/project/get-by-url`,
        method: 'POST',
        body: { slug },
    })

    return ({
        success: response.success,
        message: response.message,
        project: response.data.project
    });
};

export const addImage = async (data: FormData) => {
    const res = await axios.post(`${URL}/project/add-image`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            updatedProject: response.data,
        },
    };
};

export const deleteImage = async (data: FormData) => {
    const res = await axios.post(`${URL}/project/delete-image`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            updatedProject: response.data,
        },
    };
};