import React, { useState } from 'react';

function DataPrivacyPage() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-[#C8F0C8] text-[#7a6f00] px-4" style={{ backgroundColor: '#C8F0C8', color: '#7a6f00' }}>      {/* Icon */}
      <div className="mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 64" width="144" height="64" fill="none">
          <g transform="translate(0, 0)">
            <circle cx="32" cy="32" r="30" stroke="gray" strokeWidth="2" />
            <path
              d="M16 22h32a2 2 0 012 2v16a2 2 0 01-2 2H16a2 2 0 01-2-2V24a2 2 0 012-2z"
              stroke="gray"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M16 22l16 12 16-12"
              stroke="gray"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          <g transform="translate(80, 0)">
            <circle cx="32" cy="32" r="30" stroke="gray" strokeWidth="2" />
            <path
              d="M20 31.5l26-11c1-.4 1.6.2 1.5 1.2l-3.7 18c-.1.7-.7 1-1.4.8l-8.7-4.5-3.4 4c-.4.4-.8.4-1.1 0l.6-6.7-6.3-4.7c-.8-.6-.8-1.4 0-1.6z"
              stroke="gray"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-center">Email and Telegram Bot Integration</h1>

      {/* Description */}
      <p className="text-center max-w-lg text-gray-400 mb-6">
       Automated communication through Email and Telegram, streamlining notifications, alerts and user interactions via both platforms.
      </p>

    </div>
  );
}

export default DataPrivacyPage;
