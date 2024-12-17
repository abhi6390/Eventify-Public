import React from "react";

export function CoverDemo() {
  return (
    <div>
      <h1
        className="text-4xl md:text-4xl lg:text-6xl top-20 font-semibold max-w-7xl mx-auto h-screen text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        What's cooler than Google Calendar? <br /> <br />
        {/* Apply gradient only to the text "warp speed" */}
        <Cover className="h-[150px] w-[80%] md:w-[70%]"> {/* Increased height and width here */}
          <span className="bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent bg-clip-text text-transparent">
            warp speed
          </span>
        </Cover>
      </h1>
    </div>
  );
}

export default CoverDemo;
