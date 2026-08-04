"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { getCookieUser } from '@/utils/cookie.util'
import Inquiries from '@/modules/contact/ui/admin/Inquiries'


const InquiriesPage = () => {
    const user = getCookieUser()
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/sign_in');
        }
    }, [user, router]);

    return (
        <Inquiries />
    )
}

export default InquiriesPage
