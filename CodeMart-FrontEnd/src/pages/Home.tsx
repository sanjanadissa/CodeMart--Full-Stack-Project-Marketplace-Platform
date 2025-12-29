import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, Users, Shield, Code2, Loader2 } from "lucide-react";
import "./Home.css";
import { gsap, ScrollTrigger } from "@/utils/gsapConfig";
import novs from "../assets/projectex.png";
import vs from "../assets/vs1.png";
import Featured_05 from "@/components/ui/globe-feature-section";
import ReactLenis from "lenis/react";
// Import images from New folder
import img1 from "../assets/New folder/61164f31a004c_visual_studio_code_python_ide.png";
import img2 from "../assets/New folder/select-debug-pane.png";
import img3 from "../assets/New folder/jetbrains-pycharm.jpg";
import img4 from "../assets/New folder/0-software-development-business-plan.jpg";
import img5 from "../assets/New folder/original-f751ef2ec4eeea44109378c2e3baf063.webp";
import img6 from "../assets/New folder/images.jpg";
import img7 from "../assets/New folder/images (1).jpg";
import img8 from "../assets/New folder/images (2).jpg";
import TeamCarousel from "../components/TeamCarousel";
import HowItWorksScroll from "../components/ui/How/HowItWorks";
import { Gallery6 } from "../components/ui/gallery6";
import DemoOne from "../components/DemoOne";
import { ThreeDMarquee } from "../components/ui/3d-marquee";
import api from "../services/api";
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import CountUp from "@/components/ui/count-up";
import ScrollStack, { ScrollTimeline } from "@/components/ui/scroll-timeline";
import { InfiniteTestimonialsCarousel, Testimonial } from "../components/InfiniteTestimonialsCarousel";

