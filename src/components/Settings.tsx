import React, { useEffect, useMemo, useState } from 'react';
import { LogOut, MoonStar, BellRing, ShieldCheck, ChevronRight, Sparkles, Settings2, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageView, User } from '../types';

interface SettingsProps {
  currentUser: User | null;
  setPageView: (page: PageView) => void;
  logout: () => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type ThemeMode = 'light' | 'dark';

type Preferences = {
  orderUpdates: boolean;
  offers: boolean;
  smsAlerts: boolean;
  emailReceipts: boolean;
  locationSharing: boolean;
  personalizedDeals: boolean;
};

const STORAGE_THEME_KEY = 'patil-food-theme';
const STORAGE_PREFS_KEY = 'patil-food-preferences';

const defaultPreferences: Preferences = {
  orderUpdates: true,
  offers: false,
  smsAlerts: true,
  emailReceipts: true,
  locationSharing: true,
  personalizedDeals: true,
};

const loadTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_THEME_KEY);
  return saved === 'dark' ? 'dark' : 'light';
};

const loadPreferences = (): Preferences => {
  if (typeof window === 'undefined') return defaultPreferences;
  const saved = window.localStorage.getItem(STORAGE_PREFS_KEY);
  if (!saved) return defaultPreferences;

  try {
    return { ...defaultPreferences, ...JSON.parse(saved) } as Preferences;
  } catch {
    return defaultPreferences;
  }
};

