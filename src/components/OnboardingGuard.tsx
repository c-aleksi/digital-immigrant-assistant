import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user } = useUser();
  if (!user.onboardingCompleted) {
    if (!user.language) return <Navigate to="/" replace />;
    // Bundle-first: check selectedBundleIds OR legacy scenario
    if (!user.scenario && user.selectedBundleIds.length === 0) return <Navigate to="/onboarding/scenario" replace />;
    if (!user.municipality) return <Navigate to="/onboarding/municipality" replace />;
    return <Navigate to="/onboarding/email" replace />;
  }
  return <>{children}</>;
}
