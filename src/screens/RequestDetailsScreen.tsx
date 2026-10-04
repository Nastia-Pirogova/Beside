import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import type { HelpRequest } from '../types';
import { MapPin, Clock, Wallet, User, ListChecks, ChevronLeft, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export function RequestDetailsScreen() {
  const { availableRequests, activeRequestId, acceptRequest, navigate, helperUser } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const request = availableRequests.find((r) => r.id === activeRequestId);

  if (!request) {
    return (
      <div className="min-h-screen bg-cream-100 pb-24">
        <ScreenHeader title="Замовлення" showBack={false} />
        <div className="px-5 max-w-md mx-auto pt-8">
          <div className="text-center py-12">
            <p className="text-ink-500 font-semibold">Замовлення вже недоступне</p>
            <Button fullWidth className="mt-4" onClick={() => navigate('helperHome')}>
              Повернутись до замовлень
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const canAccept = request.serviceType !== 'specialized' || (helperUser?.qualified ?? false);

  const handleAccept = () => {
    acceptRequest(request.id);
    setAccepted(true);
    setShowConfirm(false);
    setTimeout(() => navigate('helperActiveTask'), 500);
  };

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Деталі замовлення" backScreen="helperHome" />

      <div className="px-5 max-w-md mx-auto pt-4 space-y-4">
        {/* Category header */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <CategoryIcon category={request.category} size={28} />
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h2>
              <p className="text-sm text-ink-500">{request.elderlyName}, {request.elderlyAge} років</p>
            </div>
            {request.serviceType === 'specialized' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600">
                Потрібна кваліфікація
              </span>
            )}
          </div>
        </Card>

        {/* Description */}
        <Card className="p-5">
          <h3 className="font-extrabold text-ink-900 mb-2">Опис</h3>
          <p className="text-ink-600 leading-relaxed">{request.description}</p>
        </Card>

        {/* Shopping list */}
        {request.shoppingList && request.shoppingList.length > 0 && (
          <Card className="p-5">
            <h3 className="font-extrabold text-ink-900 mb-3 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-coral-500" />
              Список покупок
            </h3>
            <ul className="space-y-2">
              {request.shoppingList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-ink-700">
                  <span className="w-5 h-5 rounded-full border-2 border-ink-200 flex items-center justify-center text-xs font-bold text-ink-400">
                    {idx + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Details */}
        <Card className="p-5 space-y-3">
          <DetailRow icon={<User className="w-5 h-5 text-ink-400" />} label="Кому" value={`${request.elderlyName}, ${request.elderlyAge} років`} />
          <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-ink-600">
              <Clock className="w-5 h-5 text-ink-400" />
              Коли
            </span>
            <span className="font-bold text-ink-800">{request.date}, {request.time}</span>
          </div>
          <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-ink-600">
              <MapPin className="w-5 h-5 text-ink-400" />
              Адреса
            </span>
            <span className="font-bold text-ink-800 text-right">{request.approximateArea}</span>
          </div>
          <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-ink-600">
              <Clock className="w-5 h-5 text-ink-400" />
              Тривалість
            </span>
            <span className="font-bold text-ink-800">≈ {request.duration}</span>
          </div>
          <div className="border-t border-ink-100 pt-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-ink-600">
              <Wallet className="w-5 h-5 text-ink-400" />
              Оплата
            </span>
            <span className="font-extrabold text-coral-500 text-lg">{request.reward} грн</span>
          </div>
        </Card>

        {/* Privacy note */}
        <div className="flex items-start gap-3 px-2">
          <ShieldCheck className="w-5 h-5 text-sage-600 mt-0.5 shrink-0" />
          <p className="text-sm text-ink-500">
            Точну адресу ви побачите після прийняття замовлення.
          </p>
        </div>

        {/* Accept button */}
        {accepted ? (
          <Card className="p-5 text-center bg-sage-50 animate-slide-up">
            <CheckCircle2 className="w-10 h-10 text-sage-600 mx-auto mb-2" />
            <p className="font-extrabold text-sage-600 text-lg">Замовлення прийнято!</p>
          </Card>
        ) : (
          <>
            <Button size="lg" fullWidth onClick={() => canAccept ? setShowConfirm(true) : undefined} disabled={!canAccept}>
              Взяти замовлення
            </Button>
            {!canAccept && (
              <p className="text-center text-sm text-purple-500 font-semibold">
                Для цього замовлення потрібна підтверджена кваліфікація
              </p>
            )}
            <Button variant="ghost" fullWidth onClick={() => navigate('helperHome')}>
              Назад до замовлень
            </Button>
          </>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 animate-fade-in" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-coral-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-coral-500" />
            </div>
            <h3 className="text-xl font-extrabold text-ink-900 text-center mb-2">
              Взяти це замовлення?
            </h3>
            <p className="text-ink-600 text-center mb-6 leading-relaxed">
              Після підтвердження замовлення буде закріплене за вами, а замовник отримає ваш профіль.
            </p>
            <div className="space-y-3">
              <Button size="lg" fullWidth onClick={handleAccept}>
                Так, взяти
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setShowConfirm(false)}>
                Скасувати
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-600">{icon}{label}</span>
      <span className="font-bold text-ink-800 text-right">{value}</span>
    </div>
  );
}
