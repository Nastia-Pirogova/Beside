import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TextField, TextAreaField } from '../components/TextField';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS, BASIC_CATEGORIES, SPECIALIZED_CATEGORIES, CATEGORY_SERVICE_TYPE } from '../data';
import type { Category, HelpRequest } from '../types';
import { Camera, ChevronRight, ChevronLeft, Check, Wallet, ShieldCheck } from 'lucide-react';

export function CreateRequestScreen() {
  const { navigate, familyUser, publishRequest, setSelectedCategory } = useApp();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState(familyUser?.relative.address ?? '');
  const [duration, setDuration] = useState('');
  const [reward, setReward] = useState('250');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleStep2Next = () => {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Опишіть завдання';
    if (!date) errs.date = 'Оберіть дату';
    if (!time) errs.time = 'Оберіть час';
    if (!address.trim()) errs.address = 'Введіть адресу';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep(3);
  };

  const handleStep3Next = () => {
    const errs: Record<string, string> = {};
    if (!reward || parseInt(reward) < 50) errs.reward = 'Вкажіть суму від 50 грн';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setStep(4);
  };

  const handlePublish = () => {
    if (!category || !familyUser) return;
    const newRequest: HelpRequest = {
      id: `r${Date.now()}`,
      category,
      description,
      date,
      time,
      address,
      approximateArea: address.split(',').slice(0, 2).join(','),
      duration: duration || '1 год',
      reward: parseInt(reward) || 250,
      elderlyName: familyUser.relative.name,
      elderlyAge: familyUser.relative.age,
      elderlyCity: familyUser.relative.city,
      distanceKm: 1.2,
      status: 'searching',
      serviceType: CATEGORY_SERVICE_TYPE[category],
      createdAt: new Date().toISOString(),
    };
    publishRequest(newRequest);
    navigate('published');
  };

  const stepTitles = ['Яка допомога потрібна?', 'Опишіть завдання', 'Вартість', 'Перевірте замовлення'];

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title={stepTitles[step - 1]} backScreen="familyHome" />

      {/* Progress indicator */}
      <div className="px-5 pt-4 max-w-md mx-auto">
        <div className="flex items-center gap-1.5 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${s <= step ? 'bg-coral-500 flex-1' : 'bg-ink-200 flex-1'}`}
            />
          ))}
        </div>
        <p className="text-sm font-bold text-ink-500 mb-4">Крок {step} з 4</p>
      </div>

      <div className="px-5 max-w-md mx-auto">
        {/* Step 1: Category */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h3 className="text-sm font-bold text-ink-500 mb-3">Побутова допомога</h3>
              <div className="grid grid-cols-2 gap-3">
                {BASIC_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all active:scale-95 border-2 border-transparent shadow-card hover:shadow-cardHover"
                  >
                    <CategoryIcon category={cat} size={26} />
                    <span className="text-sm font-bold text-ink-700 text-center">{CATEGORY_LABELS[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-500 mb-3">Спеціалізована допомога</h3>
              <div className="grid grid-cols-1 gap-3">
                {SPECIALIZED_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-95 border-2 border-transparent shadow-card hover:shadow-cardHover"
                  >
                    <CategoryIcon category={cat} size={26} />
                    <div className="flex-1 text-left">
                      <span className="text-sm font-bold text-ink-700">{CATEGORY_LABELS[cat]}</span>
                      <span className="block text-xs text-purple-500 font-semibold mt-0.5">Потрібна кваліфікація</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <Card className="p-5 space-y-4">
              {category && (
                <div className="flex items-center gap-3 pb-3 border-b border-ink-100">
                  <CategoryIcon category={category} size={22} />
                  <span className="font-bold text-ink-900">{CATEGORY_LABELS[category]}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-ink-700 mb-1.5">Кому потрібна допомога</label>
                <div className="px-4 py-3.5 bg-cream-50 rounded-2xl text-ink-700 font-semibold">
                  {familyUser?.relative.name}, {familyUser?.relative.age} років
                </div>
              </div>

              <TextAreaField
                label="Опис"
                placeholder="Наприклад: купити продукти за списком та принести їх бабусі додому."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
              />

              <TextField
                label="Адреса"
                placeholder="вул. Троїцька, 15, кв. 23"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
              />

              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Дата"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  error={errors.date}
                />
                <TextField
                  label="Час"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  error={errors.time}
                />
              </div>

              <TextField
                label="Орієнтовна тривалість"
                placeholder="1 год"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                hint="Наприклад: 30 хв, 1 год, 2 год"
              />

              <div>
                <label className="block text-sm font-bold text-ink-700 mb-1.5">
                  Додати фото або список (необов'язково)
                </label>
                <button className="w-full px-4 py-6 border-2 border-dashed border-ink-200 rounded-2xl flex flex-col items-center gap-2 text-ink-500 hover:border-coral-400 hover:text-coral-500 transition-colors">
                  <Camera className="w-7 h-7" />
                  <span className="text-sm font-semibold">Додати фото</span>
                </button>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft className="w-5 h-5 mr-1" />
                Назад
              </Button>
              <Button fullWidth onClick={handleStep2Next}>
                Далі
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-ink-100">
                <div className="w-12 h-12 rounded-2xl bg-coral-50 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-coral-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-ink-900">Оплата помічнику</h3>
                  <p className="text-sm text-ink-500">Ви пропонуєте суму за завдання</p>
                </div>
              </div>

              <TextField
                label="Сума оплати"
                placeholder="250"
                type="number"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                error={errors.reward}
              />
              <div className="flex gap-2">
                {[150, 200, 250, 300, 400].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setReward(String(amt))}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      reward === String(amt) ? 'bg-coral-500 text-white' : 'bg-cream-100 text-ink-600'
                    }`}
                  >
                    {amt} грн
                  </button>
                ))}
              </div>

              <div className="bg-cream-50 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sage-600 mt-0.5 shrink-0" />
                <p className="text-sm text-ink-600">
                  Помічник побачить цю суму перед тим, як прийняти замовлення.
                </p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)}>
                <ChevronLeft className="w-5 h-5 mr-1" />
                Назад
              </Button>
              <Button fullWidth onClick={handleStep3Next}>
                Далі
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div className="space-y-4 animate-slide-up">
            <Card className="p-5 space-y-4">
              <h3 className="text-lg font-extrabold text-ink-900">Перевірте замовлення</h3>

              {category && (
                <div className="flex items-center gap-3 pb-3 border-b border-ink-100">
                  <CategoryIcon category={category} size={24} />
                  <span className="font-bold text-ink-900 text-lg">{CATEGORY_LABELS[category]}</span>
                  {CATEGORY_SERVICE_TYPE[category] === 'specialized' && (
                    <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600">
                      Потрібна кваліфікація
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <PreviewRow label="Кому" value={`${familyUser?.relative.name ?? ''}, ${familyUser?.relative.age ?? ''} років`} />
                <PreviewRow label="Опис" value={description} />
                <PreviewRow label="Адреса" value={address} />
                <PreviewRow label="Дата" value={date} />
                <PreviewRow label="Час" value={time} />
                <PreviewRow label="Тривалість" value={duration || '1 год'} />
                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <span className="text-ink-500 font-semibold">Оплата помічнику</span>
                  <span className="text-xl font-extrabold text-coral-500">{reward} грн</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(3)}>
                <ChevronLeft className="w-5 h-5 mr-1" />
                Назад
              </Button>
              <Button fullWidth onClick={handlePublish}>
                <Check className="w-5 h-5 mr-1" />
                Опублікувати замовлення
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-500 font-semibold shrink-0">{label}</span>
      <span className="text-ink-900 font-bold text-right">{value}</span>
    </div>
  );
}
