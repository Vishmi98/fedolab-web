"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import NewsCard from "./NewsCard";
import NewsCardSkeleton from "./NewsCardSkeleton";
import { GNewsItem } from "../news.types";
import { fetchNews } from "../news.client";

import { rowVariants } from "@/constants/animations";


const News = () => {
  const [newsData, setNewsData] = useState<GNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real tech news
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const articles = await fetchNews();
        setNewsData(articles);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Chunk filtered array into pairs for 2-column animation rows
  const rows = useMemo(() => {
    const result: GNewsItem[][] = [];

    for (let i = 0; i < newsData.length; i += 2) {
      result.push(newsData.slice(i, i + 2));
    }

    return result;
  }, [newsData]);

  const handleImageError = (id: string) => {
    setNewsData((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <section className="w-[90%] mx-auto py-20">
      {/* Skeleton Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, idx) => (
            <NewsCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* News Grid */}
      {!isLoading && (
        <div className="space-y-6">
          {rows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {row.map((news) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  onImageError={handleImageError}
                />
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && newsData.length === 0 && (
        <p className="text-center text-gray-500">
          No news found.
        </p>
      )}
    </section>
  );
};

export default News;