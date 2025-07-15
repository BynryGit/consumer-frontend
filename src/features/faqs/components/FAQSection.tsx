import React, { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/accordion";
import { Tabs } from "@shared/ui/tabs"; // Your shared tab service
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

// FAQ data organized by category
const faqData = {
  billing: [
    {
      id: "b1",
      question: "How do I read my bill?",
      answer:
        "Your bill includes charges for the current billing period, along with any past due amounts. The usage section shows how much of each utility you consumed. Payments and adjustments are listed separately. If you have questions about specific charges, please contact customer support.",
    },
    {
      id: "b2",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards (Visa, MasterCard, American Express, Discover), debit cards, electronic checks, and bank transfers. You can also pay by mail with a check or money order, or in person at one of our payment locations.",
    },
    {
      id: "b3",
      question: "Why did my bill increase this month?",
      answer:
        "Bill increases can occur due to seasonal usage changes, rate adjustments, or changes in consumption patterns. Check your usage history on your bill to compare with previous months. Our usage dashboard also provides detailed analysis of your consumption trends.",
    },
    {
      id: "b4",
      question: "How can I set up automatic payments?",
      answer:
        'You can enroll in AutoPay through your online account. Navigate to the Billing section, select "Payment Methods," and choose "Set Up AutoPay." You can select which payment method to use and specify whether you want to pay the full balance or a fixed amount each month.',
    },
  ],
  services: [
    {
      id: "s1",
      question: "How do I report an outage?",
      answer:
        "You can report an outage through our mobile app, website, or by calling our 24/7 emergency line at 1-800-555-0123. Before reporting, check if the outage affects just your home or your entire neighborhood, and if possible, verify your circuit breakers haven't tripped.",
    },
    {
      id: "s2",
      question: "What should I do if I smell gas?",
      answer:
        "If you smell gas, leave the area immediately. Do not use any electrical devices, phones, or open flames. Once you're at a safe distance, call our emergency gas line at 1-800-555-0456. We'll dispatch a technician to investigate immediately.",
    },
    {
      id: "s3",
      question: "How long does it take to start new service?",
      answer:
        "New service connections typically take 3-5 business days to process and complete. If your location has never had service before, it may take 7-10 business days for installation. Expedited service may be available for an additional fee.",
    },
    {
      id: "s4",
      question: "How do I transfer my service to a new address?",
      answer:
        'Log into your account and select "Move Service" from the Services menu. You\'ll need to provide your new address, move-out date for your current location, and move-in date for your new location. Submit at least 5 business days before your move for seamless service transfer.',
    },
  ],
  account: [
    {
      id: "a1",
      question: "How do I reset my password?",
      answer:
        "Click on the \"Forgot Password\" link on the login page. Enter the email address associated with your account, and we'll send you a link to reset your password. The link is valid for 24 hours. If you don't receive the email, check your spam folder or contact customer support.",
    },
    {
      id: "a2",
      question: "Can I have multiple properties on one account?",
      answer:
        'Yes, you can manage multiple properties under a single account. Go to your account settings and select "Add Property" to link additional service addresses. You\'ll receive separate bills for each property, but you can manage all services from one dashboard.',
    },
    {
      id: "a3",
      question: "How do I update my contact information?",
      answer:
        "To update your contact information, go to Profile Editor in your account settings. You can modify your email, phone number, mailing address, and communication preferences. Make sure to save changes before exiting the page.",
    },
    {
      id: "a4",
      question: "What should I do if I'm moving out?",
      answer:
        'At least 5 business days before moving, request service disconnection through your account under the Services menu. Select "Stop Service" and provide your move-out date. You\'ll receive a final bill at your new address or via email after your final meter reading.',
    },
  ],
  usage: [
    {
      id: "u1",
      question: "Why is my water usage higher than normal?",
      answer:
        "Higher than normal water usage can be caused by leaks, seasonal changes (like summer lawn watering), new appliances, additional household members, or changes in usage habits. Our usage analytics tool can help you identify unusual patterns and potential leaks.",
    },
    {
      id: "u2",
      question: "How can I reduce my electricity consumption?",
      answer:
        "To reduce electricity consumption, consider upgrading to energy-efficient appliances, improving insulation, using programmable thermostats, switching to LED lighting, unplugging devices when not in use, and running high-energy appliances during off-peak hours.",
    },
    {
      id: "u3",
      question: "How do I read my meter?",
      answer:
        'Digital meters display your usage directly on an LCD screen. For analog meters, read the dials from left to right. If the pointer is between two numbers, use the lower number. For detailed instructions with images, visit the "Meter Reading Guide" in the Help section of our website.',
    },
    {
      id: "u4",
      question: "What are peak hours and why do they matter?",
      answer:
        "Peak hours are times when electricity demand is highest, typically weekdays from 4pm-9pm. Using electricity during these hours may cost more on time-of-use rate plans. Shifting high-energy activities to off-peak hours can help reduce your bill.",
    },
  ],
  emergency: [
    {
      id: "e1",
      question: "What should I do during a power outage?",
      answer:
        "During a power outage, keep refrigerators and freezers closed, unplug sensitive electronics, use flashlights instead of candles, check our outage map for restoration estimates, and report the outage if it's not already indicated on the map.",
    },
    {
      id: "e2",
      question:
        "How do I prepare for a service disconnection during maintenance?",
      answer:
        "For planned maintenance disconnections, you'll receive notification at least 48 hours in advance. Prepare by unplugging sensitive electronics, making alternative arrangements for medical equipment requiring power, and planning for heating/cooling needs if the outage will be extended.",
    },
    {
      id: "e3",
      question: "What should I do if there's a water main break near my home?",
      answer:
        "If you notice a water main break, call our emergency line at 1-800-555-0789 immediately. Avoid the area as water pressure can be dangerous. If water quality is affected, we'll issue a boil water advisory for your area with specific instructions.",
    },
    {
      id: "e4",
      question: "How do I shut off utilities in an emergency?",
      answer:
        "Every household should know where their emergency shutoffs are located. For water, the main shutoff is typically near the water meter. For gas, the shutoff valve is usually near your meter. Electricity can be shut off at your breaker panel. We recommend labeling all shutoffs clearly.",
    },
  ],
};

interface FAQSectionProps {
  searchQuery: string;
}

const FAQSection = ({ searchQuery }: FAQSectionProps) => {
  const [helpfulQuestions, setHelpfulQuestions] = useState<Set<string>>(
    new Set()
  );
  const [openAccordionItem, setOpenAccordionItem] = useState<string>("");
  const { toast } = useToast();

  const handleHelpfulClick = (questionId: string, questionText: string) => {
    if (helpfulQuestions.has(questionId)) {
      setHelpfulQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
      toast({
        title: "Feedback removed",
        description: "Thank you for your feedback!",
      });
    } else {
      setHelpfulQuestions((prev) => new Set(prev).add(questionId));
      toast({
        title: "Thanks for your feedback!",
        description: "We're glad this was helpful.",
      });
    }
  };

  // Filter FAQ data based on search query - return all matching questions with their categories
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{
      id: string;
      question: string;
      answer: string;
      category: keyof typeof faqData;
      categoryLabel: string;
    }> = [];

    Object.entries(faqData).forEach(([category, questions]) => {
      const matchingQuestions = questions.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );

      const categoryLabels = {
        billing: "Billing",
        services: "Services",
        account: "Account",
        usage: "Usage",
        emergency: "Emergency",
      };

      matchingQuestions.forEach((question) => {
        results.push({
          ...question,
          category: category as keyof typeof faqData,
          categoryLabel:
            categoryLabels[category as keyof typeof categoryLabels],
        });
      });
    });

    return results;
  }, [searchQuery]);

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

  // Create tab content components
  const createTabContent = (category: keyof typeof faqData) => {
    const questions = faqData[category];

    return (
      <div className="space-y-4">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openAccordionItem}
          onValueChange={setOpenAccordionItem}
        >
          {questions.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <p>{item.answer}</p>
                  <div className="flex justify-end">
                    <Button
                      variant={
                        helpfulQuestions.has(`${category}-${item.id}`)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleHelpfulClick(
                          `${category}-${item.id}`,
                          item.question
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {helpfulQuestions.has(`${category}-${item.id}`)
                        ? "Helpful!"
                        : "Was this helpful?"}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
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
      count: faqData.billing.length,
      shortLabel: "Billing",
    },
    services: {
      label: "Services",
      icon: <FileText className="h-4 w-4" />,
      component: createTabContent("services"),
      count: faqData.services.length,
      shortLabel: "Services",
    },
    account: {
      label: "Account",
      icon: <Lightbulb className="h-4 w-4" />,
      component: createTabContent("account"),
      count: faqData.account.length,
      shortLabel: "Account",
    },
    usage: {
      label: "Usage",
      icon: <Droplet className="h-4 w-4" />,
      component: createTabContent("usage"),
      count: faqData.usage.length,
      shortLabel: "Usage",
    },
    emergency: {
      label: "Emergency",
      icon: <AlertCircle className="h-4 w-4" />,
      component: createTabContent("emergency"),
      count: faqData.emergency.length,
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
              {searchResults.map((result) => (
                <div
                  key={`${result.category}-${result.id}`}
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
                      variant={
                        helpfulQuestions.has(`${result.category}-${result.id}`)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        handleHelpfulClick(
                          `${result.category}-${result.id}`,
                          result.question
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {helpfulQuestions.has(`${result.category}-${result.id}`)
                        ? "Helpful!"
                        : "Helpful?"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-lg mb-4">
                Browse All Categories
              </h3>
            </div>
          </div>
        )}

        {/* Using your shared tab service */}
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
