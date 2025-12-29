import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Shield,
  Download,
  Heart,
  Share2,
  User,
  Clock,
  Code,
  Globe,
  Loader2,
} from "lucide-react";
import api, { getAuthToken, getCurrentUser } from "../services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/utils";
import CheckoutForm from "@/components/CheckoutForm";

const ProjectDetail = () => {
  const [formData, setFormData] = useState<{
    comment: string;
    rating: number;
  }>({
    comment: "",
    rating: 0,
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const getUserId = () => {
    try {
      const user = getCurrentUser();
      return user?.id || null;
    } catch {
      return null;
    }
  };
  const userId = getUserId();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [projects, setProjects] = useState({});
  const { id } = useParams<{ id: string }>();
  const [showVideo, setShowVideo] = useState(!!projects.videoUrl);
  const [addedToWishList, setAddedtoWishList] = useState(false);
  const [addedToCart, setAddedtoCart] = useState(false);
  const [boughtProject, setBoughtProject] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ownerRating, setOwnerRating] = useState(0);
  const [owner, setOwner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Desktop Apps",
    "APIs",
    "Games",
    "Data Science",
    "DevOps",
  ];

  const navigate = useNavigate();

  const mapEnumToCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      WebDevelopment: "Web Development",
      MobileDevelopment: "Mobile Development",
      "AI/ML": "Artificial Intelligence",
      DesktopApps: "Desktop Apps",
      APIs: "APIs",
      Games: "Game Development",
      DataScience: "Data Science",
      DevOps: "DevOps",
      ArtificialIntelligence: "Artificial Intelligence",
    };
    return categoryMap[category] || category;
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
      return diffSeconds === 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    } else if (diffDays < 30) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else if (diffMonths < 12) {
      return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
    } else {
      return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
    }
  };

  const handleToggleWishlist = async () => {
    try {
      if (!id) {
        toast.error("Project ID is missing");
        return;
      }
      if (!userId) {
        navigate("/signup");
        return;
      }

      if (addedToWishList) {
        await api.users.removeFromWishList(userId, id);
        setAddedtoWishList(false);
        toast.success("Removed from wishlist!");
      } else {
        await api.users.addtoWishList(userId, id);
        setAddedtoWishList(true);
        toast.success("Added to wishlist!");
      }
    } catch (err: any) {
      console.error("Wishlist operation failed:", err);

      let errorMessage = addedToWishList
        ? "Failed to remove from wishlist. Please try again."
        : "Failed to add to wishlist. Please try again.";
      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message);
          errorMessage = errorData.message || errorData.title || errorMessage;
        }
      } catch (parseError) {
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleToggleCart = async () => {
    try {
      if (!id) {
        toast.error("Project ID is missing");
        return;
      }
      if (!userId) {
        navigate("/signup");
        return;
      }

      if (addedToCart) {
        await api.users.removeFromCart(userId, id);
        setAddedtoCart(false);
        toast.success("Removed from cart!");
      } else {
        await api.users.addtoCart(userId, id);
        setAddedtoCart(true);
        toast.success("Added to cart!");
      }

      // Dispatch event to update navbar cart count
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: any) {
      console.error("Cart operation failed:", err);

      let errorMessage = addedToCart
        ? "Failed to remove from cart. Please try again."
        : "Failed to add to cart. Please try again.";
      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message);
          errorMessage = errorData.message || errorData.title || errorMessage;
        }
      } catch (parseError) {
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleBuy = async () => {
    try {
      if (!id) {
        toast.error("Project ID is missing");
        return;
      }
      if (!userId) {
        navigate("/signup");
        return;
      }

      // Create payment intent
      const paymentData = {
        userId: userId,
        projectId: id,
        amount: (projects as any).price * 100, // Convert to cents
      };

      const response = await api.users.buyProject(paymentData);

      if (response.clientSecret) {
        setClientSecret(response.clientSecret);
        setShowPaymentModal(true);
        console.log(response.clientSecret);
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (err: any) {
      console.error("Purchasing operation failed:", err);

      let errorMessage = "Failed to purchase. Please try again.";

      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message);
          errorMessage = errorData.message || errorData.title || errorMessage;
        }
      } catch (parseError) {
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handlePaymentSuccess = () => {
    setBoughtProject(true);
    setShowPaymentModal(false);
    setClientSecret(null);
    setSuccess(true);
    toast.success("Payment successful! Project purchased.");
  };

  const handleViewPurchased = () => {
    navigate("/dashboard#purchased");
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setClientSecret(null);
  };

  const handleOpenReviewModal = () => {
    if (!userId) {
      navigate("/signup");
      return;
    }
    if (showReviewModal) {
      setShowReviewModal(false);
      setFormData({ comment: "", rating: 0 });
    } else {
      setShowReviewModal(true);
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!id) {
        toast.error("Project ID is missing");
        return;
      }
      if (!userId) {
        navigate("/signup");
        return;
      }

      if (!formData.comment.trim()) {
        toast.error("Please enter a comment");
        return;
      }

      setIsSubmittingReview(true);

      const reviewData = {
        Comment: formData.comment,
        DateAdded: new Date().toISOString(),
        Rating: formData.rating,
      };

      const response = await api.reviews.create(id, reviewData);
      console.log("review", response);
      toast.success("Review added successfully!");

      setFormData({ comment: "", rating: 0 });
      setShowReviewModal(false);
      setSuccess(true);
    } catch (err: any) {
      console.error("Adding review failed:", err);

      let errorMessage = "Failed to add review. Please try again.";

      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message);
          errorMessage = errorData.message || errorData.title || errorMessage;
        }
      } catch (parseError) {
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!id) {
          console.warn("No project id provided in route params");
          setIsLoading(false);
          return null;
        }
        const response = await api.projects.getById(id);
        setProjects(response);
        console.log(response);
        setShowVideo(!!response.videoUrl);
        return response; // Return the project data
      } catch (err) {
        console.error("getting project failed:", err);
        setIsLoading(false);
        return null;
      }
    };

    const checkStatus = async () => {
      try {
        if (!userId || !id) return;
        const wishlist = await api.users.getWishlist(userId);
        const isInWishlist = wishlist.some(
          (project: any) => project.id === parseInt(id)
        );
        setAddedtoWishList(isInWishlist);

        const cart = await api.users.getCartItems(userId);
        const isInCart = cart.some(
          (project: any) => project.id === parseInt(id)
        );
        setAddedtoCart(isInCart);

        const bought = await api.users.getBoughtProjects(userId);
        const isBought = bought.some(
          (project: any) => project.id === parseInt(id)
        );
        setBoughtProject(isBought);
      } catch (err) {
        console.error("checking wishlist status failed:", err);
      }
    };

    const getOwnerRating = async (ownerId: any) => {
      if (!ownerId) return;
      const ownerRating = await api.projects.getOwnerRating(ownerId);
      setOwnerRating(ownerRating);
    };

    const getOwner = async (ownerId: any) => {
      if (!ownerId) return;
      const owner = await api.users.getById(ownerId);
      setOwner(owner);
      console.log("owner", owner);
    };

    const loadAllData = async () => {
      setIsLoading(true);
      const projectData = await fetchProject();
      await checkStatus();
      
      // Only call these if we have project data with ownerId
      if (projectData && projectData.ownerId) {
        await getOwnerRating(projectData.ownerId);
        await getOwner(projectData.ownerId);
      }
      
      setIsLoading(false);
    };

    loadAllData();
  }, [id, userId, success]);

  const calculateRating = (project: any) => {
    if (!project?.review || project.review.length === 0) return 0;

    const total = project.review.reduce(
      (sum: number, r: any) => sum + r.rating,
      0
    );

    var num = Number((total / project.review.length).toFixed(1));
    console.log(num);
    return num;
  };

  const category = mapEnumToCategory(projects.category);

  const project = {
    id: 1,
    title: "E-commerce Platform",
    description:
      "Complete React & Node.js e-commerce solution with payment integration, user authentication, admin dashboard, and mobile-responsive design.",
    longDescription: `This comprehensive e-commerce platform is built with modern technologies and best practices. It includes everything you need to launch your online store: user authentication, product management, shopping cart functionality, secure payment processing with Stripe, order management, admin dashboard, and much more.

The platform is fully responsive and optimized for performance, with clean, maintainable code that's easy to customize and extend. Perfect for entrepreneurs, developers, and businesses looking to establish their online presence quickly and professionally.`,
    price: 299,
    rating: 4.8,
    reviews: 127,
    images: [
      "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://neontri.com/wp-content/uploads/2024/04/Illustration-Innovative_Features_That_will_Define_Mobile_Banking_Apps_By_2030_512x512_v001.png",
      "https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6802042/pexels-photo-6802042.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: "Web Development",
    seller: {
      name: "TechCorp",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.9,
      projects: 23,
    },
    tags: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
    features: [
      "User Authentication & Authorization",
      "Product Catalog Management",
      "Shopping Cart & Checkout",
      "Payment Integration (Stripe)",
      "Order Management System",
      "Admin Dashboard",
      "Responsive Design",
      "API Documentation",
    ],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Stripe API",
    ],
    deliveryTime: "2-3 days",
    lastUpdated: "2024-12-15",
  };

  const testimonials = projects.review;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="animate-fade-in">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-4">
                {projects.videoUrl ? (
                  showVideo ? (
                    <video
                      controls
                      className="w-full h-96 object-cover"
                      src={projects.videoUrl}
                      autoPlay={true}
                    />
                  ) : (
                    <img
                      src={projects.imageUrls?.[selectedImage]}
                      alt={projects.name}
                      className="w-full h-96 object-cover"
                    />
                  )
                ) : (
                  <img
                    src={projects.imageUrls?.[selectedImage]}
                    alt={projects.name}
                    className="w-full h-96 object-cover"
                  />
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {projects.videoUrl ? (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`rounded-lg overflow-hidden ${
                      showVideo ? "ring-2 ring-indigo-600" : "hover:opacity-80"
                    }`}
                  >
                    <video
                      src={projects.videoUrl}
                      className="w-full h-20 object-cover"
                      muted
                    />
                  </button>
                ) : (
                  ""
                )}

                {projects.imageUrls?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setShowVideo(false);
                    }}
                    className={`rounded-lg overflow-hidden ${
                      !showVideo && selectedImage === index
                        ? "ring-2 ring-indigo-600"
                        : "hover:opacity-80"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${projects.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  {(() => {
                    const text = projects.description || "";

                    const sentences = text
                      .split(". ")
                      .filter((s) => s.trim() !== "");

                    const middle = Math.ceil(sentences.length / 2);

                    const p1 = sentences.slice(0, middle).join(". ") + ".";
                    const p2 = sentences.slice(middle).join(". ");
                    const finalP2 = p2 ? p2 + "." : "";

                    return (
                      <>
                        <p className="mb-4 text-gray-600 leading-relaxed">
                          {p1}
                        </p>
                        {finalP2 && (
                          <p className="mb-4 text-gray-600 leading-relaxed">
                            {finalP2}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="animate-slide-up">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full">
                  {category}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 cursor-pointer 
                        ${
                          addedToWishList
                            ? "text-pink-500 fill-pink-500"
                            : "text-gray-500 hover:text-red-500"
                        }
                      `}
                    />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {projects.name}
              </h1>
              {(() => {
                const text = projects.description || "";
                const sentences = text
                  .split(".")
                  .filter((s) => s.trim() !== "");

                const firstTwo = sentences.slice(0, 2).join(". ") + ".";

                return (
                  <p className="mb-4 text-gray-600 leading-relaxed">
                    {firstTwo}
                  </p>
                );
              })()}

              {/* Rating and Reviews */}
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(calculateRating(projects))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    {calculateRating(projects)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({projects.review?.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-bold text-gray-900">
                  ${projects.price}
                </span>
              </div>

              {/* Primary and Secondary Tags */}
              <div className="mb-8">
                {/* Primary Tags */}
                {projects.primaryLanguages &&
                  projects.primaryLanguages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-black uppercase tracking-wider mb-2">
                        Primary Languages
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {projects.primaryLanguages.map((tag) => (
                          <span
                            key={tag}
                            className="text-sm font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Secondary Tags */}
                {projects.secondaryLanguages &&
                  projects.secondaryLanguages.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-black uppercase tracking-wider mb-2">
                        Secondary Languages
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {projects.secondaryLanguages.map((tag) => (
                          <span
                            key={tag}
                            className="text-sm text-gray-600 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex gap-4 mb-8">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-100 border-l-4 border-l-green-500">
                  <div className="text-xs text-gray-500">Support Duration</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    6 Months
                  </div>
                </div>

                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-100 border-l-4 border-l-purple-500">
                  <div className="text-xs text-gray-500">Updates</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    Lifetime
                  </div>
                </div>

                <div className="flex-1 p-3 bg-gray-50 rounded-lg border border-gray-100 border-l-4 border-l-blue-500">
                  <div className="text-xs text-gray-500">Documentation</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    Included
                  </div>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-l border-r border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className={`w-full ${
                    addedToCart
                      ? "btn-secondary py-4 bg-gray-200 rounded-xl text-lg font-semibold hover:shadow-md hover:scale-105 transition-all duration-300"
                      : "bg-gradient-to-r from-[#4500A5] to-[#6A00A5] text-white py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:from-[#5800A5] hover:to-[#7B00A5] hover:scale-105 transition-all duration-300"
                  }`}
                  onClick={handleToggleCart}
                >
                  {addedToCart
                    ? "Remove from Cart"
                    : `Add to Cart - $${projects.price * quantity}`}
                </button>

                <button
                  className={`w-full ${
                    boughtProject
                      ? "bg-white border border-green-600 text-green-700 py-4 rounded-xl text-lg font-semibold hover:bg-green-50 hover:scale-105 transition-all duration-300"
                      : "bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 hover:scale-105 transition-all duration-300"
                  }`}
                  onClick={boughtProject ? handleViewPurchased : handleBuy}
                >
                  {boughtProject ? "View Purchased Projects" : "Buy Now"}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 text-center border-t pt-6">
                <div>
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Quality Guarantee
                  </p>
                </div>
                <div>
                  <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Instant Download
                  </p>
                </div>
                <div>
                  <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-900">
                    Lifetime Updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            {/* Description */}

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Features Included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.features?.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h2>
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-600/80 transition-colors text-sm font-medium"
                  onClick={handleOpenReviewModal}
                >
                  {showReviewModal ? "Cancel" : "Add Review"}
                </button>
              </div>

              {showReviewModal && (
                <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-indigo-200 animate-fade-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Write Your Review
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, rating: star })
                          }
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-7 w-7 cursor-pointer ${
                              star <= formData.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 hover:text-yellow-200"
                            }`}
                          />
                        </button>
                      ))}
                      {formData.rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                          ({formData.rating}/5)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="Share your thoughts about this project..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview}
                    className={`w-full px-4 py-3 bg-[#08244B] text-white rounded-xl font-medium shadow-lg flex items-center justify-center gap-2 ${
                      isSubmittingReview
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-[#08244B]/90 transition-all duration-300 hover:scale-105"
                    }`}
                  >
                    {isSubmittingReview ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              )}

              <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                {testimonials
                  ?.sort(
                    (a, b) =>
                      new Date(b.dateAdded).getTime() -
                      new Date(a.dateAdded).getTime()
                  )
                  .map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={
                            review.reviewer?.profilePicture ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                          }
                          alt={
                            review.reviewer?.firstName +
                            " " +
                            review.reviewer?.lastName
                          }
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.reviewer.firstName +
                                  " " +
                                  review.reviewer.lastName}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {getTimeAgo(review.dateAdded)}
                              </p>
                            </div>

                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Seller Info */}
            <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About the Seller
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={owner?.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Seller"}
                  alt={owner?.firstName + " " + owner?.lastName || "Seller"}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {owner?.firstName && owner?.lastName 
                      ? `${owner.firstName} ${owner.lastName}` 
                      : "Loading..."}
                  </h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= Math.round(ownerRating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Projects:</span>
                  <p className="font-semibold">{owner.sellingProjectsCount}</p>
                </div>
                <div>
                  <span className="text-gray-500">Rating:</span>
                  <p className="font-semibold">{ownerRating}/5</p>
                </div>
              </div>
              <button className="w-full mt-4 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                Contact Seller
              </button>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-gray-500">Delivery:</span>
                    <p className="font-semibold">Instant</p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <Code className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-gray-500">Technologies:</span>
                    <p className="font-semibold">
                      {[
                        ...(projects.primaryLanguages || []),
                        ...(projects.secondaryLanguages || []),
                      ].join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-sm">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-gray-500">Published On:</span>
                    <p className="font-semibold">
                      {new Date(projects.uploadDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* New: File Includes */}
                <div className="flex items-start text-sm">
                  <Download className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-gray-500">File Includes:</span>
                    <ul className="mt-1 list-disc list-inside text-gray-900 font-semibold">
                      <li>ZIP folder</li>
                      <li>Full source code</li>
                      <li>Documentation</li>
                      <li>.env.example</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && clientSecret && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Complete Payment
            </h2>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#4f46e5",
                  },
                },
              }}
            >
              <CheckoutForm
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
