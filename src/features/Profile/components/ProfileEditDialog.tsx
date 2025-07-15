import React from "react";
import { useToast } from "@shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Mail, Phone, MapPin, Save } from "lucide-react";
import { FormField, FormService } from "@shared/services/FormServices";
import { DynamicForm } from "@shared/components/DynamicForm";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    email: string;
    phone: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  onSave: (data: any) => void;
}

const ProfileEditDialog = ({
  isOpen,
  onClose,
  currentData,
  onSave,
}: ProfileEditDialogProps) => {
  const { toast } = useToast();

  // Define form fields with proper classes and grouping
  const formFields: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "your.email@example.com",
      //   prefix: <Mail className="h-4 w-4 text-muted-foreground" />,
      group: "contact",
      groupOrder: 1,
      classes: {
        helperText: "text-xs text-gray-500 mt-1",
        container: "w-full mb-4 relative",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-600 text-sm ",
      },
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "phone",
      required: true,
      placeholder: "+91 98765 43210",
      //   prefix: <Phone className="h-4 w-4 text-muted-foreground" />,
      group: "contact",
      groupOrder: 2,
      classes: {
        helperText: "text-xs text-gray-500 mt-1",
        container: "w-full mb-4 relative",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-600 text-sm ",
      },
    },
    {
      name: "billingAddress.street",
      label: "Street Address",
      type: "text",
      required: true,
      placeholder: "Enter your street address",
      minLength: 5,
      group: "address",
      groupOrder: 1,
      fullWidth: true,
      classes: {
        helperText: "text-xs text-gray-500 mt-1",
        container: "w-full mb-4 relative",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-600 text-sm ",
      },
    },
    {
      name: "billingAddress.city",
      label: "City",
      type: "text",
      required: true,
      placeholder: "Enter your city",
      minLength: 2,
      group: "address",
      classes: {
        helperText: "text-xs text-gray-500 mt-1",
        container: "w-full mb-4 relative",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-600 text-sm ",
      },
    },
    {
      name: "billingAddress.state",
      label: "State",
      type: "text",
      required: true,
      placeholder: "Enter your state",
      minLength: 2,
      group: "address",
      groupOrder: 3,
      classes: {
        helperText: "text-xs text-gray-500 mt-1",
        container: "w-full mb-4 relative",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-600 text-sm ",
      },
    },
    {
      name: "billingAddress.pincode",
      label: "PIN Code",
      type: "text",
      required: true,
      placeholder: "Enter PIN code",
      minLength: 5,
      pattern: "^[0-9]{5,6}$",
      group: "address",
      groupOrder: 4,
      classes: {
        helperText: "text-xs text-gray-500 mt-1",
        container: "w-full mb-4 relative",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input:
          "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-600 text-sm ",
      },
    },
  ];

  // Create form using your FormService
  const form = FormService.createForm({
    fields: formFields,
    mode: "onBlur",
    resetOnSubmit: false,
  });

  // Populate form with current data when dialog opens
  React.useEffect(() => {
    if (isOpen && currentData) {
      // Flatten the nested address structure for the form
      const flattenedData = {
        email: currentData.email,
        phone: currentData.phone,
        "billingAddress.street": currentData.billingAddress.street,
        "billingAddress.city": currentData.billingAddress.city,
        "billingAddress.state": currentData.billingAddress.state,
        "billingAddress.pincode": currentData.billingAddress.pincode,
      };

      // Use FormService to populate the form
      FormService.populateForm(form, flattenedData, formFields);
    }
  }, [isOpen, currentData, form]);

  const handleSubmit = async (data: any) => {
    try {
      // Create payload using FormService
      const payload = FormService.createPayload(data, formFields);

      // Restructure the flattened data back to nested format
      const restructuredData = {
        email: payload.email,
        phone: payload.phone,
        billingAddress: {
          street: payload["billingAddress.street"],
          city: payload["billingAddress.city"],
          state: payload["billingAddress.state"],
          pincode: payload["billingAddress.pincode"],
        },
      };

      onSave(restructuredData);

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });

      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {/* Single DynamicForm with custom rendering for layout */}
          <DynamicForm
            fields={formFields}
            form={form}
            gridColumns={3}
            responsiveColumns={{ sm: 2, md:2}}
            onSubmit={handleSubmit}
            config={{
              showSubmitButton: false,
              showResetButton: false,
              layout: "vertical",
            }}
            className="space-y-6"
            renderCustomFooter={() => null}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={FormService.hasErrors(form)}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
