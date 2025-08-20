// components/auth/RouteGuard.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/authService';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('teacher' | 'student')[];
  requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuthorization = () => {
    const isAuthenticated = AuthService.isAuthenticated();
    const userRole = AuthService.getUserRole();

    // Se não requer autenticação, autorizar
    if (!requireAuth) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Se requer autenticação mas não está autenticado
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Se tem roles específicas permitidas
    if (allowedRoles.length > 0 && userRole) {
      if (!allowedRoles.includes(userRole)) {
        // Redirecionar para a página correta baseada na role
        const correctPath = AuthService.getRedirectPath(userRole);
        router.push(correctPath);
        return;
      }
    }

    setIsAuthorized(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

export default RouteGuard;