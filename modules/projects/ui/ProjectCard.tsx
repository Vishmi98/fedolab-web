"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { ProjectDataType } from "../projects.types";

import { shakeAnimation } from "@/constants/animations";


export interface ProjectCardProps {
  project: ProjectDataType
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {

  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="group cursor-pointer space-y-2 mb-2 md:mb-5">
        <motion.div
          className="relative w-full h-[320px] sm:h-[350px] md:h-[420px] lg:h-[480px] xl:h-[500px] 2xl:h-[600px] rounded-3xl md:rounded-4xl overflow-hidden"
          variants={shakeAnimation}
          whileHover="hover"
        >
          <Image
            src={project.thumbnailImagePath}
            alt={project.title}
            fill
            className="object-cover"
          />
        </motion.div>
        <p>
          <span className="font-extrabold tracking-wide md:text-2xl">{project.title}</span> - {project.shortDescription}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
