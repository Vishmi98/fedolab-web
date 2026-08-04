import { Variants } from "framer-motion";

export const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.8,
        },
    },
};

export const textVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" } },
};

export const waveContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

export const characterVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
        y: "0%",
        opacity: 1,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 120,
            duration: 0.8,
        },
    },
};

export const descriptionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export const mediaVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 1,
            ease: "easeOut",
            delay: 0.8,
        },
    },
};

export const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            delay: i * 0.1,
        },
    }),
};

export const headerVariants: Variants = {
    hidden: { x: 0 }, // default position
    visible: {
        x: 150, // slide to right
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export const paragraphVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: "easeOut" },
    },
};

export const buttonVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const slideRightToLeft: Variants = {
    hidden: {
        x: 80,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export const rowVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const itemVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const shakeAnimation: Variants = {
    hover: {
        rotate: [0, -0.5, 0.5, -0.5, 0.5, 0], // rotate back and forth
        transition: { duration: 0.8 }, // half second for one shake cycle
    },
};

export const bounceIconVariants: Variants = {
    animate: {
        y: [0, -8, 0],
        transition: {
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};

