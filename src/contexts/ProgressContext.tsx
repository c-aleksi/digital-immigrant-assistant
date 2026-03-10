import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProgress } from '@/types';

const STORAGE_KEY = 'dia-user-progress';

const defaultProgress: UserProgress = { completedStepIds: [] };

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load user progress from localStorage:', error);
  }
  return defaultProgress;
}

interface ProgressContextValue {
  progress: UserProgress;
  toggleStep: (stepId: string) => void;
  isCompleted: (stepId: string) => boolean;
  resetProgress: () => void;
  completedCount: number;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const toggleStep = (stepId: string) => {
    setProgress(prev => ({
      completedStepIds: prev.completedStepIds.includes(stepId)
        ? prev.completedStepIds.filter(id => id !== stepId)
        : [...prev.completedStepIds, stepId],
    }));
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      toggleStep,
      isCompleted: (id) => progress.completedStepIds.includes(id),
      resetProgress: () => { localStorage.removeItem(STORAGE_KEY); setProgress(defaultProgress); },
      completedCount: progress.completedStepIds.length,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
