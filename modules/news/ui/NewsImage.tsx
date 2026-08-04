"use client";

import { useState } from "react";

interface NewsImageProps {
    src?: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

const NewsImage = ({
    src,
    alt,
    className = "",
    containerClassName = "",
}: NewsImageProps) => {

    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return null;
    }

    return (
        <div className={containerClassName}>
            <img
                src={src}
                alt={alt}
                className={className}
                onError={() => setHasError(true)}
            />
        </div>
    );
};

export default NewsImage;