import Link from "next/link";
import { notFound } from "next/navigation";
import {
    BiArrowBack,
    BiCalendar,
    BiGlobe,
    BiRightArrowAlt,
    BiShareAlt,
    BiBookmark,
} from "react-icons/bi";

import {
    fetchNewsDetail,
    fetchRelatedNews,
} from "@/modules/news/news.client";
import RelatedNewsCard from "@/modules/news/ui/RelatedNewsCard";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { id } = await params;

    const news = await fetchNewsDetail(id);

    if (!news) {
        notFound();
    }

    const related = await fetchRelatedNews(id);

    const publishedDate = new Date(news.publishedAt).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );

    const domain = new URL(news.source.url).hostname.replace("www.", "");

    return (
        <main className="min-h-screen w-[90%] mx-auto py-20">
            {/* Navigation Header */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <BiArrowBack className="text-lg" />
                        <span>Back to News</span>
                    </Link>
                </div>
            </nav>

            {/* Main Content & Sidebar Layout */}
            <div className="max-w-7xl mx-auto py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Article Column */}
                    <article className="lg:col-span-8">
                        {/* Metadata & Title */}
                        <header className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wider">
                                    Technology
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm font-medium text-gray-600">
                                    {news.source.name}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
                                {news.title}
                            </h1>

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 border-y border-gray-200 py-3">
                                <div className="flex items-center gap-1.5">
                                    <BiCalendar className="text-base text-gray-400" />
                                    <time>{publishedDate}</time>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1.5">
                                    <BiGlobe className="text-base text-gray-400" />
                                    <span>{domain}</span>
                                </div>
                            </div>
                        </header>

                        {/* Featured Image */}
                        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gray-100 aspect-[16/9] shadow-sm">
                            <img
                                src={news.image}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed">
                            {/* Lead Paragraph / Summary */}
                            <p className="text-xl sm:text-2xl font-normal text-gray-800 leading-snug tracking-tight mb-8 font-serif italic border-l-4 border-blue-600 pl-4 py-1">
                                {news.description}
                            </p>

                            {/* Main Text */}
                            <div className="space-y-6 text-gray-800 text-lg leading-8 font-serif">
                                {news.content
                                    ?.replace(/\[\+\d+\schars\]/, "")
                                    .split("\n")
                                    .filter(Boolean)
                                    .map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                            </div>
                        </div>

                        {/* Source Callout Card */}
                        <div className="mt-12 p-6 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Continue reading on {news.source.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    This article was originally published by {domain}.
                                </p>
                            </div>
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors shrink-0"
                            >
                                <span>Read Full Story</span>
                                <BiRightArrowAlt className="text-xl" />
                            </a>
                        </div>
                    </article>

                    {/* Sticky Sidebar: Related News */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                    Related News
                                </h2>
                                <Link
                                    href="/news"
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    See all
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {related.map((item) => (
                                    <RelatedNewsCard
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}
