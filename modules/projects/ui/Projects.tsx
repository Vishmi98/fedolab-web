"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { ProjectDataType } from "../projects.types";
import { getProjects } from "../projects.service";

import { rowVariants } from "@/constants/animations";


const Projects: React.FC = () => {
    const [projects, setProjects] = useState<ProjectDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchProjectData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProjects();
            if (response.success) {
                setProjects(response.projects);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    // Group fetched projects into pairs for 2-column animation rows
    const rows: ProjectDataType[][] = [];
    for (let i = 0; i < projects.length; i += 2) {
        rows.push(projects.slice(i, i + 2));
    }

    return (
        <section className="w-[90%] mx-auto pb-20">
            {isLoading ? (
                /* Loading Skeleton Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <ProjectCardSkeleton key={index} />
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <>
                    {/* Animated Project Rows */}
                    <div className="space-y-10">
                        {rows.map((row, rowIndex) => (
                            <motion.div
                                key={rowIndex}
                                className="grid grid-cols-1 md:grid-cols-2 gap-10"
                                variants={rowVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                {row.map((project) => (
                                    <ProjectCard key={project.id || project.slug} project={project} />
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </>
            ) : (
                /* Fallback when no projects exist */
                <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-gray-500 font-medium">No projects available.</p>
                </div>
            )}
        </section>
    );
};

export default Projects;