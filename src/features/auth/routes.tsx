import { RouteObject, useNavigate, useParams } from 'react-router-dom';
import SignInComponent from './components/Login';
import DashboardComponent from '../dashboard/components/DashboardCards';
import ForgotPassword from './components/ForgotPassword';
import SignUp from './components/SignUp';
import PasswordSetup from './components/PasswordSetup';
import { AuthGuard } from './components/AuthGuard';
import React from 'react';

export interface AuthRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: AuthRoute[];
}

// Wrapper components that extract tenant from URL
const SignInRoute = () => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  
  return (
    <SignInComponent
      tenant={tenant || 'default'} // Pass tenant to component
      onSwitchToSignUp={() => navigate(`/signup/${tenant}`)}
      onSwitchToForgotPassword={() => navigate(`/forgot-password/${tenant}`)}
    />
  );
};

const SignUpRoute = () => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  
  return (
    <SignUp 
      onSwitchToSignIn={() => navigate(`/login/${tenant}`)}
      onSwitchToPasswordSetup={() => navigate(`/setup-password/${tenant}`)}
    />
  );
};

const PasswordSetupRoute = () => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  
  return (
    <PasswordSetup 
      onComplete={() => navigate(`/login/${tenant}`)}
    />
  );
};

// NEW: Route component for handling reset password links from email
const ResetPasswordRoute = () => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  
  return (
    <PasswordSetup 
      onComplete={() => navigate(`/login/${tenant}`)}
    />
  );
};

const ForgotPasswordRoute = () => {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();
  
  return (
    <ForgotPassword 
      onSwitchToSignIn={() => navigate(`/login/${tenant}`)} 
    />
  );
};

// Default redirect component for root path
const DefaultRedirect = () => {
  const navigate = useNavigate();
  
  // Redirect to a default tenant or show tenant selection
  React.useEffect(() => {
    navigate('/login'); // or show tenant selection page
  }, [navigate]);
  
  return <div>Redirecting...</div>;
};

export const authRoutes: AuthRoute[] = [
  // Routes with tenant parameter
  {
    path: '/login/:tenant',
    element: <SignInRoute />,
    auth: false,
  },
  {
    path: '/forgot-password/:tenant',
    element: <ForgotPasswordRoute />,
    auth: false,
  },
  {
    path: '/signup/:tenant',
    element: (<AuthGuard><SignUpRoute /></AuthGuard>),
    auth: false,
  },
  {
    path: '/setup-password/:tenant',
    element: (<AuthGuard><PasswordSetupRoute /></AuthGuard>),
    auth: false,
  },
  
  // NEW ROUTES: Handle email links with code/et parameters
  // Email link format: https://consumer-staging.bynry.com/reset-password?code=777b8dab77a4b56f955413edeb4f74d9&et=1753788667&email=sayyam32%40yopmail.com&tnc_accepted=True&reset=True
  {
    path: '/reset-password/:tenant',
    element: (<AuthGuard><ResetPasswordRoute /></AuthGuard>),
    auth: false,
  },
  
  // Fallback routes without tenant (redirect to default)
  {
    path: '/login',
    element: <SignInRoute />, // Will use 'default' tenant
    auth: false,
  },
  {
    path: '/signup',
    element: (<AuthGuard><SignUpRoute /></AuthGuard>),
    auth: false,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordRoute />,
    auth: false,
  },
  {
    path: '/setup-password',
    element: (<AuthGuard><PasswordSetupRoute /></AuthGuard>),
    auth: false,
  },
  
  // NEW ROUTE: Handle email links without tenant
  {
    path: '/reset-password',
    element: (<AuthGuard><ResetPasswordRoute /></AuthGuard>),
    auth: false,
  },
  
  // Root redirect
  {
    path: '/',
    element: <DefaultRedirect />,
    auth: false,
  },
];

/*
COMPLETE FLOW EXPLANATION:

1. SIGNUP FLOW:
   - User visits: /signup/:tenant or /signup
   - SignUpRoute renders SignUp component
   - User enters email, SignUp calls useResetPassword() hook
   - Backend sends email with link: /reset-password?code=XXX&et=XXX&email=XXX&tnc_accepted=True&reset=True
   - User clicks email link
   - Browser navigates to: /reset-password or /reset-password/:tenant
   - ResetPasswordRoute renders PasswordSetup component
   - PasswordSetup extracts code/et from URL parameters using useSearchParams()
   - PasswordSetup calls resetPassword API with extracted parameters
   - On success, user redirects to login

2. FORGOT PASSWORD FLOW:
   - User visits: /forgot-password/:tenant or /forgot-password
   - ForgotPasswordRoute renders ForgotPassword component
   - User enters email, ForgotPassword calls useForgotPassword() hook
   - Backend sends email with same link format: /reset-password?code=XXX&et=XXX&email=XXX...
   - User clicks email link
   - Same flow as signup: /reset-password → PasswordSetup → API call → redirect to login

3. REGULAR LOGIN FLOW:
   - User visits: /login/:tenant or /login
   - SignInRoute renders SignInComponent (Login)
   - User enters credentials, calls login API
   - On success, redirects to dashboard

4. ROUTE STRUCTURE:
   - Routes with /:tenant parameter for multi-tenant support
   - Fallback routes without tenant default to 'default' tenant
   - AuthGuard wrapper for protected routes
   - All auth routes have auth: false (public access)

5. COMPONENT MAPPING:
   - /login → SignInComponent (Login form)
   - /signup → SignUp (Email collection for signup)
   - /forgot-password → ForgotPassword (Email collection for reset)
   - /setup-password → PasswordSetup (Manual password setup - if needed)
   - /reset-password → PasswordSetup (Email link password setup - handles URL params)
   - / → DefaultRedirect (Root redirect to login)

6. EMAIL LINK HANDLING:
   - Email links go to /reset-password with query parameters
   - ResetPasswordRoute renders PasswordSetup component
   - PasswordSetup component must extract and use URL parameters:
     * code: Reset verification code
     * et: Encrypted token/timestamp
     * email: User's email address
     * tnc_accepted: Terms acceptance flag
     * reset: Reset flow identifier

IMPORTANT NOTES:
- The PasswordSetup component must be updated to handle URL parameters
- Both signup and forgot password flows use the same reset-password endpoint
- The /reset-password route is the key route for email link handling
- AuthGuard protects routes that need authentication checks
*/