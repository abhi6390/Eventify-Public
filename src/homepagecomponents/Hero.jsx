import React from "react";
import { motion } from "framer-motion";
import userAvatar from "../assets/user.svg";
import { TextGenerateEffect } from "../homepagecomponents/ui/text-generate-effect";

const HeroSection = () => {
  const currentDate = new Date().getDate();

  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-800 text-gray-200">
      {/* Left Content */}
      <motion.div
        className="md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
       <TextGenerateEffect
  words="The better way to schedule your meetings"
  className="text-4xl md:text-5xl font-semibold mb-6 text-white"
/>
<p className="text-gray-400 mb-8">
A fully customizable scheduling experience for individuals, businesses, and developers building scheduling platforms.</p>
      </motion.div>

      {/* Right Widget */}
      <motion.div
        className="mt-10 md:mt-0 md:w-1/2 bg-gray-900 shadow-lg rounded-lg p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        whileHover={{
          rotateX: -22, // Slight tilt on X-axis
          rotateY: 22, // Slight tilt on Y-axis
          scale: 1.05, // Increase size when hovered
        }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={userAvatar}
            alt="User"
            className="w-16 h-16 rounded-full border-2 border-gray-700 shadow-lg"
          />
          <div>
            <h3 className="font-semibold text-white">John Smith</h3>
            <p className="text-gray-400 text-sm">Medical Appointment</p>
          </div>
        </div>
        <p className="text-gray-400 mt-4 text-sm">
          Welcome to Sacred Heart Hospital. Please select a time for your appointment.
        </p>
        <ul className="mt-6 text-gray-400 text-sm">
          <li>⏱ 30 mins</li>
          <li>📍 Sacred Heart Medical Center</li>
          <li>🌎 America/New York</li>
        </ul>
        <div className="mt-6">
          <h4 className="font-semibold text-white mb-4">Dec 2024</h4>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(31).keys()].map((day) => (
              <motion.button
                key={day}
                className={`py-2 rounded-md ${
                  day + 1 === currentDate
                    ? "bg-blue-500 text-white" // Highlight current day
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {day + 1}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
