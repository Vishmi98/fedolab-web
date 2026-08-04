import { NextResponse } from "next/server";

import { getRelatedNews } from "@/modules/news/gnews.service";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: Props
) {

    const { id } = await params;

    const news = await getRelatedNews(id);

    return NextResponse.json(news);
}