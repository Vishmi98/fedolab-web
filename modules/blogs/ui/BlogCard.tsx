"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { BlogType } from "../blogs.types";

import { shakeAnimation } from "@/constants/animations";

interface BlogCardProps {
    blog: BlogType;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
    return (
        <Link href={`/blogs/${blog.url}`} className="group">
            <div className="overflow-hidden transition-all duration-300 cursor-pointer">

                {/* Image */}
                <motion.div
                    className="relative w-full h-100 overflow-hidden rounded-4xl"
                    variants={shakeAnimation}
                    whileHover="hover"
                >
                    <Image
                        src={blog.coverImagePath}
                        alt={blog.title}
                        fill
                        className="object-cover object-top"
                    />
                </motion.div>

                {/* Content */}
                <div className="py-6 space-y-3">
                    <p className="text-sm text-gray-500">
                        {blog.date} • {blog.author}
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 group-hover:font-bold">
                        {blog.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2">
                        {blog.paragraph1}
                    </p>

                    <span className="pt-2 text-sm font-medium text-blue-600">
                        Read More →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
