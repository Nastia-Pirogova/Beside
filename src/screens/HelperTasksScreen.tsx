import { useState } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import type { HelpRequest } from '../types';
import { Clock, MapPin, ChevronRight, CheckCircle2, Navigation, Wallet, Package } from 'lucide-react';

type Tab = 'active' | 'completed';

export function HelperTasksScreen() {
  const { helperActiveRequests, navigate, setActiveRequest } = useApp();
  const [tab, setTab] = useState<Tab>('active');

  const active = helperActiveRequests.filter((r) =>
    ['accepted', 'on_the_way', 'in_progress'].includes(r.status)
  );
  const completed = helperActiveRequests.filter((r) => ['completed', 'reviewed'].includes(r.status));
  const list = tab === 'active' ? active : completed;

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Мої завдання" showBack={false} />

      <div className="px-5 max-w-md mx-auto pt-4 space-y-4">
        <div className="flex bg-cream-200 rounded-2xl p-1">
          <button
            onClick={() => setTab('active')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'active' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
            }`}
          >
            Активні ({active.length})
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'completed' ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500'
            }`}
          >
            Завершені ({completed.length})
          </button>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-ink-300" />
            </div>
            <p className="text-ink-500 font-semibold">
              {tab === 'active' ? 'Немає активних завдань' : 'Завершених завдань поки немає'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((req) => (
              <HelperTaskCard
                key={req.id}
                request={req}
                onClick={() => {
                  setActiveRequest(req.id);
                  navigate(tab === 'active' ? 'helperActiveTask' : 'helperHome');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HelperTaskCard({ request, onClick }: { request: HelpRequest; onClick: () => void }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    accepted: { label: 'Помічника знайдено', color: 'bg-sage-50 text-sage-600' },
    on_the_way: { label: 'У дорозі', color: 'bg-coral-50 text-coral-600' },
    in_progress: { label: 'Виконується', color: 'bg-coral-50 text-coral-600' },
    completed: { label: 'Виконано', color: 'bg-sage-50 text-sage-600' },
    reviewed: { label: 'Виконано', color: 'bg-sage-50 text-sage-600' },
  };
  const status = statusConfig[request.status] ?? { label: '', color: '' };

  return (
    <Card className="p-4" hover onClick={onClick}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={request.category} size={22} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-ink-500 mt-1">{request.elderlyName}, {request.elderlyAge} років</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-ink-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {request.date}, {request.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {request.distanceKm} км
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink-100">
            <span className="flex items-center gap-1 text-sm font-bold text-coral-500">
              <Wallet className="w-4 h-4" />
              {request.reward} грн
            </span>
            <ChevronRight className="w-5 h-5 text-ink-300" />
          </div>
        </div>
      </div>
    </Card>
  );
}
