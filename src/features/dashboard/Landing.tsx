  import React, { useEffect } from "react";
  import UsageTrends from "./components/UsageTrends";
  import TipsInsights from "./components/TipsInsights";
  import QuickActions from "./components/QuickActions";
  import DashboardCards from "./components/DashboardCards";
  import AccountOverview from "./components/AccountOverview";
  import { useConsumerBillDetails } from "./hooks"; // Import the hook
  import { getLoginDataFromStorage } from "@shared/utils/loginUtils"; // Import login utils
  import { useConsumerDetails } from "@features/serviceRequest/hooks";

  // Sample data for charts - updated to include total cost for each month

  const DashboardHome = () => {
    // Fetch consumerBillData once at the parent level
    const { remoteUtilityId, remoteConsumerNumber, firstName, lastName } =
      getLoginDataFromStorage();

    const { data: consumerBillData } = useConsumerBillDetails({
      remoteUtilityId: remoteUtilityId,
      remoteConsumerNumber: remoteConsumerNumber,
      fetch_last_six_records: "True",
    });

    const { data: consumerDetail } = useConsumerDetails({
      remote_utility_id: remoteUtilityId,
      consumer_no: remoteConsumerNumber,
    });
    useEffect(() => {
      if (consumerDetail) {
        localStorage.setItem("consumerDetails", JSON.stringify(consumerDetail));
      }
    }, [consumerDetail]);
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {firstName} {lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Your utility overview for{" "}
                {new Date().toLocaleString("default", { month: "long" })}{" "}
                {new Date().getFullYear()}
              </p>
            </div>
          </div>
          {/* Key Metrics - Pass consumerBillData */}
          <DashboardCards consumerBillData={consumerBillData} />
        </section>
        {/* Main Dashboard Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
          {/* Primary Content Area - Full width for usage trends */}
          <div className="lg:col-span-9 space-y-6">
            {/* Usage Trends - Extended horizontally */}
            <UsageTrends  consumerBillData={consumerBillData} />
            {/* Tips and Insights */}
            <TipsInsights />
          </div>
          {/* Sidebar - Secondary actions and info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
             <QuickActions consumerBillData={consumerBillData} />
            {/* Account Status - Pass consumerBillData */}
            <AccountOverview  consumerDetail={consumerDetail} />
          </div>
        </div>
      </div>
    );
  };

  export default DashboardHome;
