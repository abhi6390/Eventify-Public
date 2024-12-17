import React from "react";
import Card from "./cards/1";
import DataPrivacyPage from "./cards/2";
import UseExistingToolsPage from "./cards/3";
import Access from "./cards/4";

const Features = () => {
  return (
<div className="relative min-h-screen max-w-full">
        {/* Sticky Section - Card */}
        <div className="sticky top-20">
          <Card />
        </div>

        {/* Sticky Section 2 - DataPrivacyPage */}
        <div className="sticky top-40">
          <DataPrivacyPage />
        </div>

        {/* Sticky Section 3 - UseExistingToolsPage */}
        <div className="sticky top-60">
          <UseExistingToolsPage />
        </div>

        {/* Sticky Section 4 - Access */}
        <div className="sticky top-80">
          <Access />
        </div>
      </div>
  );
};

export default Features;
