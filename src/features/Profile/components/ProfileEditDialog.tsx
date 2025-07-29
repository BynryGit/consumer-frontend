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
import { User, Save, Loader2 } from "lucide-react";
import { FormField, FormService } from "@shared/services/FormServices";
import { DynamicForm } from "@shared/components/DynamicForm";
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
import { useUpdateConsumer } from "../hooks";

interface ProfileEditModalProps {
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

const ProfileEditModal = ({
  isOpen,
  onClose,
  currentData,
  onSave,
}: ProfileEditModalProps) => {
  const { toast } = useToast();
  const updateConsumerMutation = useUpdateConsumer();
  const isLoading = updateConsumerMutation.isPending;

  // Define form fields
  const formFields: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "your.email@example.com",
      fullWidth: true,
      classes: {
        container: "w-full mb-4",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-white",
        error: "text-red-600 text-sm mt-1",
      },
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "phone",
      required: true,
      placeholder: "+91 98765 43210",
      fullWidth: true,
      classes: {
        container: "w-full mb-4",
        label: "block text-sm font-medium text-gray-700 mb-2",
        input: "w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-white",
        error: "text-red-600 text-sm mt-1",
      },
    },
  ];

  // Create form
  const form = FormService.createForm({
    fields: formFields,
    mode: "onChange",
    validateOnMount: false,
  });

  // Populate form when modal opens
  React.useEffect(() => {
    if (isOpen && currentData) {
      const formData = {
        email: currentData.email,
        phone: currentData.phone,
        street: currentData.billingAddress.street,
        city: currentData.billingAddress.city,
        state: currentData.billingAddress.state,
        pincode: currentData.billingAddress.pincode,
      };
      FormService.populateForm(form, formData, formFields);
    }
  }, [isOpen, currentData, form]);

  const handleSubmit = async (data: any) => {
    try {
      const { remoteUtilityId, consumerId } = getLoginDataFromStorage();
      const formPayload = FormService.createPayload(data, formFields);

      const apiPayload = {
        consumer_details: {
          primary_consumer: {
            email: formPayload.email,
            contact_number: formPayload.phone,
          },
        },
        remote_utility_id: remoteUtilityId,
      };

      await updateConsumerMutation.mutateAsync({
        consumerId: consumerId,
        payload: apiPayload,
      });
      onClose();
    } catch (error) {
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
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>Edit Profile Information</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <DynamicForm
            fields={formFields}
            form={form}
            onSubmit={handleSubmit}
            loading={isLoading}
            gridColumns={2}
            responsiveColumns={{ sm: 1, md: 2 }}
            config={{
              showSubmitButton: false,
              showResetButton: false,
              layout: "vertical",
            }}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;