import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
}

interface RootState {
  auth: {
    token: string | null;
  };
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;