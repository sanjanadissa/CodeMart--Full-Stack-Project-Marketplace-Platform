import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AllProjects from "./pages/AllProjects";
import ProjectDetail from "./pages/ProjectDetail";
import SellProject from "./pages/SellProject";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import EditProject from "./pages/EditProject";
import Preloader from "./components/Preloader";
import "./App.css";
import HowItWorksScroll from "./components/ui/How/HowItWorks";
import ScrollToTop from "./ScrollToTop";
import { Skiper17 } from "./components/ui/skiper17";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if preloader has been shown before
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    
    if (hasSeenPreloader) {
      setLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    setLoading(false);
    sessionStorage.setItem('hasSeenPreloader', 'true');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {loading && <Preloader onComplete={handlePreloaderComplete} />}
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/projects"
                element={
                  <>
                    <Navbar />
                    <AllProjects />
                  </>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <>
                    <Navbar />
                    <ProjectDetail />
                  </>
                }
              />
              <Route
                path="/sell"
                element={
                  <>
                    <Navbar />
                    <SellProject />
                  </>
                }
              />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route
                path="/profile"
                element={
                  <>
                    <Navbar />
                    <Profile />
                  </>
                }
              />
              <Route
                path="/cart"
                element={
                  <>
                    <Navbar />
                    <Cart />
                  </>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                }
              />
              <Route
                path="/project/:id/edit"
                element={
                  <>
                    <Navbar />
                    <EditProject />
                  </>
                }
              />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
