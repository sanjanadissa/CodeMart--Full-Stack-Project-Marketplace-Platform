import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin once globally
gsap.registerPlugin(ScrollTrigger);

// Export configured instances
export { gsap, ScrollTrigger };

// Utility function to create a scoped cleanup
export const createScrollTriggerCleanup = (triggers: ScrollTrigger[]) => {
    return () => {
        triggers.forEach((trigger) => trigger.kill());
    };
};
