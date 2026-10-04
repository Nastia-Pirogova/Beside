import { useApp } from '../store';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { ScreenHeader, Logo } from '../components/ScreenHeader';
import { VerifiedBadge } from '../components/Badge';
import { RatingDisplay } from '../components/Rating';
import { CATEGORY_LABELS } from '../data';
import {
  Star,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Phone,
  Mail,
  Award,
  TrendingUp,
} from 'lucide-react';

export function HelperProfileScreen() {
  const { helperUser, navigate, resetApp } = useApp();

  if (!helperUser) return null;

  const menuItems = [
    { icon: ShieldCheck, label: 'Безпека та довіра', screen: 'trustSafety' as const },
    { icon: Bell, label: 'Сповіщення', screen: 'helperProfile' as const },
    { icon: HelpCircle, label: 'Допомога та підтримка', screen: 'trustSafety' as const },
  ];

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Профіль" showBack={false} />
      <div className="px-5 max-w-md mx-auto pt-4 space-y-5">
        {/* Profile card */}
        <Card className="p-5 text-center">
          <Avatar name={helperUser.name} size={80} variant={avatarVariantForName(helperUser.name)} className="mx-auto" />
          <h2 className="text-xl font-extrabold text-ink-900 mt-3">{helperUser.name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <RatingDisplay rating={helperUser.rating} size={16} />
            <span className="text-sm text-ink-500 font-semibold">· {helperUser.completedTasks} завдань</span>
          </div>
          <div className="flex justify-center mt-3">
            <VerifiedBadge />
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-ink-600">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-ink-400" />
              {helperUser.email}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-1 text-sm text-ink-600">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-ink-400" />
              {helperUser.phone}
            </span>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl font-extrabold text-coral-500">{helperUser.completedTasks}</p>
            <p className="text-xs text-ink-500 font-semibold mt-0.5">Завершено</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-extrabold text-sage-600">{helperUser.rating}</p>
            <p className="text-xs text-ink-500 font-semibold mt-0.5">Рейтинг</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-extrabold text-amber-500">
              {helperUser.completedTasks * helperUser.pricePerTask}
            </p>
            <p className="text-xs text-ink-500 font-semibold mt-0.5">Зароблено</p>
          </Card>
        </div>

        {/* Specialties */}
        <Card className="p-5">
          <h3 className="font-extrabold text-ink-900 mb-3">Мої послуги</h3>
          <div className="flex flex-wrap gap-2">
            {helperUser.specialties.map((cat) => (
              <span key={cat} className="px-3 py-1.5 rounded-full text-sm font-bold bg-cream-100 text-ink-700">
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
          </div>
        </Card>

        {/* Qualifications */}
        {helperUser.qualifications.length > 0 && (
          <Card className="p-5">
            <h3 className="font-extrabold text-ink-900 mb-3">Кваліфікації</h3>
            <div className="space-y-2">
              {helperUser.qualifications.map((q) => (
                <div key={q} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-coral-500" />
                  </div>
                  <span className="font-bold text-ink-800">{q}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Menu */}
        <Card className="p-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.screen)}
                className="flex items-center gap-3 w-full p-3.5 rounded-2xl hover:bg-cream-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-ink-600" />
                </div>
                <span className="flex-1 text-left font-bold text-ink-800">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-ink-300" />
              </button>
            );
          })}
        </Card>

        {/* Logout */}
        <button
          onClick={resetApp}
          className="flex items-center gap-3 w-full p-4 bg-white rounded-2xl shadow-card hover:shadow-cardHover transition-all active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-bold text-red-500">Вийти з акаунта</span>
        </button>

        <div className="text-center pt-2">
          <Logo size="sm" />
          <p className="text-xs text-ink-400 mt-1">Версія 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
