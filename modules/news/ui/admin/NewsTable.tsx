"use client";

import React, { useEffect, useState } from "react";

import { getTopTechNews } from "../../news.service";
import { HackerNewsItem } from "../../news.types";

import CommonTable, { ColumnType } from "@/components/CommonTable";

interface NewsTableProps {
  reload?: boolean;
}

const NewsTable: React.FC<NewsTableProps> = ({ reload }) => {
  const [news, setNews] = useState<HackerNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  // Modal State for Image Preview
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
    articleUrl?: string;
  } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      // Fetch top 50 stories so we can paginate client-side
      const stories = await getTopTechNews(50);

      setNews(stories);
      setTotalRows(stories.length);
    } catch (error) {
      console.error("Failed to fetch Hacker News:", error);
      setNews([]);
      setTotalRows(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  // Extract domain favicon as a fallback for missing images
  const getFaviconUrl = (url?: string) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  };

  // Format Unix timestamp into a readable date string
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate current page slice
  const startIndex = (page - 1) * limit;
  const paginatedNews = news.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(totalRows / limit) || 1;

  const columns: ColumnType<HackerNewsItem>[] = [
    {
      header: "#ID",
      accessor: "id",
      render: (row) => (
        <span className="font-semibold text-gray-700">#{row.id}</span>
      ),
    },
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="max-w-[300px]">
          {row.url ? (
            <a
              href={row.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline line-clamp-2"
            >
              {row.title}
            </a>
          ) : (
            <p className="line-clamp-2 font-medium text-gray-900">
              {row.title}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Image",
      accessor: "imageUrl",
      render: (row) => {
        const fallbackFavicon = getFaviconUrl(row.url);
        const displayImage = row.imageUrl || fallbackFavicon;

        return (
          <div className="w-12 h-12 flex-shrink-0">
            {displayImage ? (
              <button
                type="button"
                onClick={() =>
                  setSelectedImage({
                    url: displayImage,
                    title: row.title || "News Image",
                    articleUrl: row.url,
                  })
                }
                className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 hover:opacity-85 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Click to view full image"
              >
                <img
                  src={displayImage}
                  alt={row.title || "News"}
                  className={`w-full h-full ${
                    row.imageUrl ? "object-cover" : "object-contain p-2 bg-gray-50"
                  }`}
                  onError={(e) => {
                    // Fallback to favicon if external og:image fails to load
                    if (fallbackFavicon && e.currentTarget.src !== fallbackFavicon) {
                      e.currentTarget.src = fallbackFavicon;
                      e.currentTarget.className = "w-full h-full object-contain p-2 bg-gray-50";
                    }
                  }}
                />
              </button>
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-[10px] font-medium text-gray-400 border border-gray-200">
                No Image
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Author",
      accessor: "by",
      render: (row) => (
        <span className="text-sm font-medium text-gray-600">
          {row.by ? `@${row.by}` : "Anonymous"}
        </span>
      ),
    },
    {
      header: "Score",
      accessor: "score",
      render: (row) => (
        <span className="inline-flex items-center p-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
          ▲ {row.score ?? 0}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "time",
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="text-sm text-gray-600">{formatDate(row.time)}</p>
        </div>
      ),
    },
  ];

  return (
    <>
      <CommonTable
        columns={columns}
        data={paginatedNews}
        isLoading={isLoading}
        expandable={false}
        page={page}
        limit={limit}
        totalRows={totalRows}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent click through to backdrop
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-base line-clamp-2 pr-4">
                {selectedImage.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-md transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Image */}
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Modal Footer Link */}
            {selectedImage.articleUrl && (
              <div className="flex justify-end">
                <a
                  href={selectedImage.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Read Full Article →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewsTable;