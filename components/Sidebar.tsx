"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPenSquare, FaProjectDiagram } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineMail, HiOutlineSparkles } from 'react-icons/hi';

import { handleCleanCookie } from '@/utils/cookie.util';
import { ProfileLink, SidebarProps } from '@/constants/types';


const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  const profileLinks: ProfileLink[] = [
    { id: 'blogs', label: "Blogs", href: '/admin/blogs', icon: <FaPenSquare className="h-4 w-4 mr-2" /> },
    { id: 'projects', label: "Projects", href: '/admin/projects', icon: <FaProjectDiagram className="h-4 w-4 mr-2" /> },
    { id: 'news', label: "News", href: '/admin/news', icon: <HiOutlineSparkles className="h-4 w-4 mr-2" /> },
    { id: 'inquiries', label: "Inquiries", href: '/admin/inquiries', icon: <HiOutlineMail className="h-4 w-4 mr-2" /> },
  ];

  const handleLogOut = () => {
    handleCleanCookie()
    window.location.href = '/sign_in';
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`h-full fixed top-0 left-0 w-64 bg-white shadow-md md:rounded-2xl p-5 flex flex-col justify-between gap-8 z-40
                   transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   md:translate-x-0 md:static md:flex md:z-auto`}
      >
        <div>
          <div className='flex items-center justify-center gap-3 mt-5 md:mt-0'>
            <Link
              href="/admin/blogs"
              className="font-extrabold text-xl tracking-wide"
            >
              FEDOLAB
            </Link>
          </div>

          <nav className='mt-8'>
            <ul className="flex flex-col gap-1">
              {profileLinks.map((link: ProfileLink) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={`p-3 flex items-center gap-3 rounded-md text-slate-500 hover:bg-gray-200 hover:text-black
            ${pathname === link.href ? 'bg-black text-white' : ''}
          `}
                    onClick={() => setIsOpen(false)} // Close sidebar on mobile after click
                  >
                    {link.icon}
                    <p className="text-sm">{link.label}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* Logout Button */}
        <button
          onClick={handleLogOut}
          className="flex items-center p-3 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
        >
          <FiLogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
