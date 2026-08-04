"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

import BlogCard from "./BlogCard";
import BlogCardSkeleton from "./BlogCardSkeleton";
import { BlogType } from "../blogs.types";
import { getBlogs } from "../blogs.service";

import { rowVariants } from "@/constants/animations";


const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchBlogData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getBlogs();
            if (response.success) {
                setBlogs(response.blogs);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error("Failed to load blogs:", error);
            setBlogs([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogData();
    }, [fetchBlogData,]);

    // Group blogs into pairs for 2-column animation rows
    const rows: BlogType[][] = [];
    for (let i = 0; i < blogs.length; i += 2) {
        rows.push(blogs.slice(i, i + 2));
    }

    return (
        <section className="w-[90%] mx-auto pb-20">
            {/* Loading Skeleton Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <BlogCardSkeleton key={index} />
                    ))}
                </div>
            ) : blogs.length > 0 ? (
                <>
                    {/* Animated Blog Rows */}
                    <div className="space-y-10">
                        {rows.map((row, rowIndex) => (
                            <motion.div
                                key={rowIndex}
                                className="grid grid-cols-1 md:grid-cols-2 gap-10"
                                variants={rowVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {row.map((blog) => (
                                    <BlogCard key={blog.id || blog.url} blog={blog} />
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : (
                /* Empty State */
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-gray-500 font-medium">No blog posts found.</p>
                </div>
            )}
        </section>
    );
};

export default Blogs;