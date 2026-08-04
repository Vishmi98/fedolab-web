export type NewsDataType = {
    id: number;
    image: string;
    title: string;
    description: string;
    date: string;
    category: string;
    slug: string;
};

export type NewsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalNews: number;
    news: NewsDataType[];
}

export type NewsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalNews: number;
        news: NewsDataType[];
    }
}

export interface HackerNewsItem {
    id: number;
    deleted?: boolean;
    type?: "job" | "story" | "comment" | "poll" | "pollopt";
    by?: string;
    time?: number;
    text?: string;
    dead?: boolean;
    parent?: number;
    poll?: number;
    kids?: number[];
    url?: string;
    score?: number;
    title?: string;
    parts?: number[];
    descendants?: number;

    // Custom UI fields
    imageUrl?: string;
    category?: string;
    content?: string[];
}

export interface GNewsSource {
    id: string;
    name: string;
    url: string;
}

export interface GNewsItem {
    id: string;
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    lang: string;
    source: GNewsSource;
}

export interface GNewsResponse {
    totalArticles: number;
    articles: GNewsItem[];
}