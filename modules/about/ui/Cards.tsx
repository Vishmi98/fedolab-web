"use client";

import { useRef } from "react";
import ReactLenis from "@studio-freight/react-lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

import Card from "./Card";
import { paragraphVariants } from "@/constants/animations";

gsap.registerPlugin(ScrollTrigger);

const Cards = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current;
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      /* =========================
         DESKTOP ANIMATION
      ========================== */
      mm.add("(min-width: 769px)", () => {
        const cardsSection =
          container.current?.querySelector(".cards");
        if (!cardsSection) return;

        const positions = [14, 38, 62, 86];
        const rotations = [-15, -7.5, 7.5, 15];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardsSection,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1,
          },
        });

        // Spread cards
        tl.to(cards, {
          left: (i) => `${positions[i]}%`,
          rotate: (i) => rotations[i],
          ease: "none",
          duration: 1,
        });

        // Flip cards
        cards.forEach((card) => {
          const front = card.querySelector(".flip-card-front");
          const back = card.querySelector(".flip-card-back");

          if (!front || !back) return;

          tl.to(front, { rotateY: -180 }, "-=0.5")
            .to(back, { rotateY: 0 }, "<")
            .to(card, { rotate: 0 }, "<");
        });
      });

      /* =========================
         MOBILE ANIMATION
      ========================== */
      mm.add("(max-width: 768px)", () => {
        cards.forEach((card) => {
          const front = card.querySelector(".flip-card-front");
          const back = card.querySelector(".flip-card-back");

          if (!front || !back) return;

          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 70%",
              end: "top 30%",
              scrub: true,
            },
          })
            .to(front, {
              rotateY: -180,
              ease: "power1.inOut",
            })
            .to(
              back,
              {
                rotateY: 0,
                ease: "power1.inOut",
              },
              "<"
            );
        });
      });

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <ReactLenis root>
      <div ref={container} className="mainContainer text-white">
        <div className="container md:px-4">
          <motion.h1
            className="text-5xl md:text-7xl text-center my-20"
            variants={paragraphVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            Everything You Can Use to Improve Your Business
          </motion.h1>

          <section className="cards relative md:h-screen overflow-hidden pt-30">
            {[...Array(4)].map((_, index) => (
              <Card
                key={index}
                id={`card-${index + 1}`}
                frontSrc="/card.jpg"
                frontAlt="Card image"
                backText="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                ref={(el) => {
                  if (el) cardRefs.current[index] = el;
                }}
              />
            ))}
          </section>

          {/* spacer */}
          <div className="h-screen" />
        </div>
      </div>
    </ReactLenis>
  );
};

export default Cards;
