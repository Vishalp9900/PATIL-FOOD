import React from 'react';
import { Home, History, ShoppingBag, UserCircle2, Settings2, LogIn } from 'lucide-react';
import { PageView, User } from '../types';
import { cn } from '../utils/cn';

interface CustomerBottomNavProps {
  currentPage: PageView;
  currentUser: User | null;
  setPageView: (page: PageView) => void;
}

const buildItems = (currentUser: User | null) => {
  if (!currentUser) {
    return [
      { id: 'menu', label: 'Home', icon: Home as React.ElementType },
      { id: 'login', label: 'Sign In', icon: LogIn as React.ElementType },
      { id: 'cart', label: 'Cart', icon: ShoppingBag as React.ElementType },
    ];
  }

  return [
    { id: 'menu', label: 'Home', icon: Home as React.ElementType },
    { id: 'orders', label: 'Orders', icon: History as React.ElementType },
    { id: 'cart', label: 'Cart', icon: ShoppingBag as React.ElementType },
    { id: 'profile', label: 'Profile', icon: UserCircle2 as React.ElementType },
    { id: 'settings', label: 'Settings', icon: Settings2 as React.ElementType },
  ];
};

export const CustomerBottomNav: React.FC<CustomerBottomNavProps> = ({ currentPage, currentUser, setPageView }) => {
  const navItems = buildItems(currentUser);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)]"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-label="Bottom navigation"
    >
      <div
        className="grid gap-1 px-2 pt-2"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPageView(item.id as PageView)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-2xl py-2.5 text-[10px] font-black tracking-wide transition-all',
                isActive
                  ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25 scale-[1.02]'
                  : 'text-slate-500 hover:bg-slate-50 active:scale-[0.98]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};