import { ArrowLeft, ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  category: string;
  rating: number;
  price: number;
  seller: string;
  primaryLanguages?: string[];
  reviewCount?: number;
}

interface Gallery6Props {
  heading?: string;
  demoUrl?: string;
  items?: GalleryItem[];
}

const Gallery6 = ({
  heading = "Gallery",
  demoUrl = "https://www.shadcnblocks.com",
  items = [
    {
      id: "item-1",
      title: "Build Modern UIs",
      summary:
        "Create stunning user interfaces with our comprehensive design system.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "Web Development",
      rating: 4.8,
      price: 49.99,
      seller: "John Doe",
      primaryLanguages: ["React", "TypeScript"],
      reviewCount: 15,
    },
    {
      id: "item-2",
      title: "Computer Vision Technology",
      summary:
        "Powerful image recognition and processing capabilities.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "AI & ML",
      rating: 4.9,
      price: 79.99,
      seller: "Jane Smith",
      primaryLanguages: ["Python", "TensorFlow"],
      reviewCount: 23,
    },
    {
      id: "item-3",
      title: "Machine Learning Automation",
      summary:
        "Self-improving algorithms that learn from data patterns.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "AI & ML",
      rating: 4.7,
      price: 89.99,
      seller: "Mike Johnson",
      primaryLanguages: ["Python", "scikit-learn"],
      reviewCount: 18,
    },
    {
      id: "item-4",
      title: "Predictive Analytics",
      summary:
        "Advanced forecasting capabilities that analyze historical data.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "Data Science",
      rating: 4.6,
      price: 69.99,
      seller: "Sarah Williams",
      primaryLanguages: ["R", "Python"],
      reviewCount: 12,
    },
    {
      id: "item-5",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "AI & ML",
      rating: 4.9,
      price: 99.99,
      seller: "David Brown",
      primaryLanguages: ["Python", "PyTorch"],
      reviewCount: 31,
    },
    {
      id: "item-6",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "AI & ML",
      rating: 4.9,
      price: 99.99,
      seller: "David Brown",
      primaryLanguages: ["Python", "Keras"],
      reviewCount: 27,
    },
    {
      id: "item-7",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "AI & ML",
      rating: 4.9,
      price: 99.99,
      seller: "David Brown",
      primaryLanguages: ["Python", "JAX"],
      reviewCount: 19,
    },
    {
      id: "item-8",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure.",
      url: "#",
      image: "/images/block/placeholder-dark-1.svg",
      category: "AI & ML",
      rating: 4.9,
      price: 99.99,
      seller: "David Brown",
      primaryLanguages: ["Python", "ONNX"],
      reviewCount: 22,
    },
  ],
}: Gallery6Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    
    // Update immediately
    updateSelection();
    
    // Update after a short delay to ensure carousel is fully initialized
    setTimeout(updateSelection, 100);
    
    carouselApi.on("select", updateSelection);
    carouselApi.on("reInit", updateSelection);
    
    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("reInit", updateSelection);
    };
  }, [carouselApi]);
  return (
    <section className="pt-32">
      <div className="container">
        <div className="text-center">
                <h2 className="mb-1 featured-projects-title">
                    {heading}
                </h2>
            </div>
            <div className="mx-auto w-full">  
            <p className="text-2xl text-[#08244B]/75 max-w-3xl text-center justify-self-center">
                Discover high-quality software projects from our top developers
            </p>
            </div>
        <div className="mb-5 mt-8 flex items-center justify-between"> 
          <div>
              <Link
              to="/projects"
              className="group bg-transparent hover:shadow-md transition-transform duration-300 hover:scale-105 text-[#1F004D] px-8 py-3 rounded-full text-lg font-md inline-flex items-center"
              >
              View All Projects
              <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
          </div>
            
            <div className="flex shrink-0 items-center gap-2">
                <Button
                size="icon"
                variant="outline"
                onClick={() => {
                    carouselApi?.scrollPrev();
                }}
                disabled={!canScrollPrev}
                className="disabled:pointer-events-auto"
                >
                <ArrowLeft className="size-5" />
                </Button>
                <Button
                size="icon"
                variant="outline"
                onClick={() => {
                    carouselApi?.scrollNext();
                }}
                disabled={!canScrollNext}
                className="disabled:pointer-events-auto"
                >
                <ArrowRight className="size-5" />
                </Button>
            </div>
        </div>
        </div>
        <div className="container">
            <Carousel
            setApi={setCarouselApi}
            opts={{
                align: "start",
                slidesToScroll: 1,
                breakpoints: {
                "(max-width: 768px)": {
                    dragFree: true,
                },
                },
            }}
            className="relative left-[-1rem]"
            >
            <CarouselContent className="mb-7 pl-5">
                {items.map((item) => (
                <CarouselItem key={item.id} className="pl-7 pr-2 pb-24 md:basis-1/2 lg:basis-1/3">
                    <a
                    href={item.url}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl card-shadow animate-fade-in pb-5"
                    >
                    <div>
                        <div className="flex aspect-[3/2] overflow-clip rounded-xl">
                        <div className="flex-1">
                            <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover object-center"
                            />
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="px-6 pb-3 pt-5">
                        <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#0B336A] font-semibold bg-[#DAE8FB] px-3 py-1 rounded-full">
                            {item.category}
                        </span>
                        </div>
                        
                        {/* Star Rating */}
                        <div className="flex items-center mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(item.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-2">
                            ({item.reviewCount || 0} Reviews)
                          </span>
                        </div>
                    </div>
                    <div className="px-6">
                        <div className="line-clamp-2 break-words text-lg font-bold md:text-xl">
                        {item.title}
                        </div>
                        <div className="line-clamp-2 text-sm text-muted-foreground md:text-base mt-2 mb-3">
                        {item.summary}
                        </div>
                        
                        {/* Primary Languages Tags */}
                        {item.primaryLanguages && item.primaryLanguages.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.primaryLanguages.map((lang) => (
                              <span
                                key={lang}
                                className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                            <div>
                            <span className="text-2xl font-bold text-gray-900">
                                ${item.price}
                            </span>
                            <p className="text-xs text-gray-500">
                                by {item.seller}
                            </p>
                            </div>
                            <Link
                            to={`/project/${item.id}`}
                            className="flex items-center bg-[#08244B] text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                            View Details
                            </Link>
                        </div>
                    </div>
                    </a>
                </CarouselItem>
                ))}
            </CarouselContent>
            </Carousel>        
        </div>
        {/* <div className="text-center mt-5">
            <Link
            to="/projects"
              className="group bg-transparent hover:shadow-md transition-transform duration-300 border border-[#1F004D] hover:scale-105 text-[#1F004D] px-8 py-3 rounded-full text-lg font-semibold inline-flex items-center"
              >
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
        </div> */}
    </section>
  );
};

export { Gallery6 };
