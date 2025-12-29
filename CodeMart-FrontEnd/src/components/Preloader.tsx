import { useEffect } from "react";
import gsap from "gsap";
import "./Preloader.css"; // put your CSS here
import download from "../assets/download.png";

const Preloader = () => {
  useEffect(() => {
    splitTextIntoSpans(".preloader-logo p");
    splitTextIntoSpans(".preloader-hero-copy h1");

    gsap.to(".preloader-img-holder img", {
      left: 0,
      stagger: 0.1,
      ease: "power4.out",
      duration: 1.5,
      delay: 4,
    });

    gsap.to(".preloader-img-holder img", {
      left: "110%",
      stagger: -0.1,
      ease: "power4.out",
      duration: 1.5,
      delay: 7,
    });

    startLoader();
  }, []);

  const splitTextIntoSpans = (selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    const text = element.innerText;
    element.innerHTML = text
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
  };

  const startLoader = () => {
    const counterElement = document.querySelector<HTMLElement>(
      ".preloader-counter p"
    );
    if (!counterElement) return;

    const duration = 3500; // total duration in ms
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const raw = progress * 100;
      const value = Math.round(raw / 5) * 5; // step of 5

      counterElement.innerHTML =
        value
          .toString()
          .split("")
          .map((char) => `<span>${char}</span>`)
          .join("") + "<span>%</span>";

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        animateText();
      }
    };

    const animateText = () => {
      setTimeout(() => {
        gsap.to(".preloader-counter p span", {
          top: "-400px",
          stagger: 0.1,
          ease: "power3.inOut",
          duration: 1,
        });

        gsap.to(".preloader-logo p span", {
          top: "0",
          stagger: 0.1,
          ease: "power3.inOut",
          duration: 1,
        });

        gsap.to(".preloader-logo p span", {
          top: "-400px",
          stagger: 0.1,
          ease: "power3.inOut",
          duration: 1,
          delay: 3,
        });

        gsap.to(".preloader-overlay", {
          opacity: 0,
          ease: "power3.inOut",
          duration: 1,
          delay: 4,
          onComplete: () => {
            const overlay = document.querySelector<HTMLElement>(
              ".preloader-overlay"
            );
            if (overlay) {
              overlay.style.pointerEvents = "none";
              overlay.style.display = "none";
            }
          },
        });

        gsap.to(".preloader-hero img", {
          scale: 1,
          ease: "power3.inOut",
          duration: 2,
          delay: 3.5,
        });

        gsap.to(".preloader-hero-copy h1 span", {
          top: "0",
          stagger: 0.1,
          ease: "power3.inOut",
          duration: 2,
          delay: 4,
        });

        gsap.to(".preloader-nav", {
          top: "0",
          ease: "power3.inOut",
          duration: 2,
          delay: 4,
        });
      }, 300);
    };

    requestAnimationFrame(tick);
  };

  return (
    <div className="preloader-overlay">
      <div className="preloader-overlay-content">
        <div className="preloader-images">
          <div className="preloader-img-holder">
            <img src={download} alt="" />
            <img src={download} alt="" />
            <img src={download} alt="" />
            <img src={download} alt="" />
          </div>
        </div>

        <div className="preloader-text">
          <div className="preloader-counter">
            <p>100%</p>
          </div>

          <div className="preloader-logo">
            <p>CodeMart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
