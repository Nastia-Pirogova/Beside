import { useState } from 'react';
import { useApp } from '../store';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import type { HelpRequest } from '../types';
import { Clock, MapPin, ChevronRight, CheckCircle2, Navigation, Search, Wallet } from 'lucide-react';

type Tab = 'active' | 'completed';

export function FamilyRequestsScreen() {
  const { requests, navigate, setActiveRequest, helpers } = useApp();
  const [tab, setTab] = useState<Tab>('active');

  const active = requests.filter((r) =>
    ['searching', 'accepted', 'on_the_way', 'in_progress'].includes(r.status)
  );
  const completed = requests.filter((r) => ['completed', 'reviewed'].includes(r.status));
  const list = tab === 'active' ? active : completed;

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Замовлення" showBack={false} />

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
              <Clock className="w-10 h-10 text-ink-300" />
            </div>
            <p className="text-ink-500 font-semibold">
              {tab === 'active' ? 'У вас поки немає активних замовлень' : 'Завершених замовлень поки немає'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                helperName={req.helperId ? helpers.find((h) => h.id === req.helperId)?.name : undefined}
                onClick={() => {
                  setActiveRequest(req.id);
                  if (req.status === 'searching') navigate('published');
                  else if (req.status === 'completed' || req.status === 'reviewed') navigate('completedTask');
                  else navigate('tracking');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request, helperName, onClick }: { request: HelpRequest; helperName?: string; onClick: () => void }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    searching: { label: 'Шукаємо помічника', color: 'bg-amber-50 text-amber-600' },
    accepted: { label: 'Помічника знайдено', color: 'bg-sage-50 text-sage-600' },
    on_the_way: { label: 'Помічник вирушив', color: 'bg-coral-50 text-coral-600' },
    in_progress: { label: 'Виконується', color: 'bg-coral-50 text-coral-600' },
    completed: { label: 'Виконано', color: 'bg-sage-50 text-sage-600' },
    reviewed: { label: 'Виконано', color: 'bg-sage-50 text-sage-600' },
  };
  const status = statusConfig[request.status] ?? { label: '', color: '' };

  return (
    <Card className="p-4" hover onClick={onClick}>
      <div className="flex items-start gap-4">
        <CategoryIcon category={request.category} size={22} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-ink-500 mt-1 line-clamp-1">{request.description}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-ink-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {request.date}, {request.time}
            </span>
            <span className="flex items-center gap-1 font-bold text-coral-500">
              <Wallet className="w-3.5 h-3.5" />
              {request.reward} грн
            </span>
          </div>
          {helperName && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-ink-100">
              <Avatar name={helperName} size={24} variant={avatarVariantForName(helperName)} />
              <span className="text-sm font-semibold text-ink-600">{helperName}</span>
            </div>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-ink-300 mt-1" />
      </div>
    </Card>
  );
}
