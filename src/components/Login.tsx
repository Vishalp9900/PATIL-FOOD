import React, { useState } from 'react';
import { User, PageView } from '../types';
import { MASTER_ADMIN_EMAIL } from '../data/mockData';
import { BrandLogo } from './BrandLogo';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';

interface LoginProps {
  users: User[];
  login: (user: User) => void;
  register: (user: Omit<User, 'id' | 'createdAt' | 'role'>) => User;
  setPageView: (page: PageView) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const Login: React.FC<LoginProps> = ({ users, login, register, setPageView, showToast }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password);
      if (user) {
        login(user);
        // Only the master admin email gets routed to the admin panel
        const isMasterAdmin = user.role === 'admin' && user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
        if (isMasterAdmin) {
          showToast(`Welcome back, Administrator ${user.name}! 🛡️`, 'success');
          setPageView('admin-dashboard');
        } else {
          showToast(`Welcome back, ${user.name}! 👋`, 'success');
          setPageView('menu');
        }
      } else {
        showToast('Invalid email or password', 'error');
      }
    } else {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        showToast('Please fill all fields', 'error');
        return;
      }
      if (formData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
      if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
        showToast('This email is already registered', 'error');
        return;
      }
      // Reserved email — cannot register as the master admin
      if (formData.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
        showToast('This email address is reserved and cannot be registered', 'error');
        return;
      }

      const newUser = register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      login(newUser);
      showToast(`Welcome to Patil Foods, ${newUser.name}! 🎉`, 'success');
      setPageView('menu');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-slate-200">
        
        {/* Left side — Brand panel */}
        <div className="relative bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 p-10 sm:p-12 text-white hidden lg:flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-20 text-9xl opacity-10">🍕</div>
          <div className="absolute bottom-20 left-20 text-8xl opacity-10">🍔</div>

          <div className="relative z-10">
            <div className="mb-10">
              <BrandLogo size="lg" variant="dark" showTagline={true} showBadge={false} />
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-black leading-tight mb-4">
              {mode === 'login' ? (
                <>Welcome back to <span className="italic">flavor town</span> 🌶️</>
              ) : (
                <>Join the <span className="italic">Patil Foods</span> family 🎉</>
              )}
            </h1>
            <p className="text-rose-50/90 text-base leading-relaxed">
              {mode === 'login'
                ? 'Sign in to track your orders, save addresses, and order your favorite gourmet meals in seconds.'
                : 'Create your account in 30 seconds and start ordering authentic, chef-curated meals delivered fresh to your doorstep.'}
            </p>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="text-2xl font-black">41+</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Dishes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="text-2xl font-black">30 min</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Delivery</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center">
              <div className="text-2xl font-black">4.8★</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-100">Rating</div>
            </div>
          </div>
        </div>

        {/* Right side — Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="lg:hidden flex justify-center mb-8">
            <BrandLogo size="md" showTagline={false} />
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-8">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 rounded-xl text-sm font-black transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {mode === 'login' ? 'Enter your credentials below' : 'Fill in your details to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rohan Patil"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl ring-1 ring-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-black py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Helper / footer */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500 font-semibold">
                New to Patil Foods?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-rose-600 font-black hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-semibold">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-rose-600 font-black hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-semibold mt-3">
              🔒 Your data is securely encrypted and protected
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
