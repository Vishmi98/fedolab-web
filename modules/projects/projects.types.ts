export type ProjectDataType = {
    id: number;
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    description: string;
    client?: string;
    technologies: string[];
    thumbnailImagePath: string;
    thumbnailImageId: string;
    coverImagePath: string;
    coverImageId: string;
    imagePaths: string[];
    imageIds: string[];
    isPublish: boolean;
};

export type ProjectType = {
    id: number;
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    description: string;
    client?: string;
    technologies: string[];
    thumbnailImagePath: string;
    thumbnailImageId: string;
    coverImagePath: string;
    coverImageId: string;
    imagePaths: string[];
    imageIds: string[];
};

export type ProjectsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalProjects: number;
    projects: ProjectDataType[];
}

export type ProjectsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalProjects: number;
        projects: ProjectDataType[];
    }
}

export type CreateProjectResponseDataType = {
    success: boolean;
    message: string;
    data: {
        project: ProjectType;
    }
}

export type CreateProjectResponseType = {
    success: boolean;
    message: string;
    data: ProjectType;
}

export type ProjectResponseDataType = {
    success: boolean;
    message: string;
    data: ProjectDataType
}

export type ProjectResponseType = {
    success: boolean;
    message: string;
    project: ProjectDataType | null;
}

export type PublishProjectResponseDataType = {
    success: boolean;
    message: string;
    data: ProjectType;
}

export type EditProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: ProjectType | null;
}

export type SingleProjectResponseDataType = {
    success: boolean;
    message: string;
    data: {
        project: ProjectDataType;
    };
}

export type SingleProjectResponseType = {
    success: boolean;
    message: string;
    project: ProjectDataType | null;
}

export interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: ProjectDataType;
    handleReload: () => void;
}