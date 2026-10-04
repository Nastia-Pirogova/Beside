import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { TextField, SelectField } from '../components/TextField';
import { Logo } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import type { Category } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Phone,
  GraduationCap,
  User,
  CheckCircle2,
  Camera,
  Upload,
  X,
} from 'lucide-react';

const allServices: Category[] = ['grocery', 'pharmacy', 'household', 'food', 'walk', 'documents', 'transport', 'other'];

export function HelperOnboardingScreen() {
  const { navigate, onboardingStep, setOnboardingStep, registerHelper, helperUser } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [selectedServices, setSelectedServices] = useState<Category[]>([]);

  const steps = [
    { title: 'Особисті дані', icon: User },
    { title: 'Перевірка особи', icon: ShieldCheck },
    { title: 'Підтвердження телефону', icon: Phone },
    { title: 'Навчання безпеки', icon: GraduationCap },
    { title: 'Послуги', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      if (helperUser) {
        registerHelper({
          ...helperUser,
          name: name || helperUser.name,
          phone: phone || helperUser.phone,
          email: email || helperUser.email,
          specialties: selectedServices.length > 0 ? selectedServices : helperUser.specialties,
        });
      }
      navigate('helperHome');
    }
  };

  const toggleService = (cat: Category) => {
    setSelectedServices((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center justify-between max-w-md mx-auto w-full">
        <button
          onClick={() => (onboardingStep > 0 ? setOnboardingStep(onboardingStep - 1) : navigate('welcome'))}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-200 active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-ink-700" />
        </button>
        <Logo size="sm" />
        <div className="w-10" />
      </div>

      {/* Progress */}
      <div className="px-6 pt-6 max-w-md mx-auto w-full">
        <div className="flex items-center gap-1.5 mb-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx <= onboardingStep ? 'bg-coral-500 flex-1' : 'bg-ink-200 flex-1'
              }`}
            />
          ))}
        </div>
        <p className="text-sm font-bold text-ink-500">
          Крок {onboardingStep + 1} з {steps.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-2">{steps[onboardingStep].title}</h1>

        {onboardingStep === 0 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-ink-600 mb-4">Розкажіть про себе, щоб родини могли вам довіряти.</p>
            <TextField label="Ім'я та прізвище" placeholder="Олена Коваленко" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Телефон" placeholder="+380 67 555 11 22" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Email" placeholder="olena@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}

        {onboardingStep === 1 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-ink-600 mb-4">Завантажте фото документів для перевірки особи. Це займе кілька хвилин.</p>
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-ink-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ink-800">Паспорт або ID-карта</p>
                  <p className="text-sm text-ink-500">Фото обох сторін</p>
                </div>
              </div>
              <button className="w-full py-6 border-2 border-dashed border-ink-200 rounded-2xl flex flex-col items-center gap-2 text-ink-500 hover:border-coral-400 hover:text-coral-500 transition-colors">
                <Camera className="w-7 h-7" />
                <span className="text-sm font-semibold">Зробити фото або завантажити</span>
              </button>
            </Card>
            <Card className="p-4 bg-sage-50">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sage-600 mt-0.5 shrink-0" />
                <p className="text-sm text-ink-600">
                  Ваші документи надійно захищені та використовуються лише для перевірки особи.
                </p>
              </div>
            </Card>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-ink-600 mb-4">Ми надіслали код підтвердження на ваш телефон.</p>
            <div className="flex gap-3 justify-center">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newCode = [...code];
                    newCode[idx] = e.target.value;
                    setCode(newCode);
                  }}
                  className="w-14 h-14 text-center text-2xl font-extrabold bg-cream-50 border-2 border-ink-200 rounded-2xl outline-none focus:border-coral-400 transition-colors"
                />
              ))}
            </div>
            <p className="text-center text-sm text-ink-500">
              Не отримали код? <span className="text-coral-500 font-bold cursor-pointer">Надіслати знову</span>
            </p>
          </div>
        )}

        {onboardingStep === 3 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-ink-600 mb-4">Пройдіть короткий курс безпеки. Це займе близько 10 хвилин.</p>
            {[
              'Як спілкуватися з літніми людьми',
              'Правила безпеки під час візиту',
              'Що робити в екстреній ситуації',
              'Етика та конфіденційність',
            ].map((topic, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${idx < 2 ? 'bg-sage-100 text-sage-600' : 'bg-cream-100 text-ink-400'}`}>
                    {idx < 2 ? <CheckCircle2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-ink-800 text-sm">{topic}</p>
                    <p className="text-xs text-ink-500">{idx < 2 ? 'Пройдено' : 'Не пройдено'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {onboardingStep === 4 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-ink-600 mb-4">Оберіть послуги, які ви можете надати.</p>
            <div className="grid grid-cols-2 gap-3">
              {allServices.map((cat) => {
                const isSelected = selectedServices.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleService(cat)}
                    className={`bg-white rounded-2xl p-4 flex flex-col items-center gap-2.5 transition-all active:scale-95 border-2 ${
                      isSelected ? 'border-coral-400 shadow-cardHover' : 'border-transparent shadow-card'
                    }`}
                  >
                    <CategoryIcon category={cat} size={24} />
                    <span className={`text-sm font-bold text-center ${isSelected ? 'text-coral-500' : 'text-ink-700'}`}>
                      {CATEGORY_LABELS[cat]}
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-coral-500 absolute top-2 right-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 max-w-md mx-auto w-full">
        <Button size="lg" fullWidth onClick={handleNext}>
          {onboardingStep < 4 ? 'Продовжити' : 'Завершити реєстрацію'}
        </Button>
      </div>
    </div>
  );
}
