import React from "react";
import { EvervaultCard, Icon } from "./ui/evervault-card";
import loginbg from "../assets/loginbg.jpg";

function LoginCard() {
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Card Container */}
        <div className="relative bg-black bg-opacity-90 border border-black/[0.2] dark:border-white/[0.2] rounded-lg w-full max-w-sm p-4 h-[30rem]">
          {/* Icons */}
          <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-white" />
          <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-white" />
          <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-white" />
          <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-white" />

          {/* Evervault Card */}
          <EvervaultCard />
        </div>
      </div>
    </>
  );
}

export default LoginCard;