const Home = () => {
  const navigate = useNavigate();

  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Only initialize animations after loading is complete
    if (isLoading) return;

    const triggers: ScrollTrigger[] = [];
    const animations: gsap.core.Tween[] = [];

    // Initialize comparison animations
    gsap.utils.toArray(".comparisonSection").forEach((section: any) => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top+=350 center",
          // makes the height of the scrolling (while pinning) match the width, thus the speed remains constant (vertical/horizontal)
          end: () => "+=" + section.offsetWidth,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: "none" },
      });
      // animate the container one way...
      tl.fromTo(
        section.querySelector(".afterImage"),
        { xPercent: 100, x: 0 },
        { xPercent: 0 }
      )
        // ...and the image the opposite way (at the same time)
        .fromTo(
          section.querySelector(".afterImage img"),
          { xPercent: -100, x: 0 },
          { xPercent: 0 },
          0
        );
      
      // Store this component's ScrollTrigger
      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    document.querySelectorAll(".ticker").forEach((ticker) => {
      const inner = ticker.querySelector(".ticker-wrap");
      if (!inner) return; // prevent null error

      const content = inner.querySelector(".ticker-text");
      if (!content) return; // prevent null error

      const duration = ticker.getAttribute("data-duration") || "10";

      // Clone content
      inner.append(content.cloneNode(true));

      const tickerAnimations: gsap.core.Tween[] = [];

      inner.querySelectorAll(".ticker-text").forEach((element) => {
        const animation = gsap.to(element, {
          x: "-100%",
          repeat: -1,
          duration: Number(duration),
          ease: "linear",
        });
        tickerAnimations.push(animation);
        animations.push(animation);
      });

      ticker.addEventListener("mouseenter", () => {
        tickerAnimations.forEach((anim) => anim.pause());
      });

      ticker.addEventListener("mouseleave", () => {
        tickerAnimations.forEach((anim) => anim.play());
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      animations.forEach((anim) => anim.kill());
    };
  }, [isLoading]);

  const calculateRating = (project: any) => {
    if (!project?.review || project.review.length === 0) return 0;

    const total = project.review.reduce(
      (sum: number, r: any) => sum + r.rating,
      0
    );

    var num = Number((total / project.review.length).toFixed(1));
    return num;
  };

  const mapEnumToCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "WebDevelopment": "Web Development",
      "MobileDevelopment": "Mobile Development",
      "ArtificialIntelligence": "Artificial Intelligence",
      "DesktopApps": "Desktop Apps",
      "APIs": "APIs",
      "Games": "Game Development",
      "DevOps": "DevOps",
      "MachingLearning": "Maching Learning",
     
    };
    return categoryMap[category] || category;
  };

 const events = [
  {
    year: "Step 1",
    title: "Discover Premium Software Solutions",
    subtitle: "Curated Marketplace Excellence",
    description: "Discover thousands of high-quality software projects across various categories including Web Development, Mobile Apps, AI/ML, Desktop Applications, and more. Use filters and search to find exactly what you need."
  },
  {
    year: "Step 2",
    title: "Evaluate & Verify Quality",
    subtitle: "Data-Driven Decision Making",
    description: "View detailed project information, check ratings and reviews from other buyers, preview screenshots, and examine the technology stack. Read seller descriptions and verify project quality before making a purchase."
  },
  {
    year: "Step 3",
    title: "Complete Secure Checkout",
    subtitle: "Enterprise-Grade Security",
    description: "Complete your purchase using our secure payment gateway powered by Stripe. Your payment information is protected with industry-standard encryption, ensuring a safe transaction every time."
  },
  {
    year: "Step 4",
    title: "Instant Access & Deployment",
    subtitle: "Seamless Integration Ready",
    description: "After successful payment, instantly access your purchased projects from your dashboard. Download all project files, documentation, and resources. Access your purchases anytime from the 'Purchased' section."
  },
  {
    year: "Step 5",
    title: "Monetize Your Expertise",
    subtitle: "Transform Code into Revenue",
    description: "Ready to monetize your work? Upload your own software projects, set your price, and reach thousands of potential buyers worldwide. Manage your listings, track sales, and grow your developer business on CodeMart."
  },
]

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setIsLoading(true);
        const data = await api.projects.getFeatured();
        console.log(data);
        setFeaturedProjects(data);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedProjects();
  }, []);

  // const stats = [
  //   { label: "Projects Sold", value: "10,000+", icon: Code2 },
  //   { label: "Happy Customers", value: "5,000+", icon: Users },
  //   { label: "Average Rating", value: "4.8", icon: Star },
  //   { label: "Secure Transactions", value: "100%", icon: Shield },
  // ];

  const testimonials = [
    {
      quote:
        "I was able to earn from my university projects through CodeMart. The platform is simple and very supportive for students.",
      name: "Sithika Galappaththi",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Purchasing a project from CodeMart helped us save development time and launch faster.",
      name: "Hiruna Mendis",
      designation: "CTO at InnovateSphere",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEm6DNUG3b3vS1bc4CXcwZAxtNX-LyKolvVA&s",
    },
    {
      quote:
        "CodeMart makes it easy to sell real software projects and connect with serious buyers worldwide.",
      name: "Ravindu Gamage",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The seller dashboard is clean and easy to use. Managing projects and tracking sales is very smooth.",
      name: "Kavindu Pasan",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "I appreciate that CodeMart focuses on functional software projects instead of just basic templates.",
      name: "Devinda Rajawardhana",
      designation: "Engineering Lead at DataPro",
      src: "https://media.istockphoto.com/id/1919265357/photo/close-up-portrait-of-confident-businessman-standing-in-office.jpg?s=612x612&w=0&k=20&c=ZXRPTG9VMfYM3XDo1UL9DEpfO8iuGVSsyh8dptfKQsQ=",
    },
    {
      quote:
        "Secure payments and quality reviews make CodeMart a trustworthy platform for both buyers and sellers.",
      name: "Renuja Sathnidu",
      designation: "Engineering Lead at DataPro",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAc5N0YKSfk82YaBDHGYbMCHfcumjb5EmCEA&s",
    },
    {
      quote:
        "Uploading projects and managing listings is straightforward. The platform feels well structured.",
      name: "Dasun Adithya",
      designation: "Engineering Lead at DataPro",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiF2ZPC9kxQyqk0RM9H0NyNJYcnR_1KDLvYQ&s",
    },
    {
      quote:
        "We found high-quality software projects that were easy to customize for our business needs.",
      name: "Awanki Thathsarani",
      designation: "VP of Technology at FutureNet",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1-LFTGXQ4j-DAqfnDenm0_Wjeaah1Aq7nTxvEG4r-KQ&s",
    },
     {
      quote:
        "CodeMart helped me turn my final-year project into a useful product and earn from it.",
      name: "Pansilu Jayawardhana",
      designation: "VP of Technology at FutureNet",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVTmoFIup_59JNV8ZqfukXqEwzr1R_mEi4sw&s",
    },
     {
      quote:
        "This platform motivates students to improve their projects and gain real-world experience.",
      name: "Minidu Mandira",
      designation: "VP of Technology at FutureNet",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThIF1mMjjuiByF3ZqKOHQS2PTrCE-Bn0dJAw&s",
    },
     {
      quote:
        "CodeMart helped me convert my university work into income. The platform feels supportive and well designed.",
      name: "Mavithya Mihirud",
      designation: "VP of Technology at FutureNet",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ_AakfkA5jDrdWPRTWcuOdYeN9sQTdtCSkw&s",
    },
    
  ];

  const stats = [
  {
    value: "5000",
    suffix: "+",
    label: "Projects Listed",
    description: "High-quality software projects across multiple categories available."
  },
  {
    value: "2500",
    suffix: "+",
    label: "Active Developers",
    description: "Talented developers worldwide selling innovative solutions."
  },
  {
    value: "12000",
    suffix: "+",
    label: "Projects Sold",
    description: "Successfully completed transactions connecting buyers with software."
  },
  {
    value: "98",
    suffix: "%",
    label: "Satisfaction Rate",
    description: "Customer satisfaction rating based on verified buyer reviews."
  },
];

  // Show loading screen while fetching featured projects
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400/50" />
        </div>
      </div>
    );
  }

  const homeReviews: Testimonial[] = testimonials.map((t, index) => ({
    id: index,
    avatar: t.src,
    name: t.name,
    platform: "google",
    rating: 5,
    text: t.quote,
    date: "2024",
  }));

  return (
    <ReactLenis root>
      <div className="animate-fade-in relative">
      {/* <div
        className="
    absolute inset-x-0 top-0 h-[50vh]
    bg-[radial-gradient(115%_100%_at_75%_0%,rgba(150,25,255,0.5)_0%,rgba(165,50,255,0.5)_25%,rgba(200,75,255,0.5)_50%,transparent_95%)]
    -z-2
    pointer-events-none
  "
      ></div> */}
      <div
        className="
    absolute inset-x-0 top-0 h-[50vh]
    pointer-events-none -z-2
    gradient-animate
    bg-[radial-gradient(115%_100%_at_70%_0%,rgba(150,50,255,0.5)_0%,rgba(200,100,255,0.5)_40%,transparent_95%)]
  "
      ></div>

      {/* Hero Section */}
      <div className="relative z-10">
        <section className="relative bg-gradient-to-br from-white/20 via-gray-100/20 to-indigo-100/20 text-gray-900 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-0"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up text-transparent bg-clip-text bg-gradient-to-l from-[#200a33] to-[#51197f]">
                Buy & Sell
                <span className="block text-transparent bg-clip-text bg-gradient-to-l from-[#200a33] to-[#51197f]">
                  Software Projects
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto animate-slide-up">
                Discover amazing software projects or sell your own creations to
                developers worldwide
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link
                  to="/projects"
                  className="group btn text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-transform duration-300 hover:scale-105 flex items-center bg-gradient-to-r from-[#591A89] to-[#8C3597] justify-center hover:bg-indigo-700"  /* bg-gradient-to-r from-[rgb(65,0,165)] to-[rgb(110,0,165)] */
                >
                  Browse Projects
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/sell"
                  className="bg-white text-[#1F004D] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-transform hover:scale-105 duration-300 border border-[#1F004D]"
                >
                  Start Selling
                </Link>
              </div>

              {/* App Preview (centered, glowing, glassy) */}
              <div className="relative flex justify-center mt-16 animate-fade-in">
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
                  <div
                    className="w-full max-w-full h-full rounded-2xl blur-2xl opacity-80 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 animate-glow"
                    style={{ filter: "blur(32px)" }}
                  ></div>
                </div>
                <div>
                  {/* <section className="comparisonSection">
            <div className="comparisonImage beforeImage">
              <img src={novs} alt="before" className='rounded-xl p-0 m-0'/>
            </div>
            <div className="comparisonImage afterImage">
              <img src={vs} alt="after" className='rounded-xl p-0 m-0'/>
            </div>
          </section> */}
                </div>
              </div>

              <section className="comparisonSection">
                <div className="comparisonImage beforeImage">
                  <img src={novs} alt="before" className="rounded-xl p-0 m-0" />
                </div>
                <div className="comparisonImage afterImage">
                  <img src={vs} alt="after" className="rounded-xl p-0 m-0" />
                </div>
              </section>
              {/* <section className="panel">
            <h4 className="header-section">Scroll to see the before/after</h4>
          </section> */}

              {/* <section className="comparisonSection">
            <div className="comparisonImage beforeImage">
              <img src="https://assets.codepen.io/16327/before.jpg" alt="before"/>
            </div>
            <div className="comparisonImage afterImage">
              <img src="https://assets.codepen.io/16327/after.jpg" alt="after"/>
            </div>
          </section> */}
            </div>
          </div>
        </section>

        {/* Project Spotlight Section */}
        <section className="pt-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] items-center">
              {/* Left Content */}
              <div className="animate-fade-in">
                <div className="text-sm text-[#591A89] font-semibold mb-4"></div>
                <h2 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6">
                  Connecting Developers
                  <span className="text-[#591A89]">
                    {" "}
                    Worldwide
                  </span>{" "}
                  to
                  <span className="text-[#591A89]"> Build, Sell</span>
                  {" "} and
                  <span className="text-[#591A89]"> Scale</span>
                  {" "}
                  Software into
                  <span className="text-[#591A89]"> Profitable</span>
                  {" "} Ventures.
                </h2>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium pr-7">
                  CodeMart is a global software marketplace designed to unlock developer potential by transforming innovative projects into sustainable, revenue-generating businesses through trust, visibility, and scale.
                </p>
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-left">
                    <button 
                      className="group flex items-left gap-2 mt-5 bg-transparent text-black border border-[#1F004D] px-8 py-4 rounded-full font-semibold text-md hover:shadow-lg transition-transform duration-300 hover:scale-105"
                      onClick={() => navigate('/sell')}
                    >
                      Sell Your Product
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
              

              {/* Right Content - Animated Logo Grid
              <div className="relative animate-fade-in overflow-hidden h-[560px] w-[150%] grid-pause-on-hover">
                Hidden barrier mask
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none">
                
                First Row - Scrolling container
                <div className="logo-scroll-container flex gap-6 absolute mb-6">
                  Grid 1 (Large left)
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 min-w-[600px]">
                    LARGE LEFT
                    <div className="row-span-2 bg-[#1a1a1a] h-[260px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img1} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    Small top
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img2} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    Small bottom
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img3} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                  </div>

                  Duplicate Grid 1 for seamless scroll
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 min-w-[600px]">
                    <div className="row-span-2 bg-[#1a1a1a] h-[260px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img4} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img5} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img6} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                  </div>

                  Second Duplicate Grid 1 for smoother scroll
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 min-w-[600px]">
                    <div className="row-span-2 bg-[#1a1a1a] h-[260px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img1} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img2} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img3} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                  </div>
                </div>
                Second Row - Scrolling container (directly below)
                <div className="logo-scroll-container flex gap-6 absolute top-[286px]">

                  Grid 2 (Large right)
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 min-w-[600px]">
                    Small top
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img4} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    LARGE RIGHT
                    <div className="row-span-2 bg-[#1a1a1a] h-[260px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img5} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    Small bottom
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img6} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                  </div>

                  Duplicate Grid 2 for seamless scroll
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 min-w-[600px]">
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img1} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="row-span-2 bg-[#1a1a1a] h-[260px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img2} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img3} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                  </div>

                  Second Duplicate Grid 2 for smoother scroll
                  <div className="grid grid-cols-2 grid-rows-2 gap-6 min-w-[600px]">
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img4} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="row-span-2 bg-[#1a1a1a] h-[260px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img5} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                    <div className="bg-[#1a1a1a] h-[120px] rounded-xl p-2 flex items-center justify-center border border-gray-800 overflow-hidden">
                      <img src={img6} alt="" className="w-full h-full object-cover rounded-lg"/>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <Featured_05 />
            
          </div>
        </div>
        </section>

        {/* Stats Section */}
        <section className="pt-12 bg-white">
          
          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <stat.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div> */}
          <div className="max-w-7xl mx-auto pb-28">
            
            {/* Outer rounded card */}
            <div className="bg-white pb-10 pt-10 md:p-5 rounded-2xl">

              {/* Heading */}
              {/* <h2 className="text-3xl md:text-4xl pt-5 font-bold text-gray-900">
                We only deliver results.
              </h2>

              <p className="text-gray-500 mt-2 text-lg">
                We don’t use excuses or something. Okay maybe sometimes.
              </p> */}

              {/* Stats Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 auto-rows-fr">

                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="gradient-card p-[2px] flex flex-col h-full"
                  >
                    <div className="space-y-2 p-8 bg-[#F3F3F7] rounded-2xl min-h-[200px] flex flex-col justify-center h-full">
                      <h3 className="text-3xl font-bold text-[#404054]">
                        <CountUp
                            from={0}
                            to={parseFloat(stat.value)}
                            separator=","
                            direction="up"
                            duration={0.25}
                            className="count-up-text"
                          />
                        {stat.suffix}
                      </h3>

                      <p className="text-[#404054] text-xl font-semibold">{stat.label}</p>

                      <p className="text-[#2B2D33] text-lg leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

          <div className="techslider pb-32 pt-20">
      <div className="ticker" data-duration="20">
        <div className="ticker-wrap">
          <div className="ticker-text">
            • Java • C# • Python • JavaScript • C# • React • Fluter • Angular • Next •php • C++ • HTML • CSS 
          </div>
        </div>
      </div>

      <div className="ticker" data-duration="20">
        <div className="ticker-wrap">
          <div className="ticker-text">
            •Web{" "}<span className="accent">Applications</span> {"  "}
            •Mobile{" "}<span className="accent">Applications</span>{"  "}
            •UI/UX{" "}<span className="accent">Designs</span> {"  "}
            • ML{" "}<span className="accent">Models</span>{"  "}
            • API{" "}<span className="accent">&</span> Microservices{"  "}
            •Database{" "}<span className="accent">Schemas</span> {"  "}
            •Automation{" "}<span className="accent">Scripts</span> {"  "}
            •Full-Stack{" "}<span className="accent">Projects</span> {"  "}
            •DevOps{" "}<span className="accent">Tools</span>{"  "}
          </div>
        </div>
      </div>
    </div>
        </section> 

        {/* Featured Projects */}
        

        {/* Featured Projects Carousel */}
        <Gallery6
          heading="Featured Projects"
          demoUrl="/projects"
          items={featuredProjects.map(project => ({
            id: project.id.toString(),
            title: project.name,
            summary: project.description,
            url: `/project/${project.id}`,
            image: project.imageUrls?.[0] || '/placeholder.jpg',
            category: mapEnumToCategory(project.category),
            rating: calculateRating(project),
            price: project.price,
            seller: project.owner?.fullName || 'Unknown',
            primaryLanguages: project.primaryLanguages || [],
            reviewCount: project.review?.length || 0,
          }))}
        />

        {/* <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h1 className="featured-projects-title">Top Projects</h1>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto mt-10">
                Discover high-quality software projects from our top developers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-shadow animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {project.rating}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          ${project.price}
                        </span>
                        <p className="text-sm text-gray-500">
                          by {project.seller}
                        </p>
                      </div>
                      <Link
                        to={`/project/${project.id}`}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/projects"
                className="btn-primary text-white px-8 py-3 rounded-full text-lg font-semibold inline-flex items-center"
              >
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section> */}
      </div>

      {/* <TeamCarousel /> */}

    <section className="bg-[#f7f7fa]">
      <InfiniteTestimonialsCarousel
        title="REVIEWS"
        reviews={homeReviews}
        rows={2}
        duration={28}
      />
    </section>
    <ScrollTimeline 
      events={events}
      title="Get Started"
      subtitle="Your journey from discovery to deployment, simplified"
      progressIndicator={true}
      cardAlignment="alternating"
      animationOrder="sequential"
      revealAnimation="fade"
    />

      {/* <HowItWorksScroll/> */}
      {/* How It Works */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
           
          </div> */}

      {/* </div> */}
      {/* </section> */}
      
      </div>
    </ReactLenis>
  );
};

export default Home;
