import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import { Search, Clock, MapPin, Wallet, Edit2, X, PartyPopper } from 'lucide-react';

export function PublishedScreen() {
  const { requests, activeRequestId, navigate, cancelRequest } = useApp();
  const request = requests.find((r) => r.id === activeRequestId);

  if (!request) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-ink-500">Замовлення не знайдено</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Замовлення опубліковано" backScreen="familyHome" />

      <div className="px-5 max-w-md mx-auto pt-4 space-y-5">
        {/* Success banner */}
        <Card className="p-6 text-center animate-slide-up bg-gradient-to-br from-coral-50 to-cream-50">
          <div className="w-16 h-16 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-coral-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-ink-900 mb-2">
            Замовлення опубліковано 🎉
          </h2>
          <p className="text-ink-600 leading-relaxed">
            Ми покажемо його доступним помічникам поблизу. Ви отримаєте сповіщення, коли хтось прийме замовлення.
          </p>
        </Card>

        {/* Searching status */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Search className="w-6 h-6 text-amber-600 animate-pulse-soft" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink-900 text-lg">Шукаємо помічника</h3>
              <p className="text-sm text-ink-500">Замовлення доступне поблизу</p>
            </div>
          </div>

          {/* Animated dots */}
          <div className="flex items-center gap-1.5 py-2">
            <div className="w-2 h-2 rounded-full bg-coral-400 animate-bounce-soft" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-coral-400 animate-bounce-soft" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-coral-400 animate-bounce-soft" style={{ animationDelay: '300ms' }} />
          </div>
        </Card>

        {/* Order details */}
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-ink-100">
            <CategoryIcon category={request.category} size={24} />
            <h3 className="font-extrabold text-ink-900 text-lg">{CATEGORY_LABELS[request.category]}</h3>
          </div>
          <div className="space-y-3">
            <DetailRow icon={<MapPin className="w-4 h-4 text-ink-400" />} label="Адреса" value={request.address} />
            <DetailRow icon={<Clock className="w-4 h-4 text-ink-400" />} label="Дата та час" value={`${request.date}, ${request.time}`} />
            <DetailRow icon={<Clock className="w-4 h-4 text-ink-400" />} label="Тривалість" value={request.duration} />
            <div className="flex items-center justify-between pt-3 border-t border-ink-100">
              <span className="flex items-center gap-2 text-ink-600">
                <Wallet className="w-4 h-4 text-ink-400" />
                Оплата
              </span>
              <span className="font-extrabold text-coral-500 text-lg">{request.reward} грн</span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="outline" fullWidth onClick={() => navigate('createRequest')}>
            <Edit2 className="w-5 h-5 mr-2" />
            Редагувати
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onClick={() => {
              cancelRequest(request.id);
              navigate('familyHome');
            }}
            className="text-red-500 hover:bg-red-50"
          >
            <X className="w-5 h-5 mr-2" />
            Скасувати замовлення
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-600">
        {icon}
        {label}
      </span>
      <span className="font-bold text-ink-800 text-right">{value}</span>
    </div>
  );
}
