import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { RatingDisplay } from '../components/Rating';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { VerifiedBadge } from '../components/Badge';
import { CATEGORY_LABELS } from '../data';
import { Phone, MessageSquare, CheckCircle2, Clock, MapPin, LifeBuoy, Navigation, Search, UserCheck } from 'lucide-react';

export function TrackingScreen() {
  const { requests, activeRequestId, helpers, navigate, updateRequestStatus } = useApp();

  const request = requests.find((r) => r.id === activeRequestId);
  if (!request) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-ink-500">Замовлення не знайдено</p>
      </div>
    );
  }

  const helper = helpers.find((h) => h.id === request.helperId);
  const statusOrder: string[] = ['searching', 'accepted', 'on_the_way', 'in_progress', 'completed'];
  const currentStep = statusOrder.indexOf(request.status);

  const steps = [
    { label: 'Замовлення опубліковано', icon: Search },
    { label: 'Помічника знайдено', icon: UserCheck },
    { label: 'Помічник вирушив', icon: Navigation },
    { label: 'Допомога виконується', icon: Clock },
    { label: 'Виконано', icon: CheckCircle2 },
  ];

  const statusBanner: Record<string, { title: string; bg: string; iconBg: string; icon: typeof Search }> = {
    searching: { title: 'Шукаємо помічника', bg: 'bg-amber-50', iconBg: 'bg-amber-500', icon: Search },
    accepted: { title: 'Помічника знайдено ✓', bg: 'bg-sage-50', iconBg: 'bg-sage-500', icon: UserCheck },
    on_the_way: { title: `${helper?.name ?? 'Помічник'} вирушив`, bg: 'bg-coral-50', iconBg: 'bg-coral-500', icon: Navigation },
    in_progress: { title: 'Допомога виконується', bg: 'bg-coral-50', iconBg: 'bg-coral-500', icon: Clock },
    completed: { title: 'Виконано', bg: 'bg-sage-50', iconBg: 'bg-sage-500', icon: CheckCircle2 },
  };

  const banner = statusBanner[request.status] ?? statusBanner.searching;
  const BannerIcon = banner.icon;

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Відстеження" backScreen="familyHome" />

      <div className="px-5 max-w-md mx-auto pt-4 space-y-5">
        {/* Status banner */}
        <Card className={`p-5 ${banner.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${banner.iconBg} flex items-center justify-center ${request.status === 'on_the_way' ? 'animate-bounce-soft' : ''}`}>
              <BannerIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-ink-900">{banner.title}</h2>
              {request.status === 'on_the_way' && (
                <p className="text-sm text-ink-600 font-semibold">Орієнтовний прихід: {request.time}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Helper found card */}
        {helper && request.status !== 'searching' && (
          <Card className="p-5 animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={helper.name} size={56} variant={avatarVariantForName(helper.name)} />
              <div className="flex-1">
                <h3 className="font-extrabold text-ink-900">{helper.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <RatingDisplay rating={helper.rating} size={14} />
                  <span className="text-sm text-ink-500 font-semibold">· {helper.completedTasks} виконаних</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-sage-50 text-sage-600">
                <CheckCircle2 className="w-4 h-4" />
                Особу підтверджено
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-cream-100 text-ink-700">
                <CheckCircle2 className="w-4 h-4 text-sage-600" />
                Інструктаж пройдено
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => navigate('messages')}>
                <MessageSquare className="w-5 h-5 mr-2" />
                Написати
              </Button>
              <Button variant="primary">
                <Phone className="w-5 h-5 mr-2" />
                Зателефонувати
              </Button>
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card className="p-5">
          <h3 className="text-lg font-extrabold text-ink-900 mb-4">Етапи</h3>
          <div className="space-y-1">
            {steps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isActive = idx === currentStep;
              const isFuture = idx > currentStep;
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isDone
                          ? 'bg-sage-500 text-white'
                          : isActive
                          ? 'bg-coral-500 text-white animate-pulse-soft'
                          : 'bg-cream-200 text-ink-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-1 h-8 ${isDone ? 'bg-sage-400' : 'bg-cream-200'}`} />
                    )}
                  </div>
                  <div className="pt-2 pb-1">
                    <p className={`font-bold ${isFuture ? 'text-ink-400' : 'text-ink-900'}`}>
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-sm text-coral-500 font-semibold mt-0.5">Зараз</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Task info */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-ink-100">
            <CategoryIcon category={request.category} size={22} />
            <div>
              <h3 className="font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h3>
              <p className="text-sm text-ink-500">{request.description}</p>
            </div>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-ink-600">
              <Clock className="w-4 h-4 text-ink-400" />
              {request.date}, {request.time} · {request.duration}
            </div>
            <div className="flex items-center gap-2 text-ink-600">
              <MapPin className="w-4 h-4 text-ink-400" />
              {request.address}
            </div>
          </div>
        </Card>

        {/* Emergency link */}
        <button
          onClick={() => navigate('trustSafety')}
          className="w-full text-center text-sm font-bold text-ink-500 hover:text-coral-500 transition-colors py-3"
        >
          Потрібна допомога? Зв'яжіться з підтримкою Beside
        </button>

        {/* Demo: advance status */}
        {request.status !== 'completed' && request.status !== 'searching' && (
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              const nextIdx = currentStep + 1;
              if (nextIdx < statusOrder.length) {
                updateRequestStatus(request.id, statusOrder[nextIdx] as typeof request.status);
              }
            }}
          >
            Симулювати наступний етап
          </Button>
        )}

        {request.status === 'completed' && (
          <Button fullWidth onClick={() => navigate('completedTask')}>
            Переглянути завершене замовлення
          </Button>
        )}
      </div>
    </div>
  );
}
