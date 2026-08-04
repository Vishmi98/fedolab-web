"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';

import { getCookieUser } from '@/utils/cookie.util';


const AdminPage = () => {
  const user = getCookieUser()
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/sign_in');
    }
  }, [user, router]);

  return (
    <div>

    </div>
  )
}

export default AdminPage
