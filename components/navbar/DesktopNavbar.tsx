"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlignRight } from 'lucide-react'

import { DesktopNavbarProps } from '@/constants/types';
import { NAV_LINKS } from '@/constants/data';


const DesktopNavbar = ({ openNav }: DesktopNavbarProps) => {
    const [navSticky, setNavSticky] = useState(false);
    const pathname = usePathname()

    useEffect(() => {
        const handler = () => {
            if (window.scrollY >= window.innerHeight * 0.8) {
                setNavSticky(true);
            } else {
                setNavSticky(false);
            }
        };

        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const isLightTextPage =
        pathname.startsWith("/projects") || pathname.startsWith("/blogs") || pathname === "/contact" || pathname.startsWith("/news") || pathname.startsWith("/stocks") || pathname === "/companies"

    // ✅ FINAL TEXT LOGIC
    const isDarkText = navSticky || isLightTextPage

    const isAboutSticky = pathname === "/about" && navSticky

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300
            ${navSticky ? "backdrop-blur-lg"
                    : "bg-transparent"}`}
        >
            <nav className="flex items-center justify-between h-[8vh] md:h-[10vh] w-[90%] mx-auto">

                {/* Logo */}
                <Link
                    href="/"
                    className={`font-extrabold text-xl tracking-wide
    ${isAboutSticky
                            ? "text-white"
                            : isDarkText
                                ? "text-black"
                                : "text-white"
                        }`}
                >
                    FEDOLAB
                </Link>


                {/* Desktop Links */}
                <div className="flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-medium transition-colors hidden md:flex
                                    ${isActive
                                        ? isAboutSticky
                                            ? "font-semibold text-white"
                                            : isDarkText
                                                ? "font-semibold text-black"
                                                : "font-semibold text-white"
                                        : isAboutSticky
                                            ? "text-gray-200 hover:text-white"
                                            : isDarkText
                                                ? "text-gray-700 hover:text-black"
                                                : "text-gray-300 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        )
                    })}

                    <Link
                        href="/contact"
                        className={`ml-4 relative overflow-hidden rounded-full px-5 py-2 font-medium uppercase transition-all group
    ${isAboutSticky
                                ? "text-black bg-white"
                                : isDarkText
                                    ? "text-white bg-black"
                                    : "text-black bg-white"
                            }`}
                    >
                        {/* Hover Background */}
                        <span className="absolute top-0 left-0 w-full h-0 bg-black rounded-full opacity-90 transition-[height] duration-300 ease-out group-hover:h-full"></span>

                        {/* Text */}
                        <span className="relative z-10 transition-colors duration-300 ease-out group-hover:text-white dark:group-hover:text-black">
                            Let&apos;s Talk
                        </span>
                    </Link>


                </div>

                {/* Mobile Menu Icon */}
                <AlignRight
                    onClick={openNav}
                    className={`md:hidden w-[1.3rem] h-[1.3rem] cursor-pointer
                     ${navSticky
                            ? isDarkText
                                ? "text-black"
                                : "text-black"
                            : isDarkText
                                ? "text-black"
                                : "text-white"
                        }`}
                />
            </nav>
        </header>
    )
}

export default DesktopNavbar