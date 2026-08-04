"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { shakeAnimation } from "@/constants/animations";

export interface FeaturedWorkCardProps {
  title: string;
  description: string;
  image: string;
  link?: string;
}

const FeaturedWorkCard: React.FC<FeaturedWorkCardProps> = ({
  title,
  description,
  image,
  link = "#",
}) => {
 
  return (
    <Link href={`/projects/${link}`}>
      <div className="group cursor-pointer space-y-2 mb-2 md:mb-5">
        <motion.div
          className="relative h-[350px] md:h-[500px] rounded-4xl overflow-hidden"
          variants={shakeAnimation}
          whileHover="hover"
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </motion.div>
        <p>
          <span className="font-extrabold tracking-wide md:text-2xl">{title}</span> - {description}
        </p>
      </div>
    </Link>
  );
};

export default FeaturedWorkCard;
