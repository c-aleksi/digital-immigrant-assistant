import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserContext as UserContextType, Language, ScenarioId, MunicipalityId } from '@/types';

const STORAGE_KEY = 'dia-user-context';

const defaultContext: UserContextType = {
  language: 'en',
  scenario: null,
  municipality: null,
  email: null,
  consent: false,
  onboardingCompleted: false,
  selectedBundleIds: [],
  hiddenStepIds: [],
};

function loadContext(): UserContextType {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultContext, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Failed to load user context from localStorage:', error);
  }
  return defaultContext;
}

interface UserContextValue {
  user: UserContextType;
  setLanguage: (lang: Language) => void;
  /** @deprecated Use selectOnboardingBundle instead */
  setScenario: (s: ScenarioId) => void;
  setMunicipality: (m: MunicipalityId) => void;
  setEmail: (email: string, consent: boolean) => void;
  completeOnboarding: () => void;
  resetAll: () => void;
  updateUser: (partial: Partial<UserContextType>) => void;
  // Bundle-first methods
  selectOnboardingBundle: (bundleId: string, legacyScenarioId?: ScenarioId) => void;
  addBundle: (bundleId: string) => void;
  removeBundle: (bundleId: string) => void;
  // Personal feed step management
  hideStep: (stepId: string) => void;
  unhideStep: (stepId: string) => void;
  clearHiddenStepsForBundle: (stepIds: string[]) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextType>(loadContext);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const update = (partial: Partial<UserContextType>) => setUser(prev => ({ ...prev, ...partial }));

  const selectOnboardingBundle = (bundleId: string, legacyScenarioId?: ScenarioId) => {
    setUser(prev => {
      const ids = prev.selectedBundleIds.filter(id => id !== bundleId);
      return {
        ...prev,
        selectedBundleIds: [bundleId, ...ids],
        // Keep legacy scenario for backward compat
        scenario: legacyScenarioId || prev.scenario,
      };
    });
  };

  const addBundle = (bundleId: string) => {
    setUser(prev => ({
      ...prev,
      selectedBundleIds: prev.selectedBundleIds.includes(bundleId)
        ? prev.selectedBundleIds
        : [...prev.selectedBundleIds, bundleId],
    }));
  };

  const removeBundle = (bundleId: string) => {
    setUser(prev => ({
      ...prev,
      selectedBundleIds: prev.selectedBundleIds.filter(id => id !== bundleId),
    }));
  };

  const hideStep = (stepId: string) => {
    setUser(prev => ({
      ...prev,
      hiddenStepIds: prev.hiddenStepIds.includes(stepId)
        ? prev.hiddenStepIds
        : [...prev.hiddenStepIds, stepId],
    }));
  };

  const unhideStep = (stepId: string) => {
    setUser(prev => ({
      ...prev,
      hiddenStepIds: prev.hiddenStepIds.filter(id => id !== stepId),
    }));
  };

  const clearHiddenStepsForBundle = (stepIds: string[]) => {
    setUser(prev => ({
      ...prev,
      hiddenStepIds: prev.hiddenStepIds.filter(id => !stepIds.includes(id)),
    }));
  };

  return (
    <UserContext.Provider value={{
      user,
      setLanguage: (language) => update({ language }),
      setScenario: (scenario) => update({ scenario }),
      setMunicipality: (municipality) => update({ municipality }),
      setEmail: (email, consent) => update({ email, consent }),
      completeOnboarding: () => update({ onboardingCompleted: true }),
      resetAll: () => { localStorage.removeItem(STORAGE_KEY); setUser(defaultContext); },
      updateUser: update,
      selectOnboardingBundle,
      addBundle,
      removeBundle,
      hideStep,
      unhideStep,
      clearHiddenStepsForBundle,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
