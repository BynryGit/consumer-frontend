import React, { useState } from "react";
import { Button } from "@shared/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { DynamicForm } from "@shared/components/DynamicForm";
import { FormField, FormService } from "@shared/services/FormServices";
import { useForgotPassword } from "../hooks";

interface ForgotPasswordProps {
  onSwitchToSignIn: () => void;
}

const ForgotPassword = ({ onSwitchToSignIn }: ForgotPasswordProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotMutation = useForgotPassword();
  // Define form fields
  const formFields: FormField[] = [
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "Enter your email address",
      //   icon: <Mail className="h-4 w-4" />,
      classes: {
        container: "w-full",
        label: "text-sm font-medium",
        input:
          "w-full h-10 px-3 pr-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
        error: "text-red-500 text-sm mt-1",
      },
    },
  ];

  // Create form instance
  const forgotForm = FormService.createForm({
    fields: formFields,
    mode: "onChange",
    validateOnMount: false,
  });

  const handleSubmit = async (data: any) => {
  try {
    const payload = { email: data.email,role:"consumer" };
    await forgotMutation.mutateAsync(payload);
    setIsSubmitted(true);
  } catch (error) {
    console.error("Reset link request failed", error);
  }
};
  const email = forgotForm.getValues().email;

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email address"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-muted-foreground">
            If an account with email <strong>{email}</strong> exists, you will
            receive a password reset link shortly.
          </p>
          <Button
            onClick={onSwitchToSignIn}
            variant="outline"
            className="w-full h-12"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a reset link"
    >
      <DynamicForm
        fields={formFields}
        form={forgotForm}
        onSubmit={handleSubmit}
        config={{
          layout: "vertical",
          spacing: "medium",
          showSubmitButton: false,
        }}
      />
      <Button
        type="button"
        onClick={() => forgotForm.handleSubmit(handleSubmit)()}
        className="w-full h-10 text-base font-medium mt-4"
      >
        Send Reset Link
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Sign In
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
