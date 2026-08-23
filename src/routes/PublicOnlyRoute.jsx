import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicOnlyRoute() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}
