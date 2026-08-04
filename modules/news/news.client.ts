import { URL } from "@/constants/config";
import { GNewsItem } from "./news.types";

const baseUrl = URL;

export async function fetchNews(): Promise<GNewsItem[]> {

    const res = await fetch("/api/news");

    if (!res.ok) {
        throw new Error("Failed to fetch news");
    }

    return res.json();
}

export async function fetchNewsDetail(
    id: string
): Promise<GNewsItem> {

    const res = await fetch(`${baseUrl}/news/${id}`);

    if (!res.ok) {
        throw new Error("News not found");
    }

    return res.json();
}

export async function fetchRelatedNews(
    id: string
): Promise<GNewsItem[]> {
    const res = await fetch(`${baseUrl}/news/related/${id}`);

    if (!res.ok) {
        throw new Error("Failed");
    }

    const data: GNewsItem[] = await res.json();

    return data.filter(
        (item) => item.image && item.image.trim() !== ""
    );
}