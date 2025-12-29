import { useEffect } from "react";
import styles from "./HowItWorks.module.css";
import { gsap, ScrollTrigger } from "@/utils/gsapConfig";
import Lenis from "@studio-freight/lenis";

export default function HowItWorksScroll() {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Get elements
    const pinnedSection = document.querySelector(`.${styles.pinned}`) as HTMLElement;
    const stickyHeader = document.querySelector(`.${styles["sticky-header"]}`) as HTMLElement;
    const cards = document.querySelectorAll(`.${styles.card}`);
    const progressBarContainer = document.querySelector(`.${styles["progress-bar"]}`) as HTMLElement;
    const progressBar = document.querySelector(`.${styles.progress}`) as HTMLElement;
    const indicesContainer = document.querySelector(`.${styles.indices}`) as HTMLElement;
    const indices = document.querySelectorAll(`.${styles.index}`);

    const cardCount = cards.length;
    const pinnedHeight = window.innerHeight * (cardCount + 1);
    const startRotations = [0, 5, 0, -5];
    const endRotations = [-10, -5, 10, 5];
    const progressColors = ["#ecb74c", "#7dd8cd", "#e0ff57", "#7dd8cd"];

    cards.forEach((card, index) => {
      gsap.set(card, { rotation: startRotations[index] });
    });

    let isProgressBarVisible = false;
    let currentActiveIndex = -1;

    function animateIndexOpacity(newIndex: number) {
      if (newIndex !== currentActiveIndex) {
        indices.forEach((indexEl, i) => {
          gsap.to(indexEl, {
            opacity: i === newIndex ? 1 : 0.25,
            duration: 0.5,
            ease: "power2.out",
          });
        });
        currentActiveIndex = newIndex;
      }
    }

    function showProgressAndIndices() {
      gsap.to([progressBarContainer, indicesContainer], {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      isProgressBarVisible = true;
    }

    function hideProgressAndIndices() {
      gsap.to([progressBarContainer, indicesContainer], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      isProgressBarVisible = false;
      animateIndexOpacity(-1);
    }

    const mainTrigger = ScrollTrigger.create({
      trigger: pinnedSection,
      start: "top top",
      end: `+=${pinnedHeight}`,
      pin: true,
      pinSpacing: true,
      onLeave: () => hideProgressAndIndices(),
      onEnterBack: () => showProgressAndIndices(),
      onUpdate: (self) => {
        const progress = self.progress * (cardCount + 1);
        const currentCard = Math.floor(progress);

        if (progress <= 1) {
          gsap.to(stickyHeader, { opacity: 1 - progress, duration: 0.1, ease: "none" });
        } else {
          gsap.set(stickyHeader, { opacity: 0 });
        }

        if (progress > 1 && !isProgressBarVisible) showProgressAndIndices();
        else if (progress <= 1 && isProgressBarVisible) hideProgressAndIndices();

        let progressHeight = 0;
        let colorIndex = -1;
        if (progress > 1) {
          progressHeight = ((progress - 1) / cardCount) * 100;
          colorIndex = Math.min(Math.floor(progress - 1), cardCount - 1);
        }

        gsap.to(progressBar, {
          height: `${progressHeight}%`,
          backgroundColor: progressColors[colorIndex],
          duration: 0.3,
          ease: "power1.out",
        });

        if (isProgressBarVisible) animateIndexOpacity(colorIndex);

        cards.forEach((card, index) => {
          if (index < currentCard) {
            gsap.set(card, { top: "50%", rotation: endRotations[index] });
          } else if (index === currentCard) {
            const cardProgress = progress - currentCard;
            const newTop = gsap.utils.interpolate(150, 50, cardProgress);
            const newRotation = gsap.utils.interpolate(
              startRotations[index],
              endRotations[index],
              cardProgress
            );
            gsap.set(card, { top: `${newTop}%`, rotation: newRotation });
          } else {
            gsap.set(card, { top: "150%", rotation: startRotations[index] });
          }
        });
      },
    });

    return () => {
      // Only kill this component's ScrollTrigger
      mainTrigger.kill();
      gsap.killTweensOf([progressBarContainer, indicesContainer, stickyHeader, ...Array.from(cards), ...Array.from(indices)]);
      lenis.destroy();
    };
  }, []);

  return (
    <section className={styles.pinned}>
      <div className={styles["sticky-header"]}>
        <h1>How It Works</h1>
      </div>

      <div className={styles["progress-bar"]}>
        <div className={styles.progress}></div>
      </div>

      <div className={styles.indices}>
        <div className={`${styles.index} ${styles["index-1"]}`}>
          <p>May 15th</p>
          <p>Beta Launch</p>
        </div>
        <div className={`${styles.index} ${styles["index-2"]}`}>
          <p>May 15th</p>
          <p>Beta Launch</p>
        </div>
        <div className={`${styles.index} ${styles["index-3"]}`}>
          <p>May 15th</p>
          <p>Beta Launch</p>
        </div>
        <div className={`${styles.index} ${styles["index-4"]}`}>
          <p>Click checkout</p>
          <p>Do your purchases</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles["card-1"]}`}>
        <div className={styles["card-phase"]}>
          <p>Phase #01</p>
        </div>
        <div className={styles["card-title"]}>
          <h1>
            Beta <span className={styles.gradientText}>Launch</span>
          </h1>
          <p>From May 15th</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles["card-2"]}`}>
        <div className={styles["card-phase"]}>
          <p>Phase #02</p>
        </div>
        <div className={styles["card-title"]}>
          <h1>
            Beta <span>Launch</span>
          </h1>
          <p>From May 15th</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles["card-3"]}`}>
        <div className={styles["card-phase"]}>
          <p>Phase #03</p>
        </div>
        <div className={styles["card-title"]}>
          <h1>
            Purchase <span>& Download</span>
          </h1>
          <p>Securely purchase your chosen projects and get instant access to source code and documentation.</p>
        </div>
      </div>

      <div className={`${styles.card} ${styles["card-4"]}`}>
        <div className={styles["card-phase"]}>
          <p>Phase #04</p>
        </div>
        <div className={styles["card-title"]}>
          <h1>
            Customize <span>& Deploy</span>
          </h1>
          <p>Customize the code to fit your needs and deploy your application with confidence.</p>
        </div>
      </div>
    </section>
  );
}