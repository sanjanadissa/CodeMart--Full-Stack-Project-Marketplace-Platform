import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { cn } from "@/lib/utils";

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
  const container = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

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
        start: "top top",
        end: `+=${window.innerHeight * (totalCards - 1)}`,
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
        position
      );

      scrollTimeline.to(
        nextImage,
        {
          y: "0%",
          duration: 1,
          ease: "none",
        },
        position
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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, [cards.length]);

  return (
    <div className={cn("relative h-screen w-full", className)} ref={container}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div
          className={cn(
            "relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || ""}
              className={cn(
                "absolute h-full w-full object-cover rounded-lg",
                imageClassName
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
      image: "/src/assets/projectex.png",
      alt: "Project showcase 1",
    },
    {
      id: 2,
      image: "/src/assets/vs1.png",
      alt: "Visual Studio Code",
    },
    {
      id: 3,
      image: "/src/assets/New folder/61164f31a004c_visual_studio_code_python_ide.png",
      alt: "Python IDE",
    },
    {
      id: 4,
      image: "/src/assets/New folder/jetbrains-pycharm.jpg",
      alt: "PyCharm IDE",
    },
    {
      id: 5,
      image: "/src/assets/New folder/0-software-development-business-plan.jpg",
      alt: "Software Development",
    },
  ];

  return (
    <div className="h-full w-full bg-black">
      <StickyCard002 cards={defaultCards} />
    </div>
  );
};

export { Skiper17, StickyCard002 };
