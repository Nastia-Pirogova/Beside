import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { TextAreaField } from '../components/TextField';
import { CATEGORY_LABELS } from '../data';
import {
  Navigation,
  Play,
  CheckCircle2,
  Camera,
  FileText,
  MapPin,
  Clock,
  Wallet,
  Phone,
  MessageSquare,
  LifeBuoy,
} from 'lucide-react';

type TaskStep = 'accepted' | 'on_the_way' | 'in_progress' | 'completed';

export function HelperActiveTaskScreen() {
  const { helperActiveRequests, activeRequestId, navigate, updateHelperRequestStatus } = useApp();
  const [step, setStep] = useState<TaskStep>('accepted');
  const [note, setNote] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  const request = helperActiveRequests.find((r) => r.id === activeRequestId);

  if (!request) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-ink-500">Немає активного замовлення</p>
      </div>
    );
  }

  const handleOnTheWay = () => {
    setStep('in_progress');
    updateHelperRequestStatus(request.id, 'on_the_way');
  };

  const handleStart = () => {
    setStep('completed');
    updateHelperRequestStatus(request.id, 'in_progress');
  };

  const handleComplete = () => {
    updateHelperRequestStatus(request.id, 'completed');
    setShowCompletion(true);
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-cream-100 pb-24">
        <ScreenHeader title="Завершено" showBack={false} />
        <div className="px-5 max-w-md mx-auto pt-8">
          <Card className="p-8 text-center animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-sage-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-2">Замовлення завершено!</h2>
            <p className="text-ink-600">Дякуємо за вашу допомогу. Замовник отримав повідомлення.</p>
            <div className="bg-cream-50 rounded-2xl p-4 mt-5 text-left">
              <p className="text-sm text-ink-500">Зароблено</p>
              <p className="text-2xl font-extrabold text-coral-500">{request.reward} грн</p>
            </div>
            <Button fullWidth className="mt-6" onClick={() => navigate('helperHome')}>
              Повернутись до замовлень
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Я вирушаю', icon: Navigation, done: step !== 'accepted' },
    { num: 2, label: 'Розпочати', icon: Play, done: step === 'completed' },
    { num: 3, label: 'Завершити', icon: CheckCircle2, done: false },
  ];

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Моє замовлення" backScreen="helperHome" />
      <div className="px-5 max-w-md mx-auto pt-4 space-y-4">
        {/* Task header */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <CategoryIcon category={request.category} size={26} />
            <div>
              <h2 className="font-extrabold text-ink-900">{CATEGORY_LABELS[request.category]}</h2>
              <p className="text-sm text-ink-500">{request.elderlyName}, {request.elderlyAge} років</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-ink-100 text-sm">
            <p className="flex items-center gap-2 text-ink-600">
              <MapPin className="w-4 h-4 text-ink-400" />
              {request.address}
            </p>
            <p className="flex items-center gap-2 text-ink-600">
              <Clock className="w-4 h-4 text-ink-400" />
              {request.time} · {request.duration}
            </p>
            <p className="flex items-center gap-2 text-ink-600">
              <Wallet className="w-4 h-4 text-ink-400" />
              <span className="font-extrabold text-ink-900">{request.reward} грн</span>
            </p>
          </div>
        </Card>

        {/* Step indicator */}
        <Card className="p-5">
          <h3 className="font-extrabold text-ink-900 mb-4">Етапи</h3>
          <div className="space-y-1">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isCurrent = !s.done && (idx === 0 || steps[idx - 1].done);
              return (
                <div key={s.num} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        s.done
                          ? 'bg-sage-500 text-white'
                          : isCurrent
                          ? 'bg-coral-500 text-white animate-pulse-soft'
                          : 'bg-cream-200 text-ink-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-1 h-8 ${s.done ? 'bg-sage-400' : 'bg-cream-200'}`} />
                    )}
                  </div>
                  <p className={`font-bold pt-2 pb-3 ${s.done ? 'text-ink-900' : isCurrent ? 'text-coral-500' : 'text-ink-400'}`}>
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action buttons */}
        <div className="space-y-3">
          {step === 'accepted' && (
            <Button size="lg" fullWidth onClick={handleOnTheWay}>
              <Navigation className="w-5 h-5 mr-2" />
              Я вирушаю
            </Button>
          )}
          {step === 'in_progress' && (
            <Button size="lg" fullWidth onClick={handleStart}>
              <Play className="w-5 h-5 mr-2" />
              Розпочати
            </Button>
          )}
          {step === 'completed' && (
            <>
              <Card className="p-5 space-y-4 animate-slide-up">
                <h3 className="font-extrabold text-ink-900">Завершення замовлення</h3>
                <TextAreaField
                  label="Короткий коментар"
                  placeholder="Купив усі продукти за списком. Бабуся почувається добре."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-6 border-2 border-dashed border-ink-200 rounded-2xl flex flex-col items-center gap-2 text-ink-500 hover:border-coral-400 hover:text-coral-500 transition-colors">
                    <Camera className="w-7 h-7" />
                    <span className="text-xs font-semibold">Фото підтвердження</span>
                  </button>
                  <button className="py-6 border-2 border-dashed border-ink-200 rounded-2xl flex flex-col items-center gap-2 text-ink-500 hover:border-coral-400 hover:text-coral-500 transition-colors">
                    <FileText className="w-7 h-7" />
                    <span className="text-xs font-semibold">Фото чека</span>
                  </button>
                </div>
              </Card>
              <Button size="lg" fullWidth onClick={handleComplete}>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Завершити замовлення
              </Button>
            </>
          )}
        </div>

        {/* Contact */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary">
              <Phone className="w-5 h-5 mr-2" />
              Зателефонувати
            </Button>
            <Button variant="secondary" onClick={() => navigate('helperMessages')}>
              <MessageSquare className="w-5 h-5 mr-2" />
              Написати
            </Button>
          </div>
        </Card>

        <button
          onClick={() => navigate('trustSafety')}
          className="w-full text-center text-sm font-bold text-ink-500 hover:text-coral-500 transition-colors py-2"
        >
          Потрібна допомога? Зв'яжіться з підтримкою Beside
        </button>
      </div>
    </div>
  );
}
