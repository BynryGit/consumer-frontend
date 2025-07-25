import { ConfigurableReceiptProps } from "@shared/types/receipt";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Download,
  FileText,
  Package,
  Plus,
  Printer,
  User,
} from "lucide-react";


export default function ConfigurableReceipt({
  config,
  onBack,
  onAddNew,
  onPrint,
  onDownload,
  onEmail,
  onCopy,
}: ConfigurableReceiptProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Create a new window with only the receipt content
      const receiptElement = document.querySelector(".receipt-container");
      if (receiptElement) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          const receiptHTML = receiptElement.innerHTML;
          const companyName = config.company.name;

          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Receipt ${config.receipt.number}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0; 
                  padding: 20px;
                  background: white;
                }
                * {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
                .receipt-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  box-shadow: none !important;
                  border: none !important;
                }
                /* Copy your existing styles for proper formatting */
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-blue-50 { background-color: #eff6ff; }
                .border-blue-200 { border-color: #bfdbfe; }
                .text-blue-800 { color: #1e40af; }
                .text-blue-700 { color: #1d4ed8; }
                .text-green-600 { color: #16a34a; }
                .text-muted-foreground { color: #6b7280; }
                .text-primary { color: #2563eb; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .font-medium { font-weight: 500; }
                .text-sm { font-size: 0.875rem; }
                .text-lg { font-size: 1.125rem; }
                .text-xl { font-size: 1.25rem; }
                .text-2xl { font-size: 1.5rem; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                .gap-2 { gap: 0.5rem; }
                .gap-4 { gap: 1rem; }
                .gap-6 { gap: 1.5rem; }
                .space-y-1 > * + * { margin-top: 0.25rem; }
                .space-y-2 > * + * { margin-top: 0.5rem; }
                .space-y-4 > * + * { margin-top: 1rem; }
                .space-y-6 > * + * { margin-top: 1.5rem; }
                .p-4 { padding: 1rem; }
                .p-8 { padding: 2rem; }
                .pt-2 { padding-top: 0.5rem; }
                .pt-6 { padding-top: 1.5rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mt-1 { margin-top: 0.25rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-6 { margin-top: 1.5rem; }
                .mr-2 { margin-right: 0.5rem; }
                .border { border: 1px solid #e5e7eb; }
                .border-b { border-bottom: 1px solid #e5e7eb; }
                .border-t { border-top: 1px solid #e5e7eb; }
                .rounded-lg { border-radius: 0.5rem; }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .items-start { align-items: flex-start; }
                .justify-between { justify-content: space-between; }
                .justify-center { justify-content: center; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .flex-1 { flex: 1; }
                .capitalize { text-transform: capitalize; }
                .h-4, .h-5, .h-6 { display: inline-block; width: 1em; height: 1em; }
                
                @media print {
                  body { margin: 0; }
                  .receipt-container { 
                    box-shadow: none !important; 
                    border: none !important;
                    margin: 0 !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                ${receiptHTML}
              </div>
            </body>
            </html>
          `);

          printWindow.document.close();
          printWindow.focus();

          // Wait for content to load then print
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Get the actual receipt content from the DOM
      const receiptElement = document.querySelector(".receipt-container");
      if (receiptElement) {
        // Create a clean HTML version of the receipt
        const htmlContent = generateReceiptHTML();

        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Receipt_${config.receipt.number}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Show success message (you might want to replace this with a toast notification)
        alert("Receipt downloaded successfully!");
      }
    }
  };

  const generateReceiptHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${config.receipt.number}</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      background: white;
      color: #000;
    }
    .receipt { 
      max-width: 800px; 
      margin: 0 auto; 
      border: 1px solid #ddd;
      padding: 20px;
      background: white;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #ccc; 
      padding-bottom: 20px; 
      margin-bottom: 20px; 
    }
    .section { 
      margin: 20px 0; 
    }
    .grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 20px; 
    }
    .grid-full { 
      display: grid; 
      grid-template-columns: 1fr; 
      gap: 10px; 
    }
    .total { 
      font-weight: bold; 
      font-size: 1.2em; 
    }
    .company-name { 
      font-size: 24px; 
      font-weight: bold; 
      color: #2563eb; 
      margin-bottom: 10px;
    }
    .receipt-type {
      font-size: 20px;
      font-weight: bold;
      margin: 15px 0;
    }
    .item-card {
      border: 1px solid #ddd;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
      background: #f9f9f9;
    }
    .item-header {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
    }
    .item-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
    }
    .item-info {
      font-size: 14px;
      color: #666;
    }
    .item-total {
      font-weight: bold;
      font-size: 16px;
    }
    .summary-box {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
    }
    .summary-total {
      font-weight: bold;
      font-size: 18px;
      border-top: 2px solid #333;
      padding-top: 10px;
      margin-top: 10px;
    }
    .customer-info {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
      border: 1px solid #eee;
    }
    .next-steps {
      background: #e7f3ff;
      border: 1px solid #b3d9ff;
      padding: 15px;
      border-radius: 5px;
    }
    .next-steps h3 {
      color: #0066cc;
      margin-top: 0;
    }
    .next-steps ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
    
    @media print {
      body { margin: 0; }
      .receipt { 
        border: none; 
        margin: 0; 
        padding: 10px; 
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1 class="company-name">${config.company.name}</h1>
      ${config.company.address ? `<p>${config.company.address}</p>` : ""}
      ${
        config.company.phone || config.company.email
          ? `<p>${config.company.phone || ""} ${config.company.email || ""}</p>`
          : ""
      }
      <div class="receipt-type">${config.receipt.type.toUpperCase()}</div>
      <p><strong>Receipt #:</strong> ${config.receipt.number}</p>
      <p><strong>Date:</strong> ${formatDate(config.receipt.date)}</p>
      ${
        config.receipt.dueDate
          ? `<p><strong>Due Date:</strong> ${formatDate(
              config.receipt.dueDate
            )}</p>`
          : ""
      }
      ${
        config.receipt.status
          ? `<p><strong>Status:</strong> ${config.receipt.status}</p>`
          : ""
      }
    </div>
    
    ${
      config.customer
        ? `
    <div class="section">
      <h3>Customer Information</h3>
      <div class="customer-info">
        <div class="grid">
          ${
            config.customer.name && config.customer.name != 'N/A'
              ? `<p><strong>Name:</strong> ${config.customer.name}</p>`
              : ""
          }
          ${
            config.customer.email && config.customer.email != 'N/A'
              ? `<p><strong>Email:</strong> ${config.customer.email}</p>`
              : ""
          }
          ${
            config.customer.phone && config.customer.phone != 'N/A'
              ? `<p><strong>Phone:</strong> ${config.customer.phone}</p>`
              : ""
          }
          ${
            config.customer.accountNumber && config.customer.accountNumber
              ? `<p><strong>Account:</strong> ${config.customer.accountNumber}</p>`
              : ""
          }
          ${
            config.customer.customerId && config.customer.customerId
              ? `<p><strong>Customer ID:</strong> ${config.customer.customerId}</p>`
              : ""
          }
          ${
            config.customer.address && config.customer.address != 'N/A'
              ? `<p><strong>Address:</strong> ${config.customer.address}</p>`
              : ""
          }
          ${
            config.customer.type && config.customer.type != 'N/A'
              ? `<p><strong>Type:</strong> ${config.customer.type}</p>`
              : ""
          }
        </div>
      </div>
    </div>
    `
        : ""
    }
  
    
    ${
      config.sections
        ? config.sections
            .map(
              (section) => `
      <div class="section">
        <h3>${section.title}</h3>
        <div class="${section.layout === "list" ? "grid-full" : "grid"}">
          ${Object.entries(section.content)
            .map(
              ([key, value]) => `
            <p><strong>${key.replace(/([A-Z])/g, " $1")}:</strong> 
            ${
              typeof value === "object" ? JSON.stringify(value) : String(value)
            }</p>
          `
            )
            .join("")}
        </div>
      </div>
      `
            )
            .join("")
        : ""
    }
    
    ${
      config.nextSteps && config.nextSteps.length > 0
        ? `
    <div class="section">
      <div class="next-steps">
        <h3>Next Steps</h3>
        <ul>
          ${config.nextSteps.map((step) => `<li>${step}</li>`).join("")}
        </ul>
      </div>
    </div>
    `
        : ""
    }
    
    <div class="footer">
      <p>Thank you for choosing ${config.company.name}</p>
      <p>This receipt was generated on ${formatDate(new Date())}</p>
    </div>
  </div>
</body>
</html>`;
  };

const formatDate = (date?: Date | string | null) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
};


  const formatCurrency = (amount?: number, currency = "USD") => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const currentDate = formatDate(new Date());
  const receiptDate = formatDate(config.receipt.date);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex gap-2">
            {config.actions?.showBack !== false && (
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {config.actions?.showAddNew && (
              <Button
                variant="outline"
                onClick={onAddNew}
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            )}

            {config.actions?.showDownload !== false && (
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
            {config.actions?.showPrint !== false && (
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            )}
            {config.actions?.customActions?.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                className="flex items-center"
              >
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Receipt */}
        <Card className="bg-white shadow-lg receipt-container">
          <CardHeader className="text-center border-b">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-primary">
                {config.company.name}
              </h1>
              {config.company.address && (
                <p className="text-sm text-muted-foreground">
                  {config.company.address}
                </p>
              )}
              <div className="text-sm text-muted-foreground">
                {config.company.phone && (
                  <span>Phone: {config.company.phone}</span>
                )}
                {config.company.phone && config.company.email && (
                  <span> | </span>
                )}
                {config.company.email && (
                  <span>Email: {config.company.email}</span>
                )}
              </div>
            </div>

            <CardTitle className="text-xl font-bold flex items-center justify-center">
              <FileText className="mr-2 h-6 w-6" />
              {config.receipt.type.toUpperCase()}
            </CardTitle>

            {config.receipt.status && (
              <Badge
                variant={config.receipt.statusVariant || "secondary"}
                className="mt-2"
              >
                {config.receipt.status}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Receipt Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Receipt Number
                </p>
                <p className="text-lg font-bold">{config.receipt.number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p className="text-lg font-semibold">{receiptDate}</p>
              </div>
              {config.receipt.dueDate && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Due Date
                    </p>
                    <p className="text-lg font-semibold">
                      {formatDate(config.receipt.dueDate)}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* Customer Information */}
            {config.customer && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {config.customer.accountNumber && (
                      <div>
                        <span className="font-medium">Account Number:</span>
                        <p>{config.customer.accountNumber}</p>
                      </div>
                    )}
                    {config.customer.customerId && (
                      <div>
                        <span className="font-medium">Customer ID:</span>
                        <p>{config.customer.customerId}</p>
                      </div>
                    )}
                    {config.customer.name && config.customer.name != 'N/A' && (
                      <div>
                        <span className="font-medium">Name:</span>
                        <p>{config.customer.name}</p>
                      </div>
                    )}
                    {config.customer.email &&  config.customer.email != 'N/A' && (
                      <div>
                        <span className="font-medium">Email:</span>
                        <p>{config.customer.email}</p>
                      </div>
                    )}
                    {config.customer.phone && config.customer.phone != 'N/A' && (
                      <div>
                        <span className="font-medium">Phone:</span>
                        <p>{config.customer.phone}</p>
                      </div>
                    )}
                    {config.customer.address && config.customer.address!='N/A' && (
                      <div>
                        <span className="font-medium">Address:</span>
                        <p>{config.customer.address}</p>
                      </div>
                    )}
                    {config.customer.type && config.customer.type != 'N/A' && (
                      <div>
                        <span className="font-medium">Customer Type:</span>
                        <p>{config.customer.type}</p>
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Custom Sections */}
            {config.sections?.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  {section.icon && <section.icon className="mr-2 h-5 w-5" />}
                  {section.title}
                </h3>
                <div
                  className={`grid gap-4 text-sm ${
                    section.layout === "grid"
                      ? "grid-cols-2"
                      : section.layout === "list"
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  }`}
                >
                  {Object.entries(section.content).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <p>
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
                {index < (config.sections?.length || 0) - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}


            {/* Next Steps */}
            {config.nextSteps && config.nextSteps.length > 0 && (
              <>
                <Separator />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Next Steps
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {config.nextSteps.map((step, index) => (
                      <li key={index}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground pt-6 border-t">
              <p>Thank you for choosing {config.company.name}</p>
              <p>This receipt was generated on {currentDate}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