const SwitchRow: React.FC<{
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  theme: ThemeMode;
  accent?: 'rose' | 'emerald' | 'amber';
}> = ({ title, description, enabled, onToggle, theme, accent = 'rose' }) => {
  const accentStyles = {
    rose: enabled ? 'bg-rose-500' : 'bg-slate-300',
    emerald: enabled ? 'bg-emerald-500' : 'bg-slate-300',
    amber: enabled ? 'bg-amber-500' : 'bg-slate-300',
  } as const;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center justify-between gap-4 text-left rounded-2xl border px-4 py-4 transition-transform hover:-translate-y-0.5 active:scale-[0.99] ${
        theme === 'dark'
          ? 'border-slate-700 bg-slate-900/80 text-slate-100'
          : 'border-slate-200/70 bg-white/80 text-slate-900'
      }`}
    >
      <div className="min-w-0">
        <div className="font-black">{title}</div>
        <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{description}</div>
      </div>
      <div className={`relative h-7 w-12 rounded-full transition-colors ${accentStyles[accent]}`}>
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </button>
  );
};

export const Settings: React.FC<SettingsProps> = ({ currentUser, setPageView, logout, showToast }) => {
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTheme(loadTheme());
      setPreferences(loadPreferences());
      setIsReady(true);
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_THEME_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, isReady]);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences));
  }, [preferences, isReady]);

  const pageTheme = useMemo(() => {
    return theme === 'dark'
      ? {
          shell: 'bg-slate-950 text-slate-100',
          hero: 'from-slate-900 via-slate-950 to-slate-900 text-white',
          card: 'bg-slate-900/80 border-slate-800 text-slate-100',
          muted: 'text-slate-400',
          soft: 'bg-slate-900/70',
          surface: 'bg-slate-900/80 border-slate-800',
        }
      : {
          shell: 'bg-slate-50 text-slate-900',
          hero: 'from-rose-500 via-rose-600 to-orange-500 text-white',
          card: 'bg-white border-slate-100 text-slate-900',
          muted: 'text-slate-500',
          soft: 'bg-slate-50',
          surface: 'bg-white border-slate-200',
        };
  }, [theme]);

  if (!isReady) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 rounded-[2rem] bg-slate-200/80" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 rounded-3xl bg-slate-200/80 lg:col-span-1" />
          <div className="space-y-4 lg:col-span-2">
            <div className="h-28 rounded-3xl bg-slate-200/80" />
            <div className="h-28 rounded-3xl bg-slate-200/80" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 ${pageTheme.shell}`}>
      <section className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${pageTheme.hero} p-6 sm:p-8 shadow-2xl`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              Preferences
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">
              Settings that stay out of the way
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-white/85 leading-relaxed">
              Tune your delivery experience, switch the visual theme, and control the notifications you actually want to receive.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-72">
            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur-md">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Theme</div>
              <div className="mt-1 text-2xl font-black capitalize">{theme}</div>
            </div>
            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur-md">
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">Account</div>
              <div className="mt-1 text-2xl font-black">Ready</div>
            </div>
          </div>
        </div>
      </section>

      {!currentUser ? (
        <div className={`${pageTheme.card} rounded-3xl border p-6 shadow-sm`}>
          <div className="flex items-center gap-3">
            <Settings2 className="w-6 h-6 text-rose-500" />
            <div>
              <div className="font-black text-lg">Sign in to manage settings</div>
              <div className={`text-sm ${pageTheme.muted}`}>Your preferences are stored per account for a cleaner WebView experience.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPageView('login')}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-slate-800"
          >
            <span>Go to sign in</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className={`rounded-3xl border p-5 shadow-sm ${pageTheme.card}`}>
            <div className={`rounded-3xl ${pageTheme.soft} p-4`}>
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt={currentUser.name}
                  className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/60 shadow-lg"
                />
                <div className="min-w-0">
                  <div className="truncate text-lg font-black">{currentUser.name}</div>
                  <div className={`truncate text-sm ${pageTheme.muted}`}>{currentUser.email}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition-all hover:-translate-y-0.5 ${pageTheme.surface}`}
              >
                <div className="flex items-center gap-3">
                  <MoonStar className="w-5 h-5 text-amber-500" />
                  <div className="text-left">
                    <div className="font-black">Dark mode</div>
                    <div className={`text-xs ${pageTheme.muted}`}>Toggle the app theme for easier night use.</div>
                  </div>
                </div>
                {theme === 'dark' ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-slate-300" />}
              </button>

              <div className={`rounded-2xl border px-4 py-4 ${pageTheme.surface}`}>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="font-black">Privacy</div>
                    <div className={`text-xs ${pageTheme.muted}`}>Reviewed and synced for this device.</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                showToast('Signed out successfully', 'info');
              }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-rose-500/25 transition-all hover:bg-rose-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </aside>

          <div className="space-y-6 lg:col-span-2">
            <section className={`rounded-3xl border p-5 shadow-sm ${pageTheme.card}`}>
              <div className="mb-4 flex items-center gap-3">
                <BellRing className="w-5 h-5 text-rose-500" />
                <div>
                  <div className="font-black text-lg">Notification settings</div>
                  <div className={`text-sm ${pageTheme.muted}`}>Control the signals you want from Patil Foods.</div>
                </div>
              </div>

              <div className="space-y-3">
                <SwitchRow
                  title="Order updates"
                  description="Get live status updates while your food is on the move."
                  enabled={preferences.orderUpdates}
                  onToggle={() => setPreferences(prev => ({ ...prev, orderUpdates: !prev.orderUpdates }))}
                  theme={theme}
                  accent="emerald"
                />
                <SwitchRow
                  title="Promotional offers"
                  description="Hear about new combos, discounts, and seasonal specials."
                  enabled={preferences.offers}
                  onToggle={() => setPreferences(prev => ({ ...prev, offers: !prev.offers }))}
                  theme={theme}
                />
                <SwitchRow
                  title="SMS alerts"
                  description="Receive quick alerts about important delivery changes."
                  enabled={preferences.smsAlerts}
                  onToggle={() => setPreferences(prev => ({ ...prev, smsAlerts: !prev.smsAlerts }))}
                  theme={theme}
                  accent="amber"
                />
                <SwitchRow
                  title="Email receipts"
                  description="Save digital copies of every payment and order receipt."
                  enabled={preferences.emailReceipts}
                  onToggle={() => setPreferences(prev => ({ ...prev, emailReceipts: !prev.emailReceipts }))}
                  theme={theme}
                />
              </div>
            </section>

            <section className={`rounded-3xl border p-5 shadow-sm ${pageTheme.card}`}>
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <div className="font-black text-lg">Privacy settings</div>
                  <div className={`text-sm ${pageTheme.muted}`}>Keep your location and personalization preferences in control.</div>
                </div>
              </div>

              <div className="space-y-3">
                <SwitchRow
                  title="Location sharing"
                  description="Allow the app to use your location for faster checkout."
                  enabled={preferences.locationSharing}
                  onToggle={() => setPreferences(prev => ({ ...prev, locationSharing: !prev.locationSharing }))}
                  theme={theme}
                />
                <SwitchRow
                  title="Personalized deals"
                  description="Show recommendations based on your recent orders."
                  enabled={preferences.personalizedDeals}
                  onToggle={() => setPreferences(prev => ({ ...prev, personalizedDeals: !prev.personalizedDeals }))}
                  theme={theme}
                />
              </div>
            </section>
          </div>
        </div>
      )}

      <section className={`rounded-[2rem] border p-5 shadow-sm ${pageTheme.card}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="font-black text-lg">Session controls</div>
            <div className={`text-sm ${pageTheme.muted}`}>Use this when you need to sign out on a shared Android device.</div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            Logout now
          </button>
        </div>
      </section>
    </div>
  );
};