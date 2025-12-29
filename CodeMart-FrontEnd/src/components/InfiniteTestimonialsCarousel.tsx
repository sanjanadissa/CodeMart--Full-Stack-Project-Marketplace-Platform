import React from "react";

export type Testimonial = {
  id: string | number;
  avatar: string;
  name: string;
  platform: "google" | "twitter";
  rating: number;
  text: string;
  date: string;
};

type Props = {
  title?: string;
  reviews: Testimonial[];
  rows?: number;
  duration?: number;
};

const platformIcons: Record<"google" | "twitter", JSX.Element> = {
  google: (
    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#4285F4" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="12"
        fill="#fff"
        fontFamily="Arial">
        G
      </text>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="12"
        fill="#fff"
        fontFamily="Arial"
      >
        t
      </text>
    </svg>
  ),
};

function splitIntoRows<T>(items: T[], rowCount: number): T[][] {
  const rows: T[][] = Array.from({ length: rowCount }, () => []);
  items.forEach((item, index) => {
    rows[index % rowCount].push(item);
  });
  return rows;
}

export const InfiniteTestimonialsCarousel: React.FC<Props> = ({
  title = "What Our Users Say",
  reviews,
  rows = 2,
  duration = 30,
}) => {
  if (!reviews || reviews.length === 0) return null;

  const rowData = splitIntoRows(reviews, rows).map((row) => [
    ...row,
    ...row,
  ]);

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="relative mb-16 text-center">
            <h2 
              className="text-[7.5rem] font-black uppercase tracking-tighter pointer-events-none whitespace-nowrap text-transparent bg-clip-text"
              style={{
                fontFamily: '"Arial Black", "Arial Bold", Arial, sans-serif',
                background: 'linear-gradient(to bottom, rgb(8 42 123 / 35%) 30%, rgb(255 255 255 / 0%) 76%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              {title}
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto mt-4">
              Hear from developers who trust CodeMart for quality software solutions
            </p>
          </div>
        )}

        <div className="space-y-6">
          {rowData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="overflow-hidden group"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
              <div
                className="flex w-max"
                style={{
                  animation: `testimonial-scroll-${rowIndex} linear ${
                    duration + rowIndex * 2
                  }s infinite`,
                }}
              >
                {row.map((review, i) => {
                  // Randomly assign 4 or 5 stars
                  const randomRating = Math.random() > 0.5 ? 5 : 4;
                  
                  return (
                  <article
                    key={`${(review as any).id}-${i}`}
                    className="flex-shrink-0 w-72 sm:w-80 mx-2 flex flex-col items-center   bg-white border border-gray-200 rounded-xl shadow-xl p-5 mb-7 transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg "
                  >
                    <div className="flex flex-col items-center mb-2">
                      <img
                        src={(review as any).avatar}
                        alt={(review as any).name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 mb-2"
                      />
                      <div className="flex items-center text-gray-900 font-semibold">
                        {(review as any).name}
                        
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <svg
                          key={idx}
                          className={`w-4 h-4 ${
                            idx < randomRating
                              ? "text-yellow-400"
                              : "text-gray-200"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                      {(review as any).text}
                    </p>
                  
                  </article>
                  );
                })}
              </div>

              <style>
                {`
                  @keyframes testimonial-scroll-${rowIndex} {
                    0% { transform: translateX(${rowIndex % 2 === 1 ? "-50%" : "0"}); }
                    100% { transform: translateX(${rowIndex % 2 === 1 ? "0" : "-50%"}); }
                  }
                  .group:hover > div {
                    animation-play-state: paused;
                  }
                `}
              </style>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteTestimonialsCarousel;
