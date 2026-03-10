import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
}

export function AppShell({ children, title, showBack, showNav = true }: AppShellProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const showBottomNav = showNav && user.onboardingCompleted;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {title && (
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 glass-card">
          <div className="flex items-center gap-3 px-5 h-14 max-w-lg mx-auto">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-foreground -ml-1 p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="font-semibold text-foreground truncate text-[15px] tracking-tight">{title}</h1>
          </div>
        </header>
      )}
      <main className={`flex-1 max-w-lg mx-auto w-full ${showBottomNav ? 'pb-24' : ''}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
