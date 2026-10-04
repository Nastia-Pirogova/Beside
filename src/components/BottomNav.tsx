import { Home, ClipboardList, Plus, MessageSquare, User } from 'lucide-react';
import type { Screen } from '../types';
import { useApp } from '../store';

interface NavItem {
  screen: Screen;
  label: string;
  icon: typeof Home;
}

const familyNav: NavItem[] = [
  { screen: 'familyHome', label: 'Головна', icon: Home },
  { screen: 'familyRequests', label: 'Замовлення', icon: ClipboardList },
  { screen: 'createRequest', label: 'Допомога', icon: Plus },
  { screen: 'messages', label: 'Повідомлення', icon: MessageSquare },
  { screen: 'profile', label: 'Профіль', icon: User },
];

const helperNav: NavItem[] = [
  { screen: 'helperHome', label: 'Головна', icon: Home },
  { screen: 'helperHome', label: 'Замовлення', icon: ClipboardList },
  { screen: 'helperTasks', label: 'Мої завдання', icon: ClipboardList },
  { screen: 'helperMessages', label: 'Повідомлення', icon: MessageSquare },
  { screen: 'helperProfile', label: 'Профіль', icon: User },
];

export function BottomNav() {
  const { screen, role, navigate } = useApp();
  const nav = role === 'helper' ? helperNav : familyNav;

  const isActive = (item: NavItem) => {
    if (item.screen === screen) return true;
    if (item.screen === 'familyHome' && (screen === 'tracking' || screen === 'completedTask' || screen === 'published'))
      return true;
    if (item.screen === 'familyRequests' && (screen === 'published' || screen === 'tracking' || screen === 'completedTask'))
      return false;
    if (item.screen === 'createRequest' && screen === 'published') return false;
    if (item.screen === 'helperHome' && screen === 'requestDetails') return true;
    if (item.screen === 'helperTasks' && screen === 'helperActiveTask') return true;
    if (item.screen === 'helperMessages' && screen === 'messages') return true;
    if (item.screen === 'messages' && screen === 'helperMessages') return false;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-100 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {nav.map((item, idx) => {
          const active = isActive(item);
          const Icon = item.icon;
          const isCreate = item.screen === 'createRequest';

          if (isCreate) {
            return (
              <button
                key={`${item.screen}-${idx}`}
                onClick={() => navigate(item.screen)}
                className="flex flex-col items-center gap-0.5 -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-coral-500 text-white flex items-center justify-center shadow-floating active:scale-95 transition-transform">
                  <Icon className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-ink-600">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={`${item.screen}-${idx}`}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center gap-0.5 py-1.5 px-3 transition-colors"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${active ? 'text-coral-500' : 'text-ink-400'}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-xs transition-colors ${active ? 'text-coral-500 font-bold' : 'text-ink-400 font-semibold'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
