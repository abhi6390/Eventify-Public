import React from "react";
import { FloatingNav } from "../homepagecomponents/ui/floating-navbar";
import { IconHome, IconBrandSlack} from "@tabler/icons-react";

export function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
      link: "#home",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Features",
      link: "#lamp",
      icon: <IconBrandSlack className="h-4 w-4 text-neutral-500 dark:text-white" />, 
    },
  ];

  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}

export default FloatingNavDemo;
