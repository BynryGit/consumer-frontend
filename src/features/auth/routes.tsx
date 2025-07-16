import { RouteObject, useNavigate } from 'react-router-dom';
import SignInComponent from './components/Login';
import DashboardComponent from '../dashboard/components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import SignUp from './components/SignUp';
import { AuthGuard } from './components/AuthGuard';

export interface AuthRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: AuthRoute[];
}

const SignUpRoute = () => {
  const navigate = useNavigate();
  return <SignUp onSwitchToSignIn={() => navigate('/login')} />;
};

const ForgotPasswordRoute = () => {
  const navigate = useNavigate();
  return <ForgotPassword onSwitchToSignIn={() => navigate('/login')} />;
};

const SignInRoute = () => {
  const navigate = useNavigate();
  return (
    <SignInComponent
      onSwitchToSignUp={() => navigate('/signup')}
      onSwitchToForgotPassword={() => navigate('/forgot-password')}
    />
  );
};

export const authRoutes: AuthRoute[] = [
  {
    path: '/login',
    element: <SignInRoute />,
    auth: false, // Public route  
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordRoute />,
    auth: false,
  },
  {
    path: '/signup',
    element:(<AuthGuard> <SignUpRoute /></AuthGuard>),
    auth: false,
  },
  {
    path: '/',
    element: (<AuthGuard><SignInRoute /></AuthGuard>), // Redirect to login by default
    auth: false,
  },
];

