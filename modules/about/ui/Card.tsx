import Image from "next/image";
import React, { forwardRef } from "react";

interface CardProps {
  id: string;
  frontSrc: string;
  frontAlt: string;
  backText: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, frontSrc, frontAlt, backText }, ref) => {
    return (
      <div className="card text-black" id={id} ref={ref}>
        <div className="card-wrapper">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <Image
                src={frontSrc}
                alt={frontAlt}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flip-card-back">
              <p>{backText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
