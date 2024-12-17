import React from "react";

const UseExistingToolsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#bae1ff] text-[#305f73] px-4">
      {/* Icon */}
      <div>
        
      </div>
      <div className="mb-6 -mt-32 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="50"
          height="50"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="3" width="12" height="18" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18" />
          <circle cx="12" cy="18" r="1" />
        </svg>
      </div>

      {/* Title */}

      <h1 className="text-4xl font-bold mb-4 text-center">In-App notification</h1>

      {/* Description */}
      <p className="text-center max-w-lg text-gray-800 mb-6">
        In-app notifications provide users with real-time updates and alerts within the application, enhancing user engagement and experience.
      </p>
    </div>
  );
};

export default UseExistingToolsPage;
