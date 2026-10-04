import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../store';

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  backScreen?: import('../types').Screen;
  rightAction?: ReactNode;
}

export function ScreenHeader({ title, showBack = true, backScreen, rightAction }: ScreenHeaderProps) {
  const { navigate, role } = useApp();
  const goBack = () => {
    if (backScreen) {
      navigate(backScreen);
    } else {
      navigate(role === 'helper' ? 'helperHome' : 'familyHome');
    }
  };
  return (
    <header className="sticky top-0 z-30 bg-cream-100/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-200 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-ink-700" />
            </button>
          )}
          <h1 className="text-xl font-bold text-ink-900">{title}</h1>
        </div>
        {rightAction}
      </div>
    </header>
  );
}

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-xl' },
    md: { box: 'w-10 h-10', text: 'text-2xl' },
    lg: { box: 'w-14 h-14', text: 'text-3xl' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.box} rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center shadow-sm`}
      >
        <svg viewBox="0 0 24 24" className="w-2/3 h-2/3" fill="none">
          <path
            d="M12 21C12 21 4 14.5 4 9C4 5.5 6.5 3 9.5 3C11 3 12 4 12 4C12 4 13 3 14.5 3C17.5 3 20 5.5 20 9C20 14.5 12 21 12 21"
            fill="white"
          />
        </svg>
      </div>
      <span className={`${s.text} font-extrabold text-ink-900 tracking-tight`}>Beside</span>
    </div>
  );
}
