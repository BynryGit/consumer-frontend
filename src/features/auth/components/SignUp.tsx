import React, { useState } from "react";
import { Button } from "@shared/ui/button";
import { Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { DynamicForm } from "@shared/components/DynamicForm";
import { FormField, FormService } from "@shared/services/FormServices";

interface SignUpProps {
  onSwitchToSignIn: () => void;
  onSwitchToPasswordSetup?: () => void;
}

const SignUp = ({ onSwitchToSignIn, onSwitchToPasswordSetup }: SignUpProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

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
  const signUpForm = FormService.createForm({
    fields: formFields,
    mode: "onChange",
    validateOnMount: false,
  });

  const handleSubmit = (data: any) => {
    // Simulate sign up request
    setIsSubmitted(true);
  };

  const email = signUpForm.getValues().email;

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a password setup link to your email address"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-muted-foreground">
            A password setup link has been sent to <strong>{email}</strong>.
            Please check your email and follow the instructions to complete your
            account setup.
          </p>
          {onSwitchToPasswordSetup && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-3">
                <strong>Demo:</strong> Click below to simulate clicking the
                email link
              </p>
              <Button
                onClick={onSwitchToPasswordSetup}
                className="w-full h-12 mb-3"
              >
                Setup Password (Demo)
              </Button>
            </div>
          )}
          <Button
            onClick={onSwitchToSignIn}
            variant="outline"
            className="w-full h-12"
          >
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Enter your email and we'll send you a password setup link"
    >
      <DynamicForm
        fields={formFields}
        form={signUpForm}
        onSubmit={handleSubmit}
        config={{
          layout: "vertical",
          spacing: "medium",
          showSubmitButton: false,
        }}
      />
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> A password setup link will be sent to your
          email address. You'll be able to create your password after clicking
          the link.
        </p>
      </div>

      <Button
        type="button"
        onClick={() => signUpForm.handleSubmit(handleSubmit)()}
        className="w-full h-10 text-base font-medium mt-4"
      >
        Send Setup Link
      </Button>
      <div className="text-center mt-4">
        <span className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </button>
        </span>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
