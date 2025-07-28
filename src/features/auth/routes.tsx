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
  
  // Root redirect
  {
    path: '/',
    element: <DefaultRedirect />,
    auth: false,
  },
];