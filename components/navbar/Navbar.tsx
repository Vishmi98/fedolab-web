"use client"

import React, { useState } from 'react'

import MobileNavbar from './MobileNavbar'
import DesktopNavbar from './DesktopNavbar'

const Navbar = () => {
    const [showNav, setShowNav] = useState(false);
    const showNavHandler = () => setShowNav(true);
    const closeNavHandler = () => setShowNav(false);

    return (
        <div className='overflow-hidden'>
            <MobileNavbar showNav={showNav} closeNav={closeNavHandler} />
            <DesktopNavbar openNav={showNavHandler} />
        </div>
    )
}

export default Navbar