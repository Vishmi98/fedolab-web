"use client";

import { motion } from "framer-motion";

import { containerVariants, textVariants } from "@/constants/animations";


const Hero = () => {
    return (
        <div className='relative w-full h-[80vh] md:h-screen custom-bg py-[6rem] text-secondary'>

            <div className='absolute inset-0 w-full h-full bg-gradient-to-b md:bg-gradient-to-r from-black/70 to-transparent z-0'></div>

            <motion.div
                className='relative flex justify-start flex-col w-[90%] mx-auto my-5 gap-[10rem] z-10'
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <div className='grid grid-cols-1 md:grid-cols-2 h-[80vh] md:items-center justify-between gap-10'>
                    <motion.div className='flex flex-col items-center md:items-start gap-8 text-white'>
                        <motion.p
                            className='text-4xl md:text-5xl 2xl:text-7xl flex md:text-start text-center font-semibold'
                            variants={textVariants}
                        >
                            Empowering Your Business with Cutting Edge Solutions
                        </motion.p>
                        <motion.p
                            className='lg:text-lg 2xl:text-xl flex md:text-start text-center'
                            variants={textVariants}
                        >
                            As your partner in AI, software development, digital marketing,
                            and mobile app development, we&apos;re committed to elevating
                            your business beyond boundaries. Our team provides expert guidance
                            and dedicated support, ensuring your journey from idea to
                            implementation is seamless and successful.
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Hero;
