import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Code, Github, Twitter, Linkedin } from "lucide-react";
import footerimg from "../assets/footerimg.jpg";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Register ScrollTrigger plugin
  //   gsap.registerPlugin(ScrollTrigger);

  //   const footerTriggers: ScrollTrigger[] = [];

  //   if (footerRef.current && imageRef.current && contentRef.current) {
  //     // Pin the footer image when it reaches the top of viewport
  //     const pinTrigger = ScrollTrigger.create({
  //       trigger: imageRef.current,
  //       start: "top top",
  //       end: "bottom top",
  //       pin: true,
  //       pinSpacing: false,
  //       scrub: false,
  //     });
  //     footerTriggers.push(pinTrigger);

  //     // Animate the footer content to slide up over the pinned image
  //     const slideAnimation = gsap.fromTo(
  //       contentRef.current,
  //       { y: "100%" },
  //       {
  //         y: "0%",
  //         scrollTrigger: {
  //           trigger: imageRef.current,
  //           start: "top top",
  //           end: "bottom top",
  //           scrub: 1,
  //         },
  //       }
  //     );
      
  //     // Store the ScrollTrigger from the animation
  //     if (slideAnimation.scrollTrigger) {
  //       footerTriggers.push(slideAnimation.scrollTrigger);
  //     }
  //   }

  //   // Cleanup function - only kill this footer's triggers
  //   return () => {
  //     footerTriggers.forEach((trigger) => trigger.kill());
  //   };
  // }, []);

  return (

    <div>
      {/* Footer Hero Container */}
      <div
        ref={imageRef}
        className="w-screen h-screen flex items-center justify-center"
      >
        <div className="bg-[#0E0E0E] rounded-3xl w-full overflow-hidden max-w-[1700px] mx-auto mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 py-12 pr-12 pl-15 lg:py-16 lg:pr-16 lg:pl-20">
            <div className="flex flex-col justify-center text-white">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/80">
                Join thousands of developers on CodeMart
              </p>
              <div>
                <Link
                  to="/signup"
                  className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Get Started Now
                </Link>
              </div>
            </div>

            {/* Image Section - Right */}
            <div className="flex items-center justify-center">
              <div 
                className="w-full h-full lg:h-[600px] bg-cover bg-center rounded-2xl"
                style={{ backgroundImage: `url(${footerimg})` }}
              />
            </div>
          </div>
        </div>
      </div>
    <footer ref={footerRef} className="relative">
      

      {/* Actual Footer Content - Overlapping */}
      <div
        ref={contentRef}
        className="relative bg-[#121212] text-white rounded-t-3xl shadow-2xl z-20 max-w-full"
      >
        <div className="px-6 sm:px-8 lg:px-12 py-32">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <Link
                to="/"
                className="flex items-center space-x-2 text-2xl font-bold mb-4"
              >
                <Code className="h-8 w-8 text-white" />
                <span className="text-white">CodeMart</span>
              </Link>
              <p className="text-white/75 mb-4">
                The premier marketplace for buying and selling software
                projects. Connect with developers worldwide and find your next
                project or sell your creation.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-white/75 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-white/75 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-white/75 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white/95">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/projects"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sell"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    Sell Project
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white/95">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-white/75 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Developers */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white/95">
                Developers
              </h3>
              <div className="space-y-4">
                {/* Sanjana Dissanayaka */}
                <div className="bg-[#2e2e2e] rounded-lg p-3">
                  <h4 className="text-[#a2a2a2] font-medium text-sm mb-2">
                    Sanjana Dissanayaka
                  </h4>
                  <div className="flex space-x-2">
                    <a
                      href="https://github.com/sanjanadissa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a2a2a2] hover:text-white transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sanjana-dissanayake-b04963302/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a2a2a2] hover:text-white transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Harin Dulneth */}
                <div className="bg-[#2e2e2e] rounded-lg p-3">
                  <h4 className="text-[#a2a2a2] font-medium text-sm mb-2">
                    Harin Dulneth
                  </h4>
                  <div className="flex space-x-2">
                    <a
                      href="https://github.com/HarinDulneth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a2a2a2] hover:text-white transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/harin-dulneth-1b8455352/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#a2a2a2] hover:text-white transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Content Section */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-white/95">
                  Join Our Community
                </h4>
                <p className="text-[#b9b9b9] text-sm">
                  Connect with thousands of developers, share your projects, and
                  discover amazing software solutions.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-white/95">
                  Start Selling Today
                </h4>
                <p className="text-[#b9b9b9] text-sm">
                  Turn your code into cash. List your projects and start earning
                  from your development work.
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold mb-4 text-white/95">
                  Quality Assured
                </h4>
                <p className="text-[#b9b9b9] text-sm">
                  Every project is reviewed by our team to ensure high quality
                  and functionality.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-20 text-center text-white/45">
            <p>&copy; 2025 CodeMart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;