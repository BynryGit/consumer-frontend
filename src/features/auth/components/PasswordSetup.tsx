import React, { useState, useEffect } from 'react';
import { Button } from '@shared/ui/button';
import { Key, CheckCircle } from 'lucide-react';
// ADD THESE IMPORTS
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "@features/auth/api";
import { useToast } from "@shared/hooks/use-toast";

import AuthLayout from './AuthLayout';
import { DynamicForm } from "@shared/components/DynamicForm";
import { FormField, FormService } from "@shared/services/FormServices";

interface PasswordSetupProps {
  onComplete: () => void;
}

const PasswordSetup = ({ onComplete }: PasswordSetupProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  // ADD THESE STATE VARIABLES
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  // ADD THESE HOOKS
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Your existing form fields configuration (unchanged)
  const formFields: FormField[] = [
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter your password",
      minLength: 8,
      helperText: "Create a strong password with the requirements below",
      classes: {
        container: "w-full",
        label: "text-sm font-medium",
        input: "w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50 pl-10",
        error: "text-red-500 text-sm",
        helperText: "text-xs text-gray-500 mt-1",
      },
      customValidation: (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return "Password must contain at least one special character";
        return true;
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
      placeholder: "Confirm your password",
      helperText: "Re-enter your password to confirm",
      classes: {
        container: "w-full",
        label: "text-sm font-medium",
        input: "w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50 pl-10",
        error: "text-red-500 text-sm",
        helperText: "text-xs text-gray-500 mt-1",
      },
    },
  ];

  // Your existing form instance (unchanged)
  const passwordForm = FormService.createForm({
    fields: formFields,
    mode: "onChange",
    validateOnMount: false,
  });

  // Your existing watch logic (unchanged)
  const watchedValues = passwordForm.watch();
  const password = watchedValues.password || '';
  const confirmPassword = watchedValues.confirmPassword || '';

  // Your existing useEffect for password requirements (unchanged)
  useEffect(() => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const passwordsMatch = password && confirmPassword && password === confirmPassword;

    setPasswordRequirements({
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasSpecialChar,
      passwordsMatch,
    });

    // Calculate password strength
    let strength = 0;
    if (hasMinLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasSpecialChar) strength++;
    setPasswordStrength(strength);
  }, [password, confirmPassword]);

  // REPLACE YOUR EXISTING handleFormSubmit WITH THIS:
  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Validate password strength
      const hasLower = /[a-z]/.test(data.password);
      const hasUpper = /[A-Z]/.test(data.password);
      const hasDigit = /\d/.test(data.password);
      const minLength = data.password.length >= 8;

      if (!hasLower || !hasUpper || !hasDigit || !minLength) {
        toast({
          title: "Password Error",
          description: "Password must be 8+ characters, and include uppercase, lowercase, and a number.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Extract query params from URL
      const email = searchParams.get("email") || "";
      const et = searchParams.get("et");
      const code = searchParams.get("code");

      if (!et || !code) {
        throw new Error("Missing required reset credentials in the URL.");
      }

      // Call the resetPassword API (same as your ResetPassword component)
      await resetPassword(
        { password: data.password, email: email }, 
        { et, code }
      );

      toast({
        title: "Password Setup Successful",
        description: `Your password for ${email} has been created successfully.`,
      });

      setIsCompleted(true);

    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        (err instanceof Error
          ? err.message
          : "An error occurred during password setup");

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Your existing success screen (unchanged)
  if (isCompleted) {
    return (
      <AuthLayout 
        title="Password Created!" 
        subtitle="Your password has been successfully set up"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-muted-foreground">
            Your account is now ready to use. You can now sign in with your email and password.
          </p>
          <Button 
            onClick={onComplete}
            className="w-full h-12"
          >
            Continue to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  // Your existing helper functions (unchanged)
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const isValidPassword = passwordStrength === 4 && passwordRequirements.passwordsMatch;

  return (
    <AuthLayout 
      title="Set Up Your Password" 
      subtitle="Create a secure password for your account"
    >
      <div className="space-y-6">
        {/* ADD ERROR DISPLAY */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* ADD LOADING DISPLAY */}
        {loading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
            Setting up your password...
          </div>
        )}

        {/* Your existing Dynamic Form (unchanged) */}
        <DynamicForm
          fields={formFields}
          form={passwordForm}
          onSubmit={handleFormSubmit}
          config={{
            layout: "vertical",
            spacing: "medium",
            showSubmitButton: false,
            showResetButton: false,
            classes: {
              form: "space-y-6",
              fieldContainer: "w-full",
            },
          }}
        />

        {/* Your existing Password Strength Indicator (unchanged) */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Password Strength:</span>
              <span className={`text-xs font-medium ${
                passwordStrength <= 1 ? 'text-red-600' :
                passwordStrength === 2 ? 'text-orange-600' :
                passwordStrength === 3 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {getStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Your existing Password Requirements (unchanged) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-slate-700">Password requirements:</p>
          <ul className="text-sm text-slate-600 space-y-1">
            <li className={`flex items-center ${passwordRequirements.hasMinLength ? 'text-green-600' : ''}`}>
              {passwordRequirements.hasMinLength ? (
                <CheckCircle className="h-3 w-3 mr-2" />
              ) : (
                <div className="h-3 w-3 mr-2 rounded-full border border-slate-300"></div>
              )}
              At least 8 characters
            </li>
            <li className={`flex items-center ${passwordRequirements.hasUppercase ? 'text-green-600' : ''}`}>
              {passwordRequirements.hasUppercase ? (
                <CheckCircle className="h-3 w-3 mr-2" />
              ) : (
                <div className="h-3 w-3 mr-2 rounded-full border border-slate-300"></div>
              )}
              At least one uppercase letter (A-Z)
            </li>
            <li className={`flex items-center ${passwordRequirements.hasLowercase ? 'text-green-600' : ''}`}>
              {passwordRequirements.hasLowercase ? (
                <CheckCircle className="h-3 w-3 mr-2" />
              ) : (
                <div className="h-3 w-3 mr-2 rounded-full border border-slate-300"></div>
              )}
              At least one lowercase letter (a-z)
            </li>
            <li className={`flex items-center ${passwordRequirements.hasSpecialChar ? 'text-green-600' : ''}`}>
              {passwordRequirements.hasSpecialChar ? (
                <CheckCircle className="h-3 w-3 mr-2" />
              ) : (
                <div className="h-3 w-3 mr-2 rounded-full border border-slate-300"></div>
              )}
              At least one special character (!@#$%^&*)
            </li>
            <li className={`flex items-center ${passwordRequirements.passwordsMatch ? 'text-green-600' : ''}`}>
              {passwordRequirements.passwordsMatch ? (
                <CheckCircle className="h-3 w-3 mr-2" />
              ) : (
                <div className="h-3 w-3 mr-2 rounded-full border border-slate-300"></div>
              )}
              Passwords match
            </li>
          </ul>
        </div>

        {/* MODIFY YOUR EXISTING SUBMIT BUTTON */}
        <Button 
          type="button"
          onClick={() => handleFormSubmit(passwordForm.getValues())}
          className="w-full h-12 text-base font-medium"
          disabled={loading || !isValidPassword}
        >
          {loading ? "Creating Password..." : "Create Password"}
        </Button>
      </div>
    </AuthLayout>
  );
};

export default PasswordSetup;