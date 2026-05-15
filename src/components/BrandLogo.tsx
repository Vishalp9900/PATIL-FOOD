import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  showBadge?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'light',
  showTagline = true,
  showBadge = true,
  onClick,
}) => {
  // Sizing maps
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };
  const iconInner = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };
  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-7xl',
  };
  const taglineSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  };

  const titleColor = variant === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Animated icon badge */}
      <div className="relative">
        <div className={`${iconSizes[size]} bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 glow-pulse`}>
          <ChefHat className={iconInner[size]} strokeWidth={2.5} />
        </div>

        {/* Sparkles around icon */}
        <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-400 fill-amber-400 sparkle-float drop-shadow-lg" />
        {size !== 'sm' && (
          <Sparkles
            className="absolute -bottom-1 -left-1 w-2.5 h-2.5 text-amber-300 fill-amber-300 sparkle-float drop-shadow-lg"
            style={{ animationDelay: '1s' }}
          />
        )}

        {/* Active green dot */}
        {showBadge && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse shadow-md" />
        )}
      </div>

      {/* Brand text */}
      <div>
        <div className="flex items-baseline gap-2 brand-underline">
          <h1 className={`${titleSizes[size]} ${titleColor} font-display font-black tracking-tight leading-none`}>
            Patil
          </h1>
          <h1 className={`${titleSizes[size]} font-display font-black tracking-tight leading-none italic animated-gradient-text`}>
            Foods
          </h1>
        </div>

        {showTagline && (
          <p className={`${taglineSizes[size]} ${variant === 'dark' ? 'text-rose-200' : 'text-slate-500'} font-stencil tracking-[0.3em] mt-1 hidden sm:block`}>
            ✦ FINE DINING DELIVERED ✦
          </p>
        )}
      </div>
    </div>
  );
};
