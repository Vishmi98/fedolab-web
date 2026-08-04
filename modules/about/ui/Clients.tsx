"use client";

import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { motion } from "framer-motion";

import { CLIENTS } from "@/constants/data";
import { characterVariants, waveContainer } from "@/constants/animations";


const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1280 }, items: 6 },
    tablet: { breakpoint: { max: 1280, min: 768 }, items: 6 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 3 },
};

const Clients = () => {
    const h1Text = "Clients we work with";
    const h1Characters = Array.from(h1Text);

    return (
        <motion.section
            className="space-y-16 text-white pt-28 md:pt-36 overflow-hidden"
            variants={waveContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="w-[90%] mx-auto">
                <motion.h1 className="text-4xl md:text-6xl font-semibold uppercase">
                    {h1Characters.map((char, index) => (
                        <motion.span key={index} className="inline-block" variants={characterVariants}>
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </motion.h1>
            </div>

            <div>
                {/* ROW 1 → RIGHT */}
                <ClientRow direction="right" />

                {/* ROW 2 → LEFT */}
                <ClientRow direction="left" />

                {/* ROW 3 → RIGHT */}
                <ClientRow direction="right" />
            </div>
        </motion.section>
    );
};

export default Clients;

/* ---------------- CLIENT ROW ---------------- */

const ClientRow = ({ direction }: { direction: "left" | "right" }) => {
    return (
        <div className="w-full">
            <Carousel
                responsive={responsive}
                infinite
                arrows={false}
                showDots={false}
                autoPlay
                autoPlaySpeed={0}
                customTransition="transform 5000ms linear"
                transitionDuration={5000}
                draggable={false}
                swipeable={false}
                rtl={direction === "right"} // 🔥 THIS controls direction
                itemClass="px-10"
            >
                {CLIENTS.map((item) => (
                    <div
                        key={item.id}
                        className="relative w-50 h-40"
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            className="object-contain"
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};
