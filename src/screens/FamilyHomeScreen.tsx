import { useApp } from '../store';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import type { HelpRequest } from '../types';
import { Heart, Plus, CheckCircle2, Clock, MapPin, ShieldCheck, ChevronRight, Search, Package } from 'lucide-react';

export function FamilyHomeScreen() {
  const { familyUser, requests, navigate, setActiveRequest } = useApp();

  if (!familyUser) return null;
  const relative = familyUser.relative;

  const todayHour = new Date().getHours();
  const greeting = todayHour < 12 ? 'Доброго ранку' : todayHour < 18 ? 'Добрий день' : 'Добрий вечір';

  const searchingRequests = requests.filter((r) => r.status === 'searching');
  const activeRequests = requests.filter((r) =>
    ['accepted', 'on_the_way', 'in_progress'].includes(r.status)
  );
  const upcomingRequests = activeRequests.filter((r) => r.status === 'accepted');
  const completedRequests = requests.filter((r) => ['completed', 'reviewed'].includes(r.status));
  const hasActive = activeRequests.length > 0 || searchingRequests.length > 0;

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <div className="bg-gradient-to-b from-coral-50 to-cream-100 px-5 pt-12 pb-6">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <p className="text-ink-500 font-semibold text-sm">{greeting},</p>
            <h1 className="text-2xl font-extrabold text-ink-900">
              {familyUser.name} 👋
            </h1>
          </div>
          <button
            onClick={() => navigate('profile')}
            className="w-12 h-12 rounded-full bg-white shadow-card flex items-center justify-center active:scale-95 transition-transform"
          >
            <Avatar name={familyUser.name} size={36} variant={avatarVariantForName(familyUser.name)} />
          </button>
        </div>
      </div>

      <div className="px-5 max-w-md mx-auto space-y-5">
        {/* Relative card */}
        <Card className="p-5 animate-slide-up">
          <div className="flex items-start gap-4">
            <Avatar name={relative.name} size={64} variant="sage" />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-ink-900">
                {relative.name}, {relative.age} років
              </h2>
              <p className="text-ink-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-4 h-4" />
                {relative.city}
              </p>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-50 text-sage-600 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Все добре
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main CTA */}
        <div className="animate-slide-up">
          <h3 className="text-lg font-extrabold text-ink-900 mb-2.5">Потрібна допомога?</h3>
          <Button
            size="lg"
            fullWidth
            onClick={() => navigate('createRequest')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Створити замовлення
          </Button>
        </div>

        {/* Searching requests */}
        {searchingRequests.length > 0 && (
          <div className="animate-slide-up">
            <h3 className="text-lg font-extrabold text-ink-900 mb-2.5">Шукаємо помічника</h3>
            <div className="space-y-3">
              {searchingRequests.map((req) => (
                <Card key={req.id} className="p-4" hover onClick={() => { setActiveRequest(req.id); navigate('published'); }}>
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={req.category} size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink-900">{CATEGORY_LABELS[req.category]}</p>
                      <p className="text-sm text-ink-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {req.date}, {req.time}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm font-bold">
                      <Search className="w-4 h-4" />
                      Пошук
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active requests */}
        <div className="animate-slide-up">
          <h3 className="text-lg font-extrabold text-ink-900 mb-2.5">Активні замовлення</h3>
          {activeRequests.length === 0 ? (
            <Card className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-ink-300" />
              </div>
              <p className="text-ink-500 font-semibold mb-3">У вас поки немає активних замовлень</p>
              <Button variant="outline" onClick={() => navigate('createRequest')}>
                <Plus className="w-5 h-5 mr-2" />
                Створити перше замовлення
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onClick={() => { setActiveRequest(req.id); navigate('tracking'); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming help */}
        {upcomingRequests.length > 0 && (
          <div className="animate-slide-up">
            <h3 className="text-lg font-extrabold text-ink-900 mb-2.5">Майбутня допомога</h3>
            <div className="space-y-3">
              {upcomingRequests.map((req) => (
                <Card key={req.id} className="p-5" hover onClick={() => { setActiveRequest(req.id); navigate('tracking'); }}>
                  <div className="flex items-center gap-4">
                    <CategoryIcon category={req.category} size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink-900">{CATEGORY_LABELS[req.category]}</p>
                      <p className="text-sm text-ink-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {req.date}, {req.time}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-50 text-sage-600 text-sm font-bold">
                      Підтверджено
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trust badge */}
        <Card className="p-4 bg-sage-50 border border-sage-100" hover onClick={() => navigate('trustSafety')}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-sage-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink-800">Довіра та безпека</p>
              <p className="text-sm text-ink-500">Кожен помічник перевірений Beside</p>
            </div>
            <ChevronRight className="w-5 h-5 text-ink-400" />
          </div>
        </Card>

        {/* Completed */}
        {completedRequests.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-lg font-extrabold text-ink-900">Завершені</h3>
              <button onClick={() => navigate('familyRequests')} className="text-coral-500 font-bold text-sm">
                Всі
              </button>
            </div>
            <div className="space-y-3">
              {completedRequests.slice(0, 2).map((req) => (
                <CompletedRequestCard key={req.id} request={req} onClick={() => { setActiveRequest(req.id); navigate('completedTask'); }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({ request, onClick }: { request: HelpRequest; onClick: () => void }) {
  const statusLabels: Record<string, string> = {
    accepted: 'Помічника знайдено',
    on_the_way: 'Помічник вирушив',
    in_progress: 'Виконується',
  };
  return (
    <Card className="p-4" hover onClick={onClick}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={request.category} size={22} />
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h4>
          <p className="text-sm text-ink-500 mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {request.date}, {request.time}
          </p>
          <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-full bg-sage-50 text-sage-600 text-xs font-bold">
            {statusLabels[request.status] ?? ''}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-ink-300 mt-1" />
      </div>
    </Card>
  );
}

function CompletedRequestCard({ request, onClick }: { request: HelpRequest; onClick: () => void }) {
  return (
    <Card className="p-4" hover onClick={onClick}>
      <div className="flex items-center gap-4">
        <CategoryIcon category={request.category} size={20} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-ink-800">{CATEGORY_LABELS[request.category]}</p>
          <p className="text-sm text-ink-500">{request.date} · {request.time}</p>
        </div>
        <Heart className="w-5 h-5 text-sage-600 fill-sage-600" />
      </div>
    </Card>
  );
}
