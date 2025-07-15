import React from 'react';
import { Tabs } from "@shared/ui/tabs";
import { FileText, Wrench, Calendar, Clock, BarChart2, Receipt } from 'lucide-react';
import BillsTable from './components/billList/BillsTable';
import ServicesBilling from './components/ServicesBilling';
import InstallmentsBilling from './components/InstallmentsBilling';
import PaymentHistory from './components/PaymentHistory';
import CreditNotes from './components/CreditNotes';

const BillingDashboard = () => {
  const tabComponents = {
    bills: {
      label: "View Bills",
      shortLabel: "Bills",
      icon: <FileText className="h-4 w-4" />,
      component: <BillsTable />
    },
    services: {
      label: "Services",
      shortLabel: "Services",
      icon: <Wrench className="h-4 w-4" />,
      component: <ServicesBilling />
    },
    installments: {
      label: "Installments",
      shortLabel: "Install",
      icon: <Calendar className="h-4 w-4" />,
      component: <InstallmentsBilling />
    },
    history: {
      label: "Payment History",
      shortLabel: "History",
      icon: <Clock className="h-4 w-4" />,
      component: <PaymentHistory />
    },
    'credit-notes': {
      label: "Credit Notes",
      shortLabel: "Credits",
      icon: <Receipt className="h-4 w-4" />,
      component: <CreditNotes />
    },
  };

  const urlMapping = {
    bills: "bills",
    services: "services", 
    installments: "installments",
    history: "payment-history",
    'credit-notes': "credit-notes",
    autopay: "auto-pay"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        <p className="text-muted-foreground">Manage your bills, service payments, and installments.</p>
      </div>

      <Tabs 
        defaultValue="bills"
        tabComponents={tabComponents}
        urlMapping={urlMapping}
        tabsListClassName="grid grid-cols-5 w-full"
        idPrefix="billing-tab"
        className="space-y-4"
      />
    </div>
  );
};

export default BillingDashboard;