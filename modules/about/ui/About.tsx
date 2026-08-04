"use client"

import Image from 'next/image'
import { motion } from "framer-motion";

import { mediaVariants, paragraphVariants, slideRightToLeft } from '@/constants/animations';


const About = () => {
    return (
        <>
            <div className='w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 pb-10 md:pb-0'>
                <div>
                    <motion.h1
                        className=" text-white text-4xl md:text-6xl font-semibold uppercase"
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        Who we are?
                    </motion.h1>
                </div>
                <div className='space-y-5 text-gray-300 col-span-2'>
                    <motion.p
                        className='leading-7'
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        FEDO-LAB is a cutting-edge technology startup specializing in AI, software development, digital marketing, mobile app development, and SEO. Our mission is to elevate businesses worldwide through advanced software and cloud solutions. With a vision to be the global forefront of transformative technology, we aim to enhance businesses across borders.
                    </motion.p>
                    {/* <motion.p
                        className='leading-7'
                        variants={paragraphVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non illo eaque amet, autem recusandae facere consequuntur aliquam harum ducimus ea maiores animi sequi doloribus repellat consequatur quae. Harum doloremque id libero illum aperiam aut distinctio debitis eveniet odit quaerat et similique, ullam possimus necessitatibus dolorum amet cum nostrum tempora repellendus quos! Deserunt aut natus placeat sit, quos facilis, impedit et temporibus, consequatur amet similique repellat possimus illo animi! Eligendi, dignissimos.
                    </motion.p> */}
                </div>
            </div>
            <section className="grid grid-cols-1 md:grid-cols-2 mt-28 h-auto md:h-[600px] gap-12 md:gap-20 w-[90%] mx-auto items-center">
                {/* Image */}
                <motion.div
                    className="w-full h-[350px] md:h-[500px] 2xl:h-[600px] relative"
                    variants={mediaVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <Image
                        src="/f2.jpg"
                        alt="Vision background"
                        fill
                        priority
                        className="object-cover"
                    />
                </motion.div>

                {/* Text */}
                {/* Text */}
                <div className="space-y-20 md:p-5">

                    {/* Vision */}
                    <motion.div
                        className="space-y-4"
                        variants={slideRightToLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h1 className="text-white text-4xl md:text-6xl font-semibold capitalize">
                            Vision
                        </h1>
                        <p className="text-gray-300 leading-7">
                            To become a globally recognized technology leader, driving innovation through AI, software, and digital solutions that empower businesses to grow, adapt, and succeed in an ever-evolving digital world.
                        </p>
                    </motion.div>

                    {/* Mission */}
                    <motion.div
                        className="space-y-4"
                        variants={slideRightToLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h1 className="text-white text-4xl md:text-6xl font-semibold capitalize">
                            Mission
                        </h1>
                        <p className="text-gray-300 leading-7">
                            Our mission is to deliver intelligent, scalable, and high-quality digital solutions by combining cutting-edge technology with creativity. We strive to help businesses enhance their performance, expand their reach, and achieve sustainable growth through innovation and excellence.
                        </p>
                    </motion.div>

                </div>

            </section>
        </>
    )
}

export default About