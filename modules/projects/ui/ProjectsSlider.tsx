/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BiPause } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";
import { motion } from "framer-motion";

import { ProjectDataType } from "../projects.types"; // Adjust import path as needed
import ProjectCard from "./ProjectCard";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { getProjects } from "../projects.service";

import { cardVariants, characterVariants, waveContainer } from "@/constants/animations";


const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 2 },
    tablet: { breakpoint: { max: 1280, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const ProjectsSlider = () => {
    const [projects, setProjects] = useState<ProjectDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<any>(null);

    const h1Text = "Featured Works";
    const h1Characters = Array.from(h1Text);

    // Fetch API Data on mount
    useEffect(() => {
        let isMounted = true;

        const fetchFeaturedProjects = async () => {
            try {
                setIsLoading(true);
                // Fetch up to 6 featured projects for the slider
                const response = await getProjects();
                if (isMounted && response.success) {
                    setProjects(response.projects);
                }
            } catch (error) {
                console.error("Failed to fetch slider projects:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchFeaturedProjects();

        return () => {
            isMounted = false;
        };
    }, []);

    // Control Carousel Dot Navigation
    const handleDotClick = (index: number) => {
        if (carouselRef.current) {
            carouselRef.current.goToSlide(index);
        }
    };

    return (
        <>
            {/* Section Title Header */}
            <motion.section
                className="w-[90%] mx-auto pt-20"
                variants={waveContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.h1 className="text-4xl md:text-6xl font-semibold mb-10">
                    {h1Characters.map((char, index) => (
                        <motion.span
                            key={index}
                            className="inline-block"
                            variants={characterVariants}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.h1>
            </motion.section>

            <div className="w-[90%] mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                        {/* Always visible (Mobile, Tablet, Desktop) */}
                        <ProjectCardSkeleton />

                        {/* Hidden on Mobile (< 768px), Visible on Tablet & Desktop (>= 768px) */}
                        <div className="hidden md:block">
                            <ProjectCardSkeleton />
                        </div>
                    </div>
                ) : projects.length > 0 ? (
                    /* Carousel State */
                    <>
                        <Carousel
                            ref={carouselRef}
                            responsive={responsive}
                            autoPlay={isAutoPlay}
                            autoPlaySpeed={4000}
                            infinite={projects.length > 1}
                            arrows={false}
                            showDots={false}
                            pauseOnHover={false}
                            draggable
                            swipeable
                            containerClass="pb-8"
                            itemClass="md:pr-5"
                            beforeChange={(nextSlide) => {
                                const realIndex = nextSlide % projects.length;
                                setCurrentSlide(realIndex);
                            }}
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id || project.slug}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </Carousel>

                        {/* Custom Pagination Dots & Play/Pause Button */}
                        {projects.length > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-5 mb-10">
                                <div className="bg-gray-300 flex items-center pl-4 pr-2 py-1 rounded-full">
                                    {/* Dots */}
                                    <div className="flex gap-2">
                                        {projects.map((_, index) => {
                                            const isActive = currentSlide === index;

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleDotClick(index)}
                                                    className={`h-3 rounded-full transition-all duration-300 ${isActive ? "bg-gray-800 w-8" : "bg-gray-400 w-3"
                                                        }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            );
                                        })}
                                    </div>

                                    {/* Play / Pause Toggle */}
                                    <button
                                        onClick={() => setIsAutoPlay((prev) => !prev)}
                                        className="ml-6 flex items-center justify-center rounded-full bg-gray-100 w-10 h-10 transition-all hover:bg-gray-200 cursor-pointer"
                                        aria-label={isAutoPlay ? "Pause carousel" : "Play carousel"}
                                    >
                                        {isAutoPlay ? <BiPause size={25} /> : <FaPlay size={15} />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-12 text-gray-500">
                        No featured projects available.
                    </div>
                )}
            </div>
        </>
    );
};

export default ProjectsSlider;