import React from 'react';
import { PageView, User } from '../../types';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, LogOut, ChefHat, Sparkles } from 'lucide-react';

interface AdminLayoutProps {
  currentPage: PageView;
  setPageView: (page: PageView) => void;
  currentUser: User;
  logout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admin-food', label: 'Food Items', icon: UtensilsCrossed },
  { id: 'admin-orders', label: 'Orders', icon: ShoppingBag },
  { id: 'admin-users', label: 'Customers', icon: Users },
] as const;

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPage, setPageView, currentUser, logout, children }) => {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30 glow-pulse">
                <ChefHat className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 fill-amber-400 sparkle-float" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <div className="font-display font-black text-xl">Patil</div>
                <div className="font-display font-black text-xl italic animated-gradient-text">Foods</div>
              </div>
              <div className="font-stencil text-[10px] text-amber-400 tracking-[0.25em] mt-0.5">★ ADMIN PANEL ★</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPageView(item.id as PageView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3 p-3 bg-slate-800 rounded-xl">
            <img
              src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
              alt={currentUser.name}
              onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`; }}
              className="w-10 h-10 rounded-full ring-2 ring-amber-400 object-cover bg-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm truncate">{currentUser.name}</div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Administrator</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile nav strip */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 z-30 flex border-t border-slate-700"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setPageView(item.id as PageView)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 ${isActive ? 'text-rose-400' : 'text-slate-400'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
};
