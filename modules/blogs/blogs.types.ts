export type BlogType = {
    id: number;
    date: string;
    title: string;
    author: string;
    coverImagePath: string;
    coverImageId: string;
    url: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
}

export type BlogDataType = {
    id: number;
    date: string;
    title: string;
    author: string;
    url: string;
    coverImagePath: string;
    coverImageId: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    isPublish: boolean;
}

export type BlogsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalBlogs: number;
    blogs: BlogDataType[];
}

export type BlogsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalBlogs: number;
        blogs: BlogDataType[];
    }
}

export type CreateBlogResponseDataType = {
    success: boolean;
    message: string;
    data: {
        blog: BlogType;
    }
}

export type CreateBlogResponseType = {
    success: boolean;
    message: string;
    data: BlogType;
}

export type BlogResponseDataType = {
    success: boolean;
    message: string;
    data: BlogDataType
}

export type BlogResponseType = {
    success: boolean;
    message: string;
    blog: BlogDataType | null;
}

export type PublishBlogResponseDataType = {
    success: boolean;
    message: string;
    data: BlogType;
}

export type EditBlogModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: BlogType | null;
}

export type SingleBlogResponseDataType = {
    success: boolean;
    message: string;
    data: {
        blog: BlogDataType;
    };
}

export type SingleBlogResponseType = {
    success: boolean;
    message: string;
    blog: BlogDataType | null;
}