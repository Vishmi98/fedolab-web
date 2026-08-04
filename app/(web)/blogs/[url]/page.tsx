import { notFound } from "next/navigation";

import { fetchBlog } from "@/lib/fetchData";
import BlogOverview from "@/modules/blogs/ui/BlogOverview";


export default async function BlogPage({ params }: { params: Promise<{ url: string }> }) {
    const { url } = await params;

    if (!url) {
        console.log("Blog is missing from url params");
        return notFound();
    }

    const blogData = await fetchBlog(url);

    if (!blogData) {
        return notFound();
    }

    return (
        <main>
            <BlogOverview blog={blogData} />
        </main>
    );
};

