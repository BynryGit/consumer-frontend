export interface CompanyInfo {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
  }
  
  export interface ReceiptMetadata {
    number: string;
    type: string;
    status?: string;
    statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    date?: Date;
    dueDate?: Date;
  }
  
  export interface CustomerInfo {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    accountNumber?: string;
    customerId?: string;
    type?: string;
  }
  
  export interface LineItem {
    id: string;
    name: string;
    description?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    total?: number;
    metadata?: Record<string, any>;
  }
  
  export interface CustomSection {
    title: string;
    icon?: any;
    content: Record<string, any>;
    layout?: 'grid' | 'list' | 'block';
    columns?: 1 | 2 | 3;
  }
  
  export interface NotificationPreferences {
    email?: { enabled: boolean; address?: string };
    sms?: { enabled: boolean; number?: string };
    voice?: { enabled: boolean };
    preNotification?: boolean;
  }
  
  export interface ActionConfig {
    showPrint?: boolean;
    showDownload?: boolean;
    showCopy?: boolean;
    showEmail?: boolean;
    showBack?: boolean;
    showAddNew?: boolean;
    backUrl?: string;
    addNewUrl?: string;
    customActions?: Array<{
      label: string;
      icon?: any;
      onClick: () => void;
      variant?: 'default' | 'outline' | 'secondary';
    }>;
  }
  
  export interface ReceiptConfig {
    company: CompanyInfo;
    receipt: ReceiptMetadata;
    customer?: CustomerInfo;
    items?: LineItem[];
    sections?: CustomSection[];
    notifications?: NotificationPreferences;
    nextSteps?: string[];
    actions?: ActionConfig;
    totals?: {
      subtotal?: number;
      tax?: number;
      discount?: number;
      total?: number;
      currency?: string;
    };
  }
  
  export interface ConfigurableReceiptProps {
    config: ReceiptConfig;
    onBack?: () => void;
    onAddNew?: () => void;
    onPrint?: () => void;
    onDownload?: () => void;
    onEmail?: () => void;
    onCopy?: () => void;
  }