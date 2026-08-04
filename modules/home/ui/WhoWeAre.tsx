"use client";

import { motion } from "framer-motion";

import {
    waveContainer,
    characterVariants,
    descriptionVariants,
    mediaVariants,
} from "@/constants/animations";


const WhoWeAre = () => {
    const h1Text = "Who we are?";
    const h1Characters = Array.from(h1Text);

    return (
        <motion.section
            className="w-[90%] mx-auto flex flex-col items-center justify-center py-20 gap-12"
            variants={waveContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* Heading with wave animation */}
            <motion.h1 className="text-4xl md:text-6xl font-semibold text-center flex flex-wrap justify-center">
                {h1Characters.map((char, index) => (
                    <motion.span key={index} className="inline-block" variants={characterVariants}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.h1>

            {/* Description */}
            <motion.div className="w-full md:w-[70%] mx-auto text-center" variants={descriptionVariants}>
                <p>
                    FEDO-LAB is a cutting-edge technology startup specializing in AI,
                    software development, digital marketing, mobile app development, and
                    SEO. Our mission is to elevate businesses worldwide through advanced
                    software and cloud solutions. With a vision to be the global forefront
                    of transformative technology, we aim to enhance businesses across
                    borders.
                </p>
            </motion.div>
            {/* 
            <motion.div
                className="w-full md:w-[80%] aspect-video mt-8 rounded-xl overflow-hidden"
                variants={mediaVariants}
            >
                <iframe
                    src="https://www.youtube.com/embed/JcXKbUIebrU"
                    title="FEDO-LAB Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </motion.div> */}
        </motion.section>
    );
};

export default WhoWeAre;
