import * as cheerio from "cheerio";

import { HackerNewsItem } from "./news.types";


const BASE_URL = "https://hacker-news.firebaseio.com/v0";

// Helper to fetch OpenGraph image URL or fallback domain icon
async function fetchOgImage(url?: string): Promise<string | undefined> {
    if (!url) return undefined;

    try {
        const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`, {
            signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
            const data = await res.json();
            const ogImage = data?.data?.image?.url;
            if (ogImage && typeof ogImage === "string") {
                return ogImage;
            }
        }
    } catch {
        // Fall back quietly if microlink times out or fails
    }

    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
        return undefined;
    }
}

// Helper to extract article text/paragraphs
async function fetchArticleContent(url?: string): Promise<string[]> {
    if (!url) return [];

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            signal: AbortSignal.timeout(4000),
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const paragraphs: string[] = [];

        let paragraphElements = $("article p, main p");
        if (paragraphElements.length === 0) {
            paragraphElements = $("body p");
        }

        paragraphElements.each((_, el) => {
            const text = $(el).text().trim();
            if (text.length > 40) {
                paragraphs.push(text);
            }
        });

        return paragraphs.slice(0, 8);
    } catch (error) {
        console.error("Failed to scrape article content:", error);
        return [];
    }
}

export async function getTopTechNews(limit = 20): Promise<HackerNewsItem[]> {
    const idsResponse = await fetch(`${BASE_URL}/topstories.json`, {
        next: { revalidate: 3600 },
    });

    if (!idsResponse.ok) {
        throw new Error("Unable to retrieve Hacker News stories");
    }

    const ids: number[] = await idsResponse.json();

    // Fetch more IDs initially because we will filter out empty content items
    const fetchedStories = await Promise.all(
        ids.slice(0, limit * 3).map(async (id): Promise<HackerNewsItem | null> => {
            try {
                const response = await fetch(`${BASE_URL}/item/${id}.json`);
                if (!response.ok) return null;

                const item: HackerNewsItem = await response.json();
                if (!item || item.dead || item.deleted) return null;

                // Fetch content directly during the listing build
                let content: string[] = [];
                if (item.url) {
                    content = await fetchArticleContent(item.url);
                } else if (item.text) {
                    const $ = cheerio.load(item.text);
                    content = [$.text()];
                }

                // IF NO CONTENT WAS EXTRACTED, DISCARD THIS STORY
                if (!content || content.length === 0) {
                    return null;
                }

                const imageUrl = item.url ? await fetchOgImage(item.url) : undefined;

                return {
                    ...item,
                    imageUrl,
                    content,
                };
            } catch {
                return null;
            }
        })
    );

    // Filter out null values and slice to the target limit requested
    return fetchedStories
        .filter((story): story is HackerNewsItem => story !== null && Boolean(story.title))
        .slice(0, limit);
}

// Single News Detail Fetcher
export async function getNewsDetail(id: string): Promise<HackerNewsItem | null> {
    try {
        const response = await fetch(`${BASE_URL}/item/${id}.json`, {
            cache: "no-store",
        });

        if (!response.ok) return null;

        const item: HackerNewsItem = await response.json();
        if (!item || item.dead || item.deleted) return null;

        let content: string[] = [];

        if (item.url) {
            content = await fetchArticleContent(item.url);
        } else if (item.text) {
            // Fallback for Ask HN / Show HN items with raw HTML body text
            const $ = cheerio.load(item.text);
            content = [$.text()];
        }

        const imageUrl = item.url ? await fetchOgImage(item.url) : undefined;

        return {
            ...item,
            imageUrl,
            content,
        };
    } catch (error) {
        console.error("Error fetching news item:", error);
        return null;
    }
}

// Add this helper function at the bottom of your news.service.ts file

export async function getRelatedNews(
    currentId: string,
    limit = 4
): Promise<HackerNewsItem[]> {
    const stories = await getTopTechNews(limit + 5);
    return stories
        .filter((story) => story.id.toString() !== currentId)
        .slice(0, limit);
}