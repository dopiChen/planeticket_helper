import { useEffect } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';
import { isAuthenticated, PROTECTED_ROUTES, PUBLIC_ROUTES } from '../utils/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const needsAuth = PROTECTED_ROUTES.some(route => 
      location.pathname.startsWith(route)
    );

    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    if (needsAuth && !isAuthenticated()) {
      // 保存用户想要访问的URL
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?returnUrl=${returnUrl}`);
    } else if (isAuthenticated() && isPublicRoute && location.pathname === '/login') {
      // 如果已登录但访问登录页，重定向到航班系统
      navigate('/flight/smart-routing');
    }
  }, [location, navigate]);

  return <>{children}</>;
}