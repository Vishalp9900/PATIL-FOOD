import React, { useState } from 'react';
import { PageView, CartItem, User } from '../types';
import { MASTER_ADMIN_EMAIL } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { ShoppingBag, History, UtensilsCrossed, LogIn, LogOut, Shield, ChevronDown, UserCircle, Settings2 } from 'lucide-react';

interface HeaderProps {
  currentPage: PageView;
  setPageView: (page: PageView) => void;
  cartItems: CartItem[];
  currentUser: User | null;
  logout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, setPageView, cartItems, currentUser, logout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.foodItem.price * item.quantity), 0);

  const isAdminPage = currentPage.startsWith('admin');
  const isMasterAdmin = currentUser?.role === 'admin' && currentUser.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <BrandLogo
              size="md"
              onClick={() => setPageView(currentUser?.role === 'admin' && isAdminPage ? 'admin-dashboard' : 'menu')}
            />
            {isAdminPage && (
              <span className="hidden sm:inline-flex bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-md tracking-widest shadow-md ring-1 ring-amber-300">
                ADMIN
              </span>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2">
            
            {!isAdminPage && (
              <>
                {/* Menu Button */}
                <button
                  onClick={() => setPageView('menu')}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    currentPage === 'menu' 
                      ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Menu</span>
                </button>

                {/* My Orders Button — only when logged in as customer */}
                {currentUser && (
                  <button
                    onClick={() => setPageView('orders')}
                    className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      currentPage === 'orders' 
                        ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span>Orders</span>
                  </button>
                )}

                {currentUser && (
                  <button
                    onClick={() => setPageView('settings')}
                    className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      currentPage === 'settings'
                        ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Settings2 className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                )}

                {/* Cart Button */}
                <button
                  onClick={() => setPageView('cart')}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    currentPage === 'cart'
                      ? 'bg-slate-900 text-white ring-2 ring-slate-900/20 shadow-lg shadow-slate-900/20'
                      : totalItems > 0 
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-lg shadow-md shadow-rose-500/30 hover:scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-rose-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md ring-2 ring-rose-500">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Cart</span>
                  {totalAmount > 0 && (
                    <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs font-extrabold">
                      ₹{totalAmount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-white"
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-black text-slate-900 leading-tight">{currentUser.name.split(' ')[0]}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {isMasterAdmin ? '🛡️ Admin' : 'Customer'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 z-40 overflow-hidden">
                      <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 border-b border-slate-100">
                        <div className="font-black text-slate-900">{currentUser.name}</div>
                        <div className="text-xs text-slate-500 font-semibold">{currentUser.email}</div>
                      </div>
                      <div className="p-2">
                        {isMasterAdmin && (
                          <button
                            onClick={() => { setPageView('admin-dashboard'); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-amber-50 rounded-xl text-sm font-bold text-slate-700 cursor-pointer ring-1 ring-amber-100 mb-1"
                          >
                            <Shield className="w-4 h-4 text-amber-500" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                        <button
                          onClick={() => { setPageView('orders'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <History className="w-4 h-4 text-slate-400" />
                          <span>My Orders</span>
                        </button>
                        <button
                          onClick={() => { setPageView('profile'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <UserCircle className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={() => { setPageView('settings'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 cursor-pointer"
                        >
                          <Settings2 className="w-4 h-4 text-slate-400" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-50 rounded-xl text-sm font-bold text-rose-600 cursor-pointer mt-1 border-t border-slate-100 pt-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setPageView('login')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
