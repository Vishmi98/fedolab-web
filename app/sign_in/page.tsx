"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

import { getCookieUser } from '@/utils/cookie.util';
import LoginForm from '@/modules/auth/ui/LoginForm';


const SignInPage = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const user = getCookieUser();
        if (user) {
            router.push('/admin/treatments');
            console.log("user", user);
            
        } else {
            setChecking(false);
        }
    }, [router]);

    if (checking) {
        return null; 
    }

    
    return (
        <div className="h-screen flex items-center justify-center py-[5rem] px-4 md:px-0">
            <div className="flex w-[95%] md:w-[70%] gap-[2rem] md:gap-[3rem] mx-auto items-center justify-center">
                {/* Form Section */}
                <div className="w-full md:w-2/3 lg:w-1/2 flex items-start justify-start">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default SignInPage
