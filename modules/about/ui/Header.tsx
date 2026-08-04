"use client"

import { motion } from "framer-motion";

import { characterVariants, waveContainer } from "@/constants/animations";


const Header = () => {
  const h1Text = "About us";
  const h1Characters = Array.from(h1Text);

  return (
    <motion.section
      className="w-[90%] mx-auto py-26 md:py-30"
      variants={waveContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h1 className="text-6xl md:text-[11rem] 2xl:text-[15rem] text-center uppercase font-semibold text-white">
        {h1Characters.map((char, index) => (
          <motion.span key={index} className="inline-block" variants={characterVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>
    </motion.section >
  )
}

export default Header