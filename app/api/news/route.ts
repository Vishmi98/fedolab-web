import { NextResponse } from "next/server";

import { getTopTechNews } from "@/modules/news/gnews.service";

export async function GET() {
    try {
        const news = await getTopTechNews(10);

        const filteredNews = news.filter(
            (item) =>
                item.image &&
                item.image.trim() !== ""
        );

        return NextResponse.json(filteredNews);

    } catch {

        return NextResponse.json(
            {
                message: "Failed to fetch news",
            },
            {
                status: 500,
            }
        );

    }
}