"use client";

import { AiFillInstagram } from "react-icons/ai";
import { FaLinkedin } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="pt-12 pb-6 w-full font-sans bg-white">
            <div className="w-[90%] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Left Section */}
                    <div className="w-full flex flex-col gap-3 text-left">
                        <p className="font-extrabold text-black text-[18px] flex items-center gap-2">
                            FEDOLAB
                        </p>
                        <p className="text-gray-600">
                            As your partner in AI, software development, digital marketing, and mobile app development, we&apos;re committed to elevating your business beyond boundaries. Our team provides expert guidance and dedicated support, ensuring your journey from idea to implementation is seamless and successful.
                        </p>
                    </div>

                    {/* Right Section */}
                    <div>
                        <div className="flex h-full space-x-6 items-end justify-start md:justify-end">

                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/fedolab"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="text-gray-600 hover:text-black transition duration-200 hover:scale-110"
                            >
                                <FaFacebookF size={25} />
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/fedolabsoft?igsh=Nmlqa3U5ejU3b3h2"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-gray-600 hover:text-black transition duration-200 hover:scale-110"
                            >
                                <AiFillInstagram size={28} />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://www.linkedin.com/company/fedolab/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-gray-600 hover:text-black transition duration-200 hover:scale-110"
                            >
                                <FaLinkedin size={25} />
                            </a>

                        </div>
                    </div>
                </div>

                <hr className="w-full h-[0.5px] border-[#5756567D] my-5" />

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <p className="text-sm text-gray-500">
                            Copyright &copy; {new Date().getFullYear()} FEDO LAB. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;