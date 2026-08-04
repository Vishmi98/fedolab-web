"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { headerVariants, mediaVariants, paragraphVariants } from "@/constants/animations";


const About = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section className="w-[90%] mx-auto py-20">
            {/* Header animation */}
            <motion.h1
                className="text-4xl md:text-6xl font-semibold capitalize"
                variants={isDesktop ? headerVariants : {}}
                initial="hidden"
                whileInView={isDesktop ? "visible" : undefined}
                viewport={{ once: true, amount: 0.3 }}
            >
                Lorem ipsum dolor sit amet
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 h-auto md:h-[400px] mt-14 md:mt-20">
                {/* Mobile paragraphs */}
                <div className="w-full space-y-4 text-lg flex-col justify-center flex md:hidden">
                    <motion.p
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
                        impedit vitae dignissimos asperiores facilis dolores, perferendis
                        quibusdam labore numquam cum. Lorem, ipsum dolor sit amet consectetur
                        adipisicing elit. Necessitatibus, numquam? Accusamus, nihil
                        necessitatibus dignissimos recusandae.
                    </motion.p>
                    <motion.p
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.2 }}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas eius
                        tempora cum ea similique sequi ullam provident blanditiis eaque saepe!
                        Vel omnis qui saepe atque cum, ullam culpa laborum veniam. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit.
                    </motion.p>
                </div>

                {/* Image */}
                <motion.div
                    variants={mediaVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="relative w-full h-[300px] md:h-full overflow-hidden rounded-4xl"
                >
                    <Image
                        src="/a.png"
                        alt="Design"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                </motion.div>

                {/* Desktop paragraphs */}
                <div className="w-full space-y-4 text-lg flex-col justify-center hidden md:flex">
                    <motion.p
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit
                        impedit vitae dignissimos asperiores facilis dolores, perferendis
                        quibusdam labore numquam cum. Lorem, ipsum dolor sit amet consectetur
                        adipisicing elit. Necessitatibus, numquam? Accusamus, nihil
                        necessitatibus dignissimos recusandae.
                    </motion.p>
                    <motion.p
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.2 }}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas eius
                        tempora cum ea similique sequi ullam provident blanditiis eaque saepe!
                        Vel omnis qui saepe atque cum, ullam culpa laborum veniam. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit.
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default About;
