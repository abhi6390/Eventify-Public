import React from "react";
import { BackgroundBeamsWithCollision } from "../homepagecomponents/ui/explodingBeams";
import googleIcon from "../assets/goog.svg";
import { useNavigate } from "react-router-dom";

export function BackgroundBeamsWithCollisionDemo() {
  const navigate = useNavigate()
  return (
    <BackgroundBeamsWithCollision>
      <div className="flex flex-col items-center justify-center h-screen text-center overflow-hidden">
        {/* Heading with white text only */}
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center font-sans tracking-tight text-white">
          What&apos;s cooler than{" "}
          <img src={googleIcon} alt="Google" className="inline-block" />{" "}
          Calendar?{" "}
          <br />
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)] dark:text-pink-500">
              <span className="">Eventify.</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span className="">Eventify.</span>
            </div>
          </div>
        </h2>

        {/* Button */}
        <button onClick={()=>(navigate('/login'))} className="mt-8 px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition flex items-center">
          LEARN MORE
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export default BackgroundBeamsWithCollisionDemo;
