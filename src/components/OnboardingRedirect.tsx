import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

/**
 * Redirects completed users away from onboarding screens to the dashboard.
 */
export function OnboardingRedirect({ children }: { children: ReactNode }) {
  const { user } = useUser();
  if (user.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
