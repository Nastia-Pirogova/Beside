import { useApp } from '../store';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { ScreenHeader, Logo } from '../components/ScreenHeader';
import { VerifiedBadge } from '../components/Badge';
import { CATEGORY_LABELS, RELATIONSHIP_LABELS } from '../data';
import {
  User,
  Heart,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export function ProfileScreen() {
  const { familyUser, requests, navigate, resetApp } = useApp();

  if (!familyUser) return null;
  const relative = familyUser.relative;

  const menuItems = [
    { icon: User, label: 'Особисті дані', screen: 'profile' as const },
    { icon: Heart, label: 'Моя родина', screen: 'familyHome' as const },
    { icon: ShieldCheck, label: 'Безпека та довіра', screen: 'trustSafety' as const },
    { icon: Bell, label: 'Сповіщення', screen: 'profile' as const },
    { icon: HelpCircle, label: 'Допомога та підтримка', screen: 'trustSafety' as const },
  ];

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Профіль" showBack={false} />
      <div className="px-5 max-w-md mx-auto pt-4 space-y-5">
        {/* User card */}
        <Card className="p-5 text-center">
          <Avatar name={familyUser.name} size={80} variant={avatarVariantForName(familyUser.name)} className="mx-auto" />
          <h2 className="text-xl font-extrabold text-ink-900 mt-3">{familyUser.name}</h2>
          <p className="text-sm text-ink-500 mt-1">Родина · з 2026 року</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm text-ink-600">
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-ink-400" />
              {familyUser.email}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-1 text-sm text-ink-600">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-ink-400" />
              {familyUser.phone}
            </span>
          </div>
        </Card>

        {/* Relative card */}
        <div>
          <h3 className="text-lg font-extrabold text-ink-900 mb-2.5 px-1">Моя літня родина</h3>
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <Avatar name={relative.name} size={56} variant="sage" />
              <div className="flex-1">
                <h4 className="font-extrabold text-ink-900">{relative.name}, {relative.age}</h4>
                <p className="text-sm text-ink-500 mt-0.5">{RELATIONSHIP_LABELS[relative.relationship]}</p>
                <div className="space-y-1 mt-2 text-sm text-ink-600">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-ink-400" />
                    {relative.city}, {relative.address}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-ink-400" />
                    {relative.phone}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-extrabold text-coral-500">{requests.length}</p>
            <p className="text-xs text-ink-500 font-semibold mt-0.5">Заявок</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-extrabold text-sage-600">
              {requests.filter((r) => r.status === 'reviewed' || r.status === 'completed').length}
            </p>
            <p className="text-xs text-ink-500 font-semibold mt-0.5">Завершено</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-500">5.0</p>
            <p className="text-xs text-ink-500 font-semibold mt-0.5">Рейтинг родини</p>
          </Card>
        </div>

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
