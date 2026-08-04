"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getCookieUser } from '@/utils/cookie.util'
import Projects from '@/modules/projects/ui/admin/Projects'


const ProjectsPage = () => {
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/sign_in');
        }
    }, [user, router]);

    return (
        <Projects />
    )
}

export default ProjectsPage
