"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import ServiceCard from "./ServiceCard";

import { SERVICE_DATA } from "@/constants/data";
import { cardVariants, characterVariants, waveContainer } from "@/constants/animations";


const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 4 },
    tablet: { breakpoint: { max: 1280, min: 768 }, items: 3 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const CustomLeftArrow = ({ onClick }: any) => (
    <button
        onClick={onClick}
        className="absolute bottom-0 right-12 md:right-16 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-200"
    >
        <FaChevronLeft />
    </button>
);

const CustomRightArrow = ({ onClick }: any) => (
    <button
        onClick={onClick}
        className="absolute bottom-0 right-0 md:right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-200"
    >
        <FaChevronRight />
    </button>
);

const Services = () => {
    const h1Text = "Our Services";
    const h1Characters = Array.from(h1Text);

    return (
        <motion.section
            className="relative w-[90%] mx-auto pt-20 pb-5"
            variants={waveContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.h1 className="mb-14 text-4xl md:text-6xl font-semibold">
                {h1Characters.map((char, index) => (
                    <motion.span key={index} className="inline-block" variants={characterVariants}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.h1>

            <Carousel
                responsive={responsive}
                infinite
                arrows
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
                containerClass="relative"
                itemClass="md:px-4 pb-12 md:pb-16"
                pauseOnHover
            >
                {SERVICE_DATA.map((service, index) => (
                    <motion.div
                        key={service.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <ServiceCard {...service} />
                    </motion.div>
                ))}
            </Carousel>
        </motion.section>
    );
};

export default Services;
