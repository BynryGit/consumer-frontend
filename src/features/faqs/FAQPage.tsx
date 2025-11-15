import React, { useEffect, useState } from "react";
import FAQSection from "./components/FAQSection";
import FAQSearch from "./components/FAQSearch";
import { logEvent } from "@shared/analytics/analytics";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    logEvent("FAQ Section Accessed");
  }, []);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions about our services
        </p>
      </div>

      <FAQSearch onSearch={handleSearch} />
      <FAQSection searchQuery={searchQuery} />
    </div>
  );
};

export default FAQPage;
