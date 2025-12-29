import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Code, Star } from "lucide-react";
import api, { getCurrentUser, getAuthToken } from "@/services/api";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // const handelSearch = (value:string)=>{
  //   setSearchQuery(value);
  //    if (typingTimeout) {
  //     clearTimeout(typingTimeout);
  //   }
  //   try{

  //     const timeout = setTimeout(async()=>{

  //       if(value.trim().length > 0){
  //         const response = await api.projects.search(value);
  //         setResults(response)
  //       }
  //     },1000);

  //   setTypingTimeout(timeout);

  //   }catch (err) {
  //     console.error("getting search items failed:", err);
  //   }
  // }

const calculateRating = (project: any) => {
  const reviews = project?.Review ?? project?.review ?? [];
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};



  const user = getCurrentUser();

  const fetchCart = async () => {
    if (!user?.id) return;
    try {
      const response = await api.users.getCartItems(user.id);
      console.log("getting cart items successful:", response);

      const normalized = response.map((p) => ({
        id: p.id,
        Name: p.name,
        Category: p.category,
        Owner: p.owner,
        Description: p.description,
        Price: p.price,
        ImageUrls: p.imageUrls ?? [],
        PrimaryLanguages: p.primaryLanguages ?? [],
        SecondryLanguages: p.secondaryLanguages ?? [],
        Review: p.review ?? [],
        quantity: 1,
      }));

      setCartItems(normalized);
    } catch (err) {
      console.error("getting cart items failed:", err);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLogged(true);
    }

    if (isLogged && user?.id) {
      fetchCart();
    }

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("focus", fetchCart);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.projects.search(searchQuery);
        setResults(response);
        console.log(response);
      } catch (err) {
        console.log("Search failed", err);
      }
      setIsSearching(false);
    }, 400);

    return () => {
      clearTimeout(delay);
    };
  }, [user?.id, searchQuery]);

  useEffect(() => {
    if (isLogged && user?.id) {
      fetchCart();
    }
  }, [location.pathname, isLogged, user?.id]);

  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  const getProfilePic = () => {
    return user?.profilePicture;
  };

  const mapEnumToCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "WebDevelopment": "Web Development",
      "MobileDevelopment": "Mobile Development",
      "AI/ML": "Artificial Intelligence",
      "DesktopApps": "Desktop Apps",
      "APIs": "APIs",
      "Games": "Game Development",
      "DataScience": "Data Science",
      "DevOps": "DevOps",
      "ArtificialIntelligence": "Artificial Intelligence",
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="relative overflow-visible">
        <nav className="bg-white border border-b-gray-300 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center space-x-2 text-2xl font-bold text-gray-800 mr-6"
              >
                <Code className="h-8 w-8 text-[#4609A2]" />
                <span className="bg-gradient-to-r from-[#4500A5] to-[#6A00A5] bg-clip-text text-transparent pb-1">
                  CodeMart
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/projects"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Browse Projects
                </Link>
                <Link
                  to="/sell"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Sell Project
                </Link>
              </div>

              {/* Search Bar */}
              <form
                className="hidden md:flex items-center flex-1 max-w-lg mx-8"
              >
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for projects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  
                  {/* Search Results Floating Panel */}
                  {searchQuery && results.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 px-6 pt-6  bg-white rounded-3xl shadow-sm border border-gray-200 z-[100] max-h-[600px] overflow-y-auto w-[50vw]">
                      <div className="flex flex-col ">
                        {results.slice(0, 12).map((project: any) => (
                          <Link
                            key={project.id}
                            to={`/project/${project.id}`}
                            onClick={() => setSearchQuery("")}
                            className="bg-[#F3F3F7] mb-5 hover:bg-[#CBCBDC] hover:shadow-sm transition-all group p-4 flex gap-4 rounded-2xl transition-colors duration-300"
                          >
                            {/* Image */}
                            <div className="w-45 h-32 flex-shrink-0 overflow-hidden rounded-xl">
                              <img
                                src={project.imageUrls?.[0] || "https://via.placeholder.com/128"}
                                alt={project.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-[#030D1C] text-base group-hover:text-black transition-colors">
                                    {project.name}
                                  </h4>
                                  <span className="text-xs text-[#0B336A] font-semibold bg-[#E0E0EB] px-3 py-1 rounded-full">
                                    {mapEnumToCategory(project.category)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  by {project.owner.fullName || "Unknown"}
                                </p>
                                
                                {/* Primary Tags */}
                                <div className="flex flex-wrap gap-2">
                                  {project.primaryLanguages?.slice(0, 4).map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="text-xs text-black bg-white px-3 py-1 rounded-lg font-medium"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                               <div className="flex items-center gap-0 pt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                               <Star
                                                                                 key={star}
                                                                                 className={`h-5 w-5 ${
                                                                                   star <= Math.round(calculateRating(project))
                                                                                     ? "text-yellow-400 fill-current"
                                                                                     : "text-gray-300"
                                                                                 }`}
                                                                               />
                                                                             ))}
                                   
                                                             <span className="text-xs text-gray-500 ml-1">
                                                              ({project.review?.length ?? 0} Reviews)

                                                             </span>
                                  </div>
                              
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#5C616B]/15">
                                <div className="flex items-center gap-4">
                                  <span className="font-bold text-gray-900 text-lg">
                                    ${project.price}
                                  </span>
                                 
                                </div>
                                <button className="px-4 py-2 bg-[#08244B] text-white rounded-xl hover:bg-[#08244B]/80 hover:text-white transition-colors font-semibold text-sm">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {/* View All Results Link */}
                      {results.length > 12 && (
                        <div className="border-t border-gray-200 p-4 text-center bg-gray-50">
                          <Link
                            to={`/projects?search=${encodeURIComponent(searchQuery)}`}
                            onClick={() => setSearchQuery("")}
                            className="text-indigo-600 hover:text-indigo-700 font-semibold text-base"
                          >
                            View all {results.length} results →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* No Results Message */}
                  {searchQuery && results.length === 0 && !isSearching && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 px-6 pt-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] p-8 text-center w-[900px]">
                      <p className="text-gray-600 text-base">No projects found for "<strong>{searchQuery}</strong>"</p>
                    </div>
                  )}
                  
                  {/* Loading State */}
                  {searchQuery && isSearching && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 px-6 pt-6 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[100] p-8 text-center w-[900px]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-[#08244B] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#08244B] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-[#08244B] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                      <p className="text-gray-600 text-base mt-3">Searching for projects...</p>
                    </div>
                  )}
                </div>
              </form>

              {/* Backdrop blur overlay when searching */}
              {searchQuery && results.length >= 0 && (
                <div
                  className="fixed top-16 left-0 right-0 bottom-0 bg-black/25 backdrop-blur-sm z-[39]"
                  onClick={() => setSearchQuery("")}
                />
              )}

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-6">
                {isLogged ? (
                  <>
                    <Link
                      to="/cart"
                      className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems?.length ?? 0}
                      </span>
                    </Link>
                  </>
                ) : (
                  ""
                )}

                <Link to="/dashboard" className="relative group">
                  {isLogged ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[rgb(120,8,180)] to-[rgb(125,8,255)] p-[2px] hover:shadow-lg transition-all duration-200">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              getProfilePic() ??
                              "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Dashboard
                  </span>
                </Link>
                {!isLogged ? (
                  <>
                    <Link
                      to="/signin"
                      className="text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-[#1F004D] text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t animate-fade-in">
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for projects..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>
                <div className="space-y-2">
                  <Link
                    to="/projects"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Projects
                  </Link>
                  <Link
                    to="/sell"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sell Project
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cartItems?.length ?? 0})
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {isLogged ? (
                      <>
                        <img
                          src={
                            getProfilePic() ??
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </>
                    ) : (
                      ""
                    )}
                    Dashboard
                  </Link>
                  <Link
                    to="/signin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
