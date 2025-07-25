import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/accordion";
import { Tabs } from "@shared/ui/tabs";
import { Card, CardContent } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import {
  Lightbulb,
  Droplet,
  Flame,
  FileText,
  CreditCard,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { useToast } from "@shared/hooks/use-toast";
import { useFaqData, useUpdateFaqStatus } from "../hooks"; // Added useUpdateFaqStatus import

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection = ({ searchQuery }: FAQSectionProps) => {
  const location = useLocation();
  const { toast } = useToast();
  
  // Add the useUpdateFaqStatus hook
  const updateFaqStatus = useUpdateFaqStatus();
  
  // Get current tab from URL parameters with billing as default
  const getCurrentTab = (): string => {
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get('tab');
    // Always default to billing if no tab is specified or invalid tab
    const validTabs = ['billing', 'services', 'account', 'usage', 'emergency'];
    return currentTab && validTabs.includes(currentTab) ? currentTab : 'billing';
  };

  // Convert tab key to API format (billing -> Billing)
  const getApiCategoryFromTab = (tabKey: string): string => {
    const categoryMapping: Record<string, string> = {
      billing: "Billing",
      services: "Services", 
      account: "Account",
      usage: "Usage",
      emergency: "Emergency"
    };
    return categoryMapping[tabKey] || "Billing";
  };

  const currentTab = getCurrentTab();
  const apiCategory = getApiCategoryFromTab(currentTab);

  // Effect to redirect to billing if no tab is specified
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentTabParam = searchParams.get('tab');
    
    // If no tab parameter exists, redirect to billing
    if (!currentTabParam) {
      searchParams.set('tab', 'billing');
      const newUrl = `${location.pathname}?${searchParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);

  // Fetch FAQ data dynamically based on current tab
  const { data: faqsData, isLoading, error } = useFaqData({
    remote_utility_id: "699",
    show_inactive: true,
    faq_category: apiCategory,
  });

  // Debug the hook response
  console.log('useFaqData Response:', {
    data: faqsData,
    isLoading,
    error,
    apiCategory
  });

  const [helpfulQuestions, setHelpfulQuestions] = useState<Set<string>>(
    new Set()
  );
  const [openAccordionItem, setOpenAccordionItem] = useState<string>("");

  // Updated handleHelpfulClick function with API integration
  const handleHelpfulClick = (questionId: string, questionText: string, itemCode: string) => {
    // Don't allow clicking if already marked as helpful
    if (helpfulQuestions.has(questionId)) {
      return;
    }

    // Update local state immediately
    setHelpfulQuestions((prev) => new Set(prev).add(questionId));
    
    // Show success toast
    toast({
      title: "Thanks for your feedback!",
      description: "We're glad this was helpful.",
    });

    // Call the API
    updateFaqStatus.mutate({
      code: itemCode,
      remote_utility_id: 699,
      is_helpful: 1
    });
  };

  // Transform API data to match expected format
  const transformApiData = (apiData: any) => {
    if (!apiData?.result || !Array.isArray(apiData.result)) return [];
    
    return apiData.result.map((item: any) => ({
      id: item.code || `faq-${Date.now()}-${Math.random()}`,
      question: item.name || 'No question text', // Handle missing name field
      answer: item.answer || '',
      isActive: item.is_active !== false, // Default to true if not specified
      createdBy: item.createdBy,
      createdDate: item.createdDate,
      faqCategory: item.faqCategory,
      utilityService: item.utilityService,
      code: item.code,
    }));
  };

  // Get transformed data for current category
  const getCurrentCategoryData = () => {
    const transformedData = transformApiData(faqsData);
    // Filter only active items if needed (default to showing all if is_active is not specified)
    return transformedData.filter(item => item.isActive !== false);
  };

  // Filter FAQ data based on search query - return all matching questions with their categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const currentCategoryData = getCurrentCategoryData();
    
    const results = currentCategoryData
      .filter((item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      )
      .map((item) => ({
        ...item,
        category: currentTab,
        categoryLabel: getApiCategoryFromTab(currentTab),
      }));

    return results;
  }, [searchQuery, faqsData, currentTab]);

  const handleQuestionClick = (category: string, questionId: string) => {
    console.log("Redirecting to category:", category, "question:", questionId);
    setOpenAccordionItem(questionId);

    // Use URL navigation to switch to the correct tab
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("tab", category);
    window.history.pushState({}, "", currentUrl.toString());

    // Trigger a custom event to notify the tab service
    window.dispatchEvent(new PopStateEvent("popstate"));

    // Improved scrolling logic
    setTimeout(() => {
      // First scroll to the tabs section
      const tabsElement = document.querySelector('[role="tablist"]');
      if (tabsElement) {
        tabsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Then after a short delay, scroll to the specific question
      setTimeout(() => {
        const accordionElement = document.querySelector(
          `[value="${questionId}"]`
        );
        if (accordionElement) {
          accordionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }, 200);
  };

  // Create tab content components using API data
  const createTabContent = (category: string) => {
    // Only show data for the current active tab to avoid unnecessary API calls
    if (category !== currentTab) {
      return <div>Loading...</div>;
    }

    const questions = getCurrentCategoryData();

    if (!questions || questions.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2">Loading FAQ data...</span>
              </div>
            )}
            
            {error && (
              <div className="text-red-600">
                <p>Error loading FAQ data: {error.message || 'Unknown error'}</p>
              </div>
            )}
            
            {!isLoading && !error && (
              <p className="text-muted-foreground">
                No FAQ items found for this category.
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          {questions.map((item) => {
            const questionKey = `${category}-${item.id}`;
            const isHelpful = helpfulQuestions.has(questionKey);
            
            return (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-base font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <div className="space-y-4">
                    <p>{item.answer}</p>
                    <div className="flex justify-end">
                      <Button
                        variant={isHelpful ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleHelpfulClick(
                            questionKey,
                            item.question,
                            item.code
                          )
                        }
                        disabled={isHelpful}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {isHelpful ? "Helpful!" : "Was this helpful?"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  };

  // Tab configuration for your shared tab service
  const tabComponents = {
    billing: {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4" />,
      component: createTabContent("billing"),
      shortLabel: "Billing",
    },
    services: {
      label: "Services",
      icon: <FileText className="h-4 w-4" />,
      component: createTabContent("services"),
      shortLabel: "Services",
    },
    account: {
      label: "Account",
      icon: <Lightbulb className="h-4 w-4" />,
      component: createTabContent("account"),
      shortLabel: "Account",
    },
    usage: {
      label: "Usage",
      icon: <Droplet className="h-4 w-4" />,
      component: createTabContent("usage"),
      shortLabel: "Usage",
    },
    emergency: {
      label: "Emergency",
      icon: <AlertCircle className="h-4 w-4" />,
      component: createTabContent("emergency"),
      shortLabel: "Emergency",
    },
  };

  // If search is active and no results found
  if (searchQuery.trim() && searchResults.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No results found for "{searchQuery}". Try different keywords or
            browse categories below.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {searchQuery.trim() && searchResults.length > 0 && (
          <div className="mb-6">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Showing {searchResults.length} result(s) for:{" "}
                <strong>"{searchQuery}"</strong>
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Search Results</h3>
              {searchResults.map((result) => {
                const resultKey = `${result.category}-${result.id}`;
                const isResultHelpful = helpfulQuestions.has(resultKey);
                
                return (
                  <div
                    key={resultKey}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4
                        className="font-medium text-left flex-1 cursor-pointer hover:text-primary"
                        onClick={() =>
                          handleQuestionClick(result.category, result.id)
                        }
                      >
                        {result.question}
                      </h4>
                      <Badge variant="secondary" className="shrink-0">
                        {result.categoryLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground text-left line-clamp-2 mb-3">
                      {result.answer}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleQuestionClick(result.category, result.id)
                        }
                        className="text-primary hover:text-primary/80"
                      >
                        View Full Answer
                      </Button>
                      <Button
                        variant={isResultHelpful ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleHelpfulClick(
                            resultKey,
                            result.question,
                            result.code
                          )
                        }
                        disabled={isResultHelpful}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {isResultHelpful ? "Helpful!" : "Helpful?"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-lg mb-4">
                Browse All Categories
              </h3>
            </div>
          </div>
        )}

        {/* Using your shared tab service - default to billing */}
        <Tabs
          defaultValue="billing"
          tabComponents={tabComponents}
          urlMapping={{
            billing: "billing",
            services: "services", 
            account: "account",
            usage: "usage",
            emergency: "emergency",
          }}
          tabsListClassName="grid grid-cols-5 w-full"
          tabsListFullWidth={true}
          idPrefix="faq"
        />
      </CardContent>
    </Card>
  );
};

export default FAQSection;