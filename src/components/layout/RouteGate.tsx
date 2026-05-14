import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import type { Role } from '@/types/domain';
import { routeAllowed } from '@/lib/permissions/rbac';

interface Props {
  children: ReactNode;
  role?: Role;
}

export function RouteGate({ children, role }: Props) {
  const auth = useAuth();
  const loc = useLocation();

  if (auth.role === 'guest') {
    const target = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/auth?next=${target}`} replace />;
  }

  if (role && auth.role !== role && auth.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (!routeAllowed(auth.role, loc.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
