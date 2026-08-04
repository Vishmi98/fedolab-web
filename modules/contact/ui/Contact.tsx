"use client";

import { motion, Variants } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";

import ContactUsForm from "./ContactUsForm";

import { bounceIconVariants, containerVariants, itemVariants } from "@/constants/animations";


const Contact = () => {
    const formVariants: Variants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div className="w-[90%] md:w-[80%] mx-auto py-26 md:py-30">
            <div className="w-full md:w-[70%] mx-auto text-center">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    Let&apos;s talk business. But you first
                </motion.h1>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-10 mt-26 items-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {/* Text Section */}
                <motion.div className="space-y-3" variants={itemVariants}>
                    <motion.p className="text-gray-500 uppercase font-medium" variants={itemVariants}>
                        we are here to help you
                    </motion.p>
                    <motion.p className="text-2xl md:text-4xl font-semibold" variants={itemVariants}>
                        Let&apos;s build something powerful together.
                    </motion.p>
                    <motion.p variants={itemVariants}>
                        Whether you&apos;re launching a new idea or scaling an existing business, our team is here to turn your vision into reality. We combine strategy, design, and technology to deliver solutions that drive real impact.
                    </motion.p>
                    <motion.div className="mt-10 space-y-4" variants={itemVariants}>
                        <motion.div className="flex gap-5" variants={itemVariants}>
                            <motion.div
                                variants={bounceIconVariants}
                                animate="animate"
                            >
                                <IoMail size={30} />
                            </motion.div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="text-lg font-medium">info@fedolab.com</p>
                            </div>
                        </motion.div>

                        {/* <motion.div className="flex gap-5" variants={itemVariants}>
                            <motion.div
                                variants={bounceIconVariants}
                                animate="animate"
                            >
                                <FaPhoneAlt size={30} />
                            </motion.div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="text-lg font-medium">012 3456 789</p>
                            </div>
                        </motion.div> */}

                    </motion.div>
                </motion.div>

                {/* Form Section */}
                <motion.div variants={formVariants}>
                    <ContactUsForm />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Contact;
