import { NextResponse } from "next/server";

import { getNewsById } from "@/modules/news/gnews.service";

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

    const article = await getNewsById(id);

    if (!article) {

        return NextResponse.json(
            {
                message: "News not found",
            },
            {
                status: 404,
            }
        );

    }

    return NextResponse.json(article);
}