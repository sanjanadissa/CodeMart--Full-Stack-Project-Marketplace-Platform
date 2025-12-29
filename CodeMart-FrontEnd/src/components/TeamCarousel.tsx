import React, { useEffect, useRef, useState } from 'react';
import './TeamCarousel.css';
import Group1 from '../assets/Group 1.png';
import Group2 from '../assets/Group 2.png';
import Group3 from '../assets/Group 3.png';
import Group4 from '../assets/Group 4.png';
import Group5 from '../assets/Group 5.png';
import Group6 from '../assets/Group 6.png';
interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TeamCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const teamMembers: TeamMember[] = [
    { 
      name: "Emily Kim", 
      role: "Founder",
      image: Group1
    },
    { 
      name: "Michael Steward", 
      role: "Creative Director",
      image: Group2
    },
    { 
      name: "Emma Rodriguez", 
      role: "Lead Developer",
      image: Group3
    },
    { 
      name: "Julia Gimmel", 
      role: "UX Designer",
      image: Group4
    },
    { 
      name: "Lisa Anderson", 
      role: "Marketing Manager",
      image: Group5
    },
    { 
      name: "James Wilson", 
      role: "Product Manager",
      image: Group6
    }
  ];

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const normalizedIndex = (newIndex + teamMembers.length) % teamMembers.length;
    setCurrentIndex(normalizedIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  const getCardClass = (index: number): string => {
    const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;
    
    if (offset === 0) return 'card center';
    if (offset === 1) return 'card right-1';
    if (offset === 2) return 'card right-2';
    if (offset === teamMembers.length - 1) return 'card left-1';
    if (offset === teamMembers.length - 2) return 'card left-2';
    return 'card hidden';
  };

  const handlePrevious = () => {
    updateCarousel(currentIndex - 1);
  };

  const handleNext = () => {
    updateCarousel(currentIndex + 1);
  };

  const handleDotClick = (index: number) => {
    updateCarousel(index);
  };

  const handleCardClick = (index: number) => {
    updateCarousel(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating]);

  // Touch navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrevious();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, isAnimating]);

  return (
    <div className="team-carousel-section">
      <h1 className="about-title">REVIEWS</h1>
      
      <div className="carousel-container" ref={carouselRef}>
        <button className="nav-arrow left" onClick={handlePrevious}>‹</button>
        <div className="carousel-track">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className={getCardClass(index)}
              onClick={() => handleCardClick(index)}
              data-index={index}
            >
              <img src={member.image} alt={`Team Member ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="nav-arrow right" onClick={handleNext}>›</button>
      </div>

      <div className="member-info">
        
      </div>

      <div className="dots">
        {teamMembers.map((_, index) => (
          <div 
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            data-index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamCarousel;
