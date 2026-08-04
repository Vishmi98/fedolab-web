// modules/news/extractor.ts
import { extract } from "@extractus/article-extractor";
import { cache } from "react";

export const getFullArticleBody = cache(async (url: string): Promise<string | null> => {
    if (!url) return null;

    try {
        const article = await extract(url);
        // Returns clean HTML content string, or null if scraping failed/blocked
        return article?.content ?? null;
    } catch (error) {
        console.error("Failed to extract full article body:", error);
        return null;
    }
});