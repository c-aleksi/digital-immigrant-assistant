import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Home, BookOpen, Search, Package, User } from 'lucide-react';

const navItems = [
  { key: 'nav.dashboard', path: '/dashboard', icon: Home },
  { key: 'nav.library', path: '/library', icon: Package },
  { key: 'nav.search', path: '/search', icon: Search },
  { key: 'nav.resources', path: '/resources', icon: BookOpen },
  { key: 'nav.profile', path: '/profile', icon: User },
];

export function BottomNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 glass-card safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {active && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
              )}
              <item.icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-105' : ''}`} />
              <span className="text-[11px]">{t(item.key)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
