"use client"

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MobileNavbarProps } from '@/constants/types'
import { NAV_LINKS } from '@/constants/data'


const MobileNavbar = ({ showNav, closeNav }: MobileNavbarProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeNav();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeNav]);

    const navOpenStyle = showNav ? "translate-x-0" : "translate-x-[-100%]"

    return (
        <div ref={dropdownRef}>
            {/* Overlay */}
            <div
                onClick={closeNav}
                className={`fixed inset-0 bg-black/70 z-[10000] transition-all duration-500 ${navOpenStyle}`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[70%] sm:w-[60%] bg-black z-[10006]
                flex flex-col items-center justify-center space-y-10
                transform transition-all duration-300 ${navOpenStyle}`}
            >
                {/* Close Icon */}
                <X
                    onClick={closeNav}
                    className="absolute top-6 right-6 w-6 h-6 text-white cursor-pointer"
                />

                {/* Nav Links */}
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={closeNav}
                            className={`text-[20px] sm:text-[24px] font-medium transition-colors
                            ${isActive
                                    ? "text-white font-semibold"
                                    : "text-gray-300 hover:text-white"
                                }`}
                        >
                            {link.label}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default MobileNavbar