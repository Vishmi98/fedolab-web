"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getCookieUser } from '@/utils/cookie.util'
import Blogs from '@/modules/blogs/ui/admin/Blogs'


const BlogsPage = () => {
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/sign_in');
        }
    }, [user, router]);

    return (
        <Blogs />
    )
}

export default BlogsPage
