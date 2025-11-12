  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Button } from '@shared/ui/button';
  import { Building2, Mail, User, Key, Eye, EyeOff } from 'lucide-react';
  import { useToast } from '@shared/hooks/use-toast'; // Changed from sonner
  import { fetchNscConfigIfNeeded, useConsumerWebLogin, useUserUtility } from '../hooks';
  import AuthLayout from './AuthLayout';
  import { DynamicForm } from "@shared/components/DynamicForm";
  import { FormField, FormService } from "@shared/services/FormServices";
  import { setAuthToken } from '@shared/auth/authUtils';
  import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

  // Types for API response
  interface UtilityProvider {
    id: number;
    name: string;
    short_name: string;
    is_active: boolean;
    logo?: string;
    email?: string;
    contact_number?: string;
  }

  interface ConsumerWebLoginPayload {
    user: {
      username: string;
      password: string;
    };
    remote_utility_id: number;
  }

  interface SignInProps {
    tenant?: string;
    onSwitchToSignUp: () => void;
    onSwitchToForgotPassword: () => void;
  }

  // Helper function to safely get and store remoteConsumerNumber
  const getOrSetConsumerNumber = (loginResult?: any) => {
    let consumerNumber = null;
    
    // Try to get from localStorage first
    consumerNumber = localStorage.getItem('remoteConsumerNumber');
    
    if (!consumerNumber) {
      // Try to extract from loginResult
      if (loginResult?.result?.consumer_no) {
        consumerNumber = loginResult.result.consumer_no;
        localStorage.setItem('remoteConsumerNumber', consumerNumber);
      }
      // Try alternative field names
      else if (loginResult?.result?.consumer_number) {
        consumerNumber = loginResult.result.consumer_number;
        localStorage.setItem('remoteConsumerNumber', consumerNumber);
      }
    }
    
    return consumerNumber;
  };

  const SignIn = ({ tenant = '', onSwitchToSignUp, onSwitchToForgotPassword }: SignInProps) => {
    const navigate = useNavigate();
    const { toast } = useToast(); // Changed to use custom hook
    const fetchNscConfigIfNeededMutation=fetchNscConfigIfNeeded("")
    // Get initial data from storage
    const storageData = getLoginDataFromStorage();
    const [remoteConsumerNumber, setRemoteConsumerNumber] = useState<string | null>(
      storageData.remoteConsumerNumber || localStorage.getItem('remoteConsumerNumber')
    );
    
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [serviceProviderID, setServiceProviderID] = useState<number>(0);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    // API hooks
    const { data: utilitiesData, isLoading: isLoadingUtilities, error: utilitiesError } = useUserUtility({
      tenant_alias: tenant
    });

    const loginMutation = useConsumerWebLogin();

    // Extract utilities from API response
    const utilities: UtilityProvider[] = utilitiesData?.result || [];

    // Convert utilities to form options
    const utilityOptions = utilities.map(provider => ({
      value: provider.id.toString(),
      label: provider.name,
      description: provider.short_name ? `(${provider.short_name})` : undefined,
    }));

    // Create form fields configuration
    const formFields: FormField[] = [
      {
        name: "service_provider",
        label: "Service Provider",
        type: "select",
        required: true,
        placeholder: isLoadingUtilities ? "Loading service providers..." : "Select your service provider",
        options: utilityOptions,
        disabled: isLoadingUtilities,
        classes: {
          container: "w-full",
          label: "text-sm font-medium",
          select: "w-full h-10 px-3 pr-10 mb-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
          error: "text-red-500 text-sm",
        },
      },
      {
        name: "username",
        label: "Email or Account Number",
        type: "text",
        required: true,
        placeholder: "Enter your email or account number",
        classes: {
          container: "w-full",
          label: "text-sm font-medium",
          input: "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
          error: "text-red-500 text-sm",
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "Enter your password",
        minLength: 5,
        maxLength: 50,
        classes: {
          helperText: "text-xs text-gray-500 mt-1",
          container: "w-full mb-4 relative",
          label: "block text-sm font-medium text-gray-700 mb-2",
          input: "w-full h-10 px-3 pr-10 mb-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors bg-gray-50",
          error: "text-red-600 text-sm",
        },
      },
    ];

    // Create form instance
    const signInForm = FormService.createForm({
      fields: formFields,
      mode: "onChange",
      validateOnMount: false,
    });

    // Watch form values
    const watchedValues = signInForm.watch();
    const isEmail = watchedValues.username?.includes('@') || false;

    // Update username icon based on input type
    useEffect(() => {
      const usernameField = formFields.find(field => field.name === 'username');
      if (usernameField) {
        usernameField.icon = isEmail ? <Mail className="h-4 w-4" /> : <User className="h-4 w-4" />;
      }
    }, [isEmail]);

    // Update password field type based on visibility
    useEffect(() => {
      const passwordField = formFields.find(field => field.name === 'password');
      if (passwordField) {
        passwordField.type = passwordVisible ? 'text' : 'password';
      }
    }, [passwordVisible]);

    // Store current tenant in localStorage for persistence
    useEffect(() => {
      if (tenant) {
        localStorage.setItem('currentTenant', tenant);
      }
    }, [tenant]);

const handleFormSubmit = async (data: any) => {
  if (!data.service_provider) {
    toast({
      title: "Validation Error",
      description: "Please select a Service Provider.",
      variant: "destructive"
    });
    return;
  }

  const selectedUtility = utilities.find(u => u.id.toString() === data.service_provider);
  if (!selectedUtility) {
    toast({
      title: "Invalid Selection",
      description: "Invalid service provider selected.",
      variant: "destructive"
    });
    return;
  }

  const payload: ConsumerWebLoginPayload = {
    user: {
      username: data.username,
      password: data.password,
    },
    remote_utility_id: selectedUtility.id,
  };

  try {
    const result = await loginMutation.mutateAsync(payload);
    
    // Extract and save the auth token
    const token = result?.result?.user?.token;
    if (token) {
      setAuthToken(token);
    } else {
      toast({
        title: "Login Failed",
        description: "No authentication token received",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success!",
      description: "Login successful! Redirecting to dashboard...",
    });
    
    // Store login result
    localStorage.setItem('loginResult', JSON.stringify(result));
    
    // Extract and store consumer number from login response
    const extractedConsumerNumber = getOrSetConsumerNumber(result);
    if (extractedConsumerNumber) {
      setRemoteConsumerNumber(extractedConsumerNumber);
    }
    
    // Store authentication data if needed
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', data.username);
      localStorage.setItem('serviceProvider', data.service_provider);
    }
    
    // Store remote utility ID for dashboard use
    localStorage.setItem('remoteUtilityId', selectedUtility.id.toString());
    
    // **✅ Fetch NSC configuration after successful login**
    await fetchNscConfigIfNeeded(selectedUtility.id);
    
    // Navigate to dashboard - consumer details will be fetched there
    navigate('/dashboard');
    
  } catch (error) {
    toast({
      title: "Login Failed",
      description: "Please check your credentials and try again.",
      variant: "destructive"
    });
  }
};

    const handleFieldChange = (fieldName: string, value: any) => {
      if (fieldName === 'service_provider') {
        const provider = utilities.find(p => p.id.toString() === value);
        if (provider) {
          setSelectedProvider(value);
          setServiceProviderID(provider.id);
        }
      }
    };

    const handleSignUp = () => {
      toast({
        title: "Redirecting",
        description: "Taking you to the sign up page...",
      });
      onSwitchToSignUp();
    };

    const handleForgotPassword = () => {
      onSwitchToForgotPassword();
    };

    // Load remembered credentials on component mount
    useEffect(() => {
      const remembered = localStorage.getItem('rememberMe');
      if (remembered === 'true') {
        const savedUsername = localStorage.getItem('username');
        const savedProvider = localStorage.getItem('serviceProvider');
        
        if (savedUsername) {
          signInForm.setValue('username', savedUsername);
        }
        if (savedProvider) {
          setSelectedProvider(savedProvider);
          signInForm.setValue('service_provider', savedProvider);
        }
        setRememberMe(true);
      }
    }, [signInForm]);

    // Handle loading and error states
    useEffect(() => {
      if (utilitiesError) {
        toast({
          title: "Loading Error",
          description: "Failed to load service providers. Please refresh the page.",
          variant: "destructive"
        });
      }
    }, [utilitiesError, toast]);

    return (
      <AuthLayout 
        title="Welcome Back" 
        subtitle={`Sign in to your account to continue`}
      >
        <div className="space-y-2">
          {/* Dynamic Form */}
          <DynamicForm
            fields={formFields.map((f) =>
              f.name === "password" ? { ...f, type: showPassword ? "text" : "password" } : f
            )}
            form={signInForm}
            onSubmit={handleFormSubmit}
            onFieldChange={handleFieldChange}
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

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button 
            type="button"
            onClick={() => handleFormSubmit(signInForm.getValues())}
            disabled={loginMutation.isPending || isLoadingUtilities}
            className="w-full h-12 text-base font-medium"
          >
            {loginMutation.isPending ? 'SIGNING IN...' : 'Sign In'}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignUp}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up
              </button>
            </span>
          </div>
        </div>
      </AuthLayout>
    );
  };

  export default SignIn;