"use client";

import React, { useState } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { BiPause } from "react-icons/bi";
import { FaPlay } from "react-icons/fa";


interface ImagesProps {
    imagePaths: string[];
    title: string;
}

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 2 },
    tablet: { breakpoint: { max: 1280, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const Images: React.FC<ImagesProps> = ({ imagePaths, title }) => {
    const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

    if (!imagePaths || imagePaths.length === 0) {
        return null;
    }

    return (
        <section className="w-full">
            <div className="relative mt-8 md:mt-12">
                <Carousel
                    responsive={responsive}
                    autoPlay={isAutoPlay}
                    autoPlaySpeed={4000}
                    infinite={imagePaths.length > 1}
                    arrows={false}
                    showDots={imagePaths.length > 1}
                    renderDotsOutside
                    pauseOnHover={false}
                    draggable
                    swipeable
                    containerClass="pb-16"
                    itemClass="md:px-4"
                >
                    {imagePaths.map((imagePath, index) => (
                        <div
                            key={index}
                            className="relative h-[250px] sm:h-[450px] md:h-[520px] rounded-3xl overflow-hidden group shadow-sm border border-gray-200/50"
                        >
                            <Image
                                src={imagePath}
                                alt={`${title} visual element ${index + 1}`}
                                fill
                                className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[1200ms] ease-out"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    ))}
                </Carousel>

                {imagePaths.length > 1 && (
                    <button
                        type="button"
                        onClick={() => setIsAutoPlay((prev) => !prev)}
                        className="absolute -bottom-2 right-1/2 translate-x-[110px] sm:translate-x-[130px] flex items-center justify-center rounded-full bg-white text-gray-800 shadow-md border border-gray-200 w-9 h-9 transition-all hover:scale-105 cursor-pointer z-10"
                        aria-label={isAutoPlay ? "Pause carousel" : "Play carousel"}
                    >
                        {isAutoPlay ? <BiPause size={22} /> : <FaPlay size={12} className="ml-0.5" />}
                    </button>
                )}
            </div>
        </section>
    );
};

export default Images;