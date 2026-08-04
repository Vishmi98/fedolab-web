"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Images from "./Images";
import { ProjectDataType } from "../projects.types";

import { containerVariants, textVariants } from "@/constants/animations";


interface Props {
    project: ProjectDataType;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
    return (
        <div className="w-full bg-white min-h-screen">
            {/* Hero Header */}
            <section className="relative h-[50vh] md:h-[80vh] w-full overflow-hidden bg-gray-900 mt-[10vh]">
                {project.coverImagePath && (
                    <Image
                        src={project.coverImagePath}
                        alt={project.title}
                        fill
                        priority
                        className="object-cover opacity-90"
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Hero Title & Short Description */}
                <motion.div
                    className="absolute bottom-12 md:bottom-20 left-[5%] right-[5%] max-w-4xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {project.category && (
                        <motion.span
                            variants={textVariants}
                            className="inline-block px-3.5 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                        >
                            {project.category}
                        </motion.span>
                    )}

                    <motion.h1
                        variants={textVariants}
                        className="text-white text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight"
                    >
                        {project.title}
                    </motion.h1>

                    {project.shortDescription && (
                        <motion.p
                            variants={textVariants}
                            className="text-white/80 mt-4 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed"
                        >
                            {project.shortDescription}
                        </motion.p>
                    )}
                </motion.div>
            </section>

            {/* Main Content Body */}
            <section className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto py-16 md:py-28 space-y-14 md:space-y-24">
                {/* Metadata Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pb-10 md:pb-12 border-b border-gray-200"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {/* Category */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            Category
                        </h3>
                        <p className="text-base font-medium text-gray-900">
                            {project.category || "—"}
                        </p>
                    </div>

                    {/* Client */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            Client
                        </h3>
                        <p className="text-base font-medium text-gray-900">
                            {project.client || "Confidential"}
                        </p>
                    </div>

                    {/* Technologies */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                            Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies?.length > 0 ? (
                                project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200/80"
                                    >
                                        {tech}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-500">—</span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Detailed Overview */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <motion.h2
                        variants={textVariants}
                        className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900"
                    >
                        Project Overview
                    </motion.h2>

                    <motion.p
                        variants={textVariants}
                        className="text-gray-600 text-base md:text-lg leading-relaxed whitespace-pre-line"
                    >
                        {project.description}
                    </motion.p>
                </motion.div>

                {/* Image Gallery Section */}
                {project.imagePaths && project.imagePaths.length > 0 && (
                    <Images imagePaths={project.imagePaths} title={project.title} />
                )}

                {/* Footer Link Navigation */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-10">
                    <Link
                        href="/projects"
                        className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-black transition-colors group"
                    >
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">
                            ←
                        </span>
                        Back to Projects
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ProjectOverview;