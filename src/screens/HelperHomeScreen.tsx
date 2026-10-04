import { useState } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { VerifiedBadge } from '../components/Badge';
import { RatingDisplay } from '../components/Rating';
import { CATEGORY_LABELS } from '../data';
import type { HelpRequest } from '../types';
import { MapPin, Clock, Wallet, ChevronRight, SlidersHorizontal, Award, CheckCircle2 } from 'lucide-react';

type FilterType = 'all' | 'basic' | 'specialized' | 'nearby';

export function HelperHomeScreen() {
  const { helperUser, availableRequests, navigate, setActiveRequest } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!helperUser) return null;
  const todayHour = new Date().getHours();
  const greeting = todayHour < 12 ? 'Доброго ранку' : todayHour < 18 ? 'Добрий день' : 'Добрий вечір';

  const filtered = availableRequests.filter((r) => {
    if (filter === 'basic') return r.serviceType === 'basic';
    if (filter === 'specialized') return r.serviceType === 'specialized';
    if (filter === 'nearby') return r.distanceKm <= 2;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <div className="bg-gradient-to-b from-coral-50 to-cream-100 px-5 pt-12 pb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <p className="text-ink-500 font-semibold text-sm">{greeting},</p>
            <h1 className="text-2xl font-extrabold text-ink-900">
              {helperUser.name.split(' ')[0]} 👋
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <RatingDisplay rating={helperUser.rating} size={14} />
              <span className="text-sm text-ink-500 font-semibold">· {helperUser.completedTasks} завдань</span>
            </div>
          </div>
          <button
            onClick={() => navigate('helperProfile')}
            className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <Avatar name={helperUser.name} size={36} variant={avatarVariantForName(helperUser.name)} />
          </button>
        </div>
        <div className="max-w-md mx-auto mt-3">
          <VerifiedBadge />
        </div>
      </div>

      <div className="px-5 max-w-md mx-auto space-y-5">
        {/* Available orders heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink-900">Доступні замовлення</h2>
            <p className="text-sm text-ink-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-4 h-4" />
              Суми
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center active:scale-90 transition-transform">
            <SlidersHorizontal className="w-5 h-5 text-ink-600" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {([
            { key: 'all', label: 'Усі' },
            { key: 'nearby', label: 'Поруч' },
            { key: 'basic', label: 'Побутова' },
            { key: 'specialized', label: 'Спеціалізована' },
          ] as { key: FilterType; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                filter === tab.key ? 'bg-coral-500 text-white' : 'bg-white text-ink-600 shadow-card'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        <p className="text-sm text-ink-500 font-semibold">{filtered.length} замовлень доступно</p>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink-500 font-semibold">Немає доступних замовлень</p>
            </div>
          ) : (
            filtered.map((req) => (
              <HelperOrderCard
                key={req.id}
                request={req}
                onClick={() => { setActiveRequest(req.id); navigate('requestDetails'); }}
                canAcceptSpecialized={helperUser.qualified}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function HelperOrderCard({ request, onClick, canAcceptSpecialized }: { request: HelpRequest; onClick: () => void; canAcceptSpecialized: boolean }) {
  const isSpecialized = request.serviceType === 'specialized';
  return (
    <Card className="p-4" hover onClick={onClick}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={request.category} size={22} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h4>
            {isSpecialized && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600">
                <Award className="w-3.5 h-3.5" />
                Кваліфікація
              </span>
            )}
          </div>
          <p className="text-sm text-ink-500 mt-0.5">{request.elderlyName}, {request.elderlyAge} років</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-ink-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {request.distanceKm} км
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {request.date}, {request.time}
            </span>
          </div>
          <p className="text-sm text-ink-600 mt-2 line-clamp-2">{request.description}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink-100">
            <span className="flex items-center gap-1 text-sm font-extrabold text-coral-500">
              <Wallet className="w-4 h-4" />
              {request.reward} грн
            </span>
            <span className="text-sm font-bold text-coral-500">
              Переглянути
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
