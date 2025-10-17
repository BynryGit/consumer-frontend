// Updated FAQSection Component
import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/accordion";
import { Tabs } from "@shared/ui/tabs";
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
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
import { useFaqData, useUpdateFaqStatus, useFaqSearch } from "../hooks";

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection = ({ searchQuery }: FAQSectionProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { remoteUtilityId, remoteConsumerNumber, consumerId } = getLoginDataFromStorage();
  const updateFaqStatus = useUpdateFaqStatus();

  // Get current tab from URL parameters with billing as default
  const getCurrentTab = (): string => {
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get('tab');
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

  // Convert API category back to tab key for navigation
  const getTabFromApiCategory = (apiCategory: string): string => {
    const tabMapping: Record<string, string> = {
      "Billing": "billing",
      "Services": "services",
      "Account": "account", 
      "Usage": "usage",
      "Emergency": "emergency"
    };
    return tabMapping[apiCategory] || "billing";
  };

  const currentTab = getCurrentTab();
  const apiCategory = getApiCategoryFromTab(currentTab);

  // Effect to redirect to billing if no tab is specified
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentTabParam = searchParams.get('tab');
    
    if (!currentTabParam) {
      searchParams.set('tab', 'billing');
      const newUrl = `${location.pathname}?${searchParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);

  // Fetch FAQ data for current tab
  const { data: faqsData, isLoading, error } = useFaqData({
    remote_utility_id: remoteUtilityId,
    show_inactive: true,
    faq_category: apiCategory,
  });

  // Fetch search results across all categories
  const { 
    data: searchData, 
    isLoading: isSearchLoading, 
    error: searchError 
  } = useFaqSearch({
    search_data: searchQuery.trim(),
    remote_utility_id: remoteUtilityId,
  }, {
    enabled: searchQuery.trim().length > 0
  });

  const [helpfulQuestions, setHelpfulQuestions] = useState<Set<string>>(new Set());
  const [openAccordionItem, setOpenAccordionItem] = useState<string>("");

  // Transform API data to match expected format
  const transformApiData = (apiData: any, category?: string) => {
    if (!apiData?.result || !Array.isArray(apiData.result)) return [];
    
    return apiData.result.map((item: any) => ({
      id: item.code || `faq-${Date.now()}-${Math.random()}`,
      question: item.name || 'No question text',
      answer: item.answer || '',
      isActive: item.is_active !== false,
      createdBy: item.createdBy,
      createdDate: item.createdDate,
      faqCategory: item.faqCategory,
      utilityService: item.utilityService,
      code: item.code,
      category: category || getTabFromApiCategory(item.faqCategory || 'Billing'),
    }));
  };

  // Get current category data for tab view
  const getCurrentCategoryData = () => {
    const transformedData = transformApiData(faqsData, currentTab);
    return transformedData.filter(item => item.isActive !== false);
  };

  // Process search results from search API
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !searchData) return [];

    const transformedSearchData = transformApiData(searchData);
    
    return transformedSearchData
      .filter(item => item.isActive !== false)
      .map((item) => ({
        ...item,
        categoryLabel: getApiCategoryFromTab(item.category),
      }));
  }, [searchQuery, searchData]);

  // Updated handleHelpfulClick function
  const handleHelpfulClick = (questionId: string, questionText: string, itemCode: string) => {
    if (helpfulQuestions.has(questionId)) {
      return;
    }

    setHelpfulQuestions((prev) => new Set(prev).add(questionId));
    
    toast({
      title: "Thanks for your feedback!",
      description: "We're glad this was helpful.",
    });

    updateFaqStatus.mutate({
      code: itemCode,
      remote_utility_id: remoteUtilityId,
      is_helpful: 1
    });
  };

  const handleQuestionClick = (category: string, questionId: string) => {
    console.log("Redirecting to category:", category, "question:", questionId);
    setOpenAccordionItem(questionId);

    // Clear search when navigating to specific question
    // You might want to call a prop function here to clear search
    // onClearSearch?.();

    // Use URL navigation to switch to the correct tab
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("tab", category);
    currentUrl.searchParams.delete("q"); // Remove search query from URL if present
    window.history.pushState({}, "", currentUrl.toString());

    // Trigger a custom event to notify the tab service
    window.dispatchEvent(new PopStateEvent("popstate"));

    // Improved scrolling logic
    setTimeout(() => {
      const tabsElement = document.querySelector('[role="tablist"]');
      if (tabsElement) {
        tabsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      setTimeout(() => {
        const accordionElement = document.querySelector(`[value="${questionId}"]`);
        if (accordionElement) {
          accordionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 300);
    }, 200);
  };

  // Create tab content components
  const createTabContent = (category: string) => {
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
                          handleHelpfulClick(questionKey, item.question, item.code)
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

  // Tab configuration
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



  // Show search error
  if (searchQuery.trim() && searchError) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">
            Error searching FAQ: {searchError.message || 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // If search is active and no results found
  if (searchQuery.trim() && searchResults.length === 0 && !isSearchLoading) {
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
                          handleHelpfulClick(resultKey, result.question, result.code)
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