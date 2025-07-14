import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Checkbox } from '@shared/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useConsumerWebLogin, useUserUtility } from '../hooks';

// Validation schema
const signInSchema = z.object({
  service_provider: z.string().min(1, 'Service Provider is required'),
  username: z.string().min(1, 'Account No. is required'),
  password: z.string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be less than 50 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

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

const SignInComponent: React.FC = () => {
  const navigate = useNavigate(); // Add navigation hook
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [serviceProviderID, setServiceProviderID] = useState<number>(0);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // API hooks
  const { data: utilitiesData, isLoading: isLoadingUtilities, error: utilitiesError } = useUserUtility({
    tenant_alias: "smart3600"
  });

  const loginMutation = useConsumerWebLogin();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Extract utilities from API response
  const utilities: UtilityProvider[] = utilitiesData?.result || [];
  const activeUtilities = utilities.filter(utility => utility.is_active);

  const onSubmit = async (data: SignInFormData) => {
    if (!selectedProvider) {
      toast.error('Please select a Service Provider.');
      return;
    }

    const payload: ConsumerWebLoginPayload = {
      user: {
        username: data.username,
        password: data.password,
      },
      remote_utility_id: serviceProviderID,
    };

    try {
      const result = await loginMutation.mutateAsync(payload);
      
      toast.success('Login successful!');
      console.log('Login successful:', result);
      
      // Store authentication data if needed
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('username', data.username);
        localStorage.setItem('serviceProvider', selectedProvider);
      }
      
      // Store auth tokens or user data as needed
      // localStorage.setItem('authToken', result.token);
      // localStorage.setItem('userData', JSON.stringify(result.user));
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const handleProviderSelect = (value: string) => {
    const provider = utilities.find(p => p.id.toString() === value);
    if (provider) {
      setSelectedProvider(value);
      setServiceProviderID(provider.id);
      setValue('service_provider', value);
      console.log('Selected provider:', provider);
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    console.log('Navigate to sign up page');
    toast.info('Redirecting to sign up...');
    // navigate('/signup'); // Uncomment when you have a signup route
  };

  const handleForgotPassword = () => {
    const username = getValues('username');
    if (!username) {
      toast.error('Please enter your account number first.');
      return;
    }
    console.log(`Navigate to forgot password for: ${username}`);
    toast.info('Redirecting to forgot password...');
    // navigate('/forgot-password'); // Uncomment when you have a forgot password route
  };

  const handleNewConnection = () => {
    console.log('Navigate to new service connection');
    toast.info('Redirecting to new service connection...');
    // navigate('/new-connection'); // Uncomment when you have a new connection route
  };

  const handleGuest = () => {
    console.log('Continue as guest');
    toast.info('Continuing as guest...');
    // Navigate to a limited dashboard or guest view
    // navigate('/guest-dashboard'); // Uncomment when you have a guest route
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Load remembered credentials on component mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    if (remembered === 'true') {
      const savedUsername = localStorage.getItem('username');
      const savedProvider = localStorage.getItem('serviceProvider');
      
      if (savedUsername) {
        setValue('username', savedUsername);
      }
      if (savedProvider) {
        setSelectedProvider(savedProvider);
        setValue('service_provider', savedProvider);
      }
      setRememberMe(true);
    }
  }, [setValue]);

  // Handle loading and error states
  if (utilitiesError) {
    toast.error('Failed to load service providers. Please refresh the page.');
  }

  return (
    <div className="flex justify-center items-center bg-white min-h-screen">
      {/* Form Container */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white p-4">
        <div className="w-72 md:w-80 lg:w-96 mx-auto">
          <div className="items-center">
            {/* Logo */}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
              <span className="font-bold">SMART</span>
              <span className="text-blue-600 font-bold">360</span>
            </h3>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Service Provider Select */}
              <div className="space-y-2">
                <Label htmlFor="service_provider" className="text-gray-500">
                  <span className="text-red-500">*</span>
                  Service Provider
                </Label>
                <Select 
                  onValueChange={handleProviderSelect} 
                  value={selectedProvider}
                  disabled={isLoadingUtilities}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue 
                      placeholder={
                        isLoadingUtilities 
                          ? "Loading service providers..." 
                          : "Select Service Provider"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {utilities.map((provider) => (
                      <SelectItem key={provider.id.toString()} value={provider.id.toString()}>
                        <div className="flex items-center space-x-2">
                          {provider.logo && (
                            <img 
                              src={provider.logo} 
                              alt={provider.name}
                              className="w-4 h-4 rounded"
                            />
                          )}
                          <span>{provider.name}</span>
                          {provider.short_name && (
                            <span className="text-gray-500 text-sm">({provider.short_name})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service_provider && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.service_provider.message}
                  </p>
                )}
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-500">
                  <span className="text-red-500">*</span>
                  Account No.
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter Account No."
                  {...register('username')}
                  className="w-full"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-500">
                  <span className="text-red-500">*</span>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter Password"
                    {...register('password')}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex mt-2 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="text-sm">
                    Remember Me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-800 hover:text-blue-900 text-sm underline focus:outline-none"
                >
                  Forgot password
                </button>
              </div>

              {/* Login Button */}
              <div className="flex justify-center my-3">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending || isLoadingUtilities}
                  className="bg-orange-600 w-full h-10 rounded-none text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {loginMutation.isPending ? 'LOGGING IN...' : 'LOGIN'}
                </Button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="flex justify-center mt-4">
              <span className="text-sm font-sans">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-blue-800 hover:text-blue-900 underline focus:outline-none"
                >
                  SIGN UP
                </button>
              </span>
            </div>

            {/* New Service Connection Link */}
            <div className="flex justify-center text-sm font-sans mt-2">
              <button
                type="button"
                onClick={handleNewConnection}
                className="w-1/2 text-blue-800 text-center hover:text-blue-900 underline focus:outline-none"
              >
                New Service Connection
              </button>
            </div>

            {/* Guest Link */}
            <div className="flex justify-center text-sm font-sans">
              <button
                type="button"
                onClick={handleGuest}
                className="w-1/2 text-blue-800 text-center hover:text-blue-900 underline focus:outline-none"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;