"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/utils/gsapConfig";
import ReactLenis from "lenis/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

import img1 from "../../assets/New folder/61164f31a004c_visual_studio_code_python_ide.png";
import img2 from "../../assets/New folder/select-debug-pane.png";
import img3 from "../../assets/New folder/jetbrains-pycharm.jpg";
import img4 from "../../assets/New folder/0-software-development-business-plan.jpg";
import img5 from "../../assets/New folder/original-f751ef2ec4eeea44109378c2e3baf063.webp";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      const imageElements = imageRefs.current;
      const totalCards = imageElements.length;

      if (!imageElements[0]) return;

      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top center",
          end: `+=${window.innerHeight * (totalCards)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;
        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.7,
            rotation: 5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        // Only kill the ScrollTrigger associated with this timeline
        if (scrollTimeline.scrollTrigger) {
          scrollTimeline.scrollTrigger.kill();
        }
      };
    },
    { scope: container },
  );

  return (
    <div className={cn("relative w-full", className)} style={{ minHeight: '100vh' }} ref={container}>
      <div className="sticky-cards relative flex w-full items-center justify-center overflow-hidden p-3 lg:p-8" style={{ minHeight: '100vh' }}>
        <div
          className={cn(
            "relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || ""}
              className={cn(
                "rounded-4xl absolute h-full w-full object-cover",
                imageClassName,
              )}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component with default data
const Skiper17 = () => {
  const defaultCards = [
    {
    id: 1,
    image: img1,
  },
  {
    id: 2,
    image: img2,
  },
  {
    id: 3,
    image: img3,
  },
  {
    id: 4,
    image: img4,
  },
  {
    id: 5,
    image: img5,
  },
  ];

  return (
    <ReactLenis root>
      <div className="h-full w-full mt-70">
        <StickyCard002 cards={defaultCards} />
      </div>
    </ReactLenis>
  );
};

export { Skiper17, StickyCard002 };