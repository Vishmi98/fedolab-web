"use client";

import React from 'react'

import EmailVerificationForm from '@/modules/auth/ui/EmailVerificationForm';


const EmailVerificationPage = () => {
  return (
    <div className="h-screen flex items-center justify-center py-[5rem] px-4 md:px-0">
      <div className="flex w-[95%] md:w-[70%] gap-[2rem] md:gap-[3rem] mx-auto items-center justify-center">
        {/* Form Section */}
        <div className="w-full md:w-3/4 lg:w-1/2 flex items-start justify-start">
          <EmailVerificationForm />
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPage