import { useApp } from '../store';
import { Card } from '../components/Card';
import { ScreenHeader } from '../components/ScreenHeader';
import { Button } from '../components/Button';
import {
  ShieldCheck,
  Phone,
  Star,
  GraduationCap,
  LifeBuoy,
  History,
  Heart,
  MessageCircle,
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Перевірка особи',
    desc: 'Кожен помічник проходить перевірку документів, що підтверджують особу, перш ніж отримати доступ до заявок.',
    color: 'bg-sage-50 text-sage-600',
  },
  {
    icon: Phone,
    title: 'Верифікація телефону',
    desc: 'Телефон помічника підтверджується через SMS-код, щоб забезпечити реальний контакт.',
    color: 'bg-coral-50 text-coral-600',
  },
  {
    icon: Star,
    title: 'Відгуки та рейтинги',
    desc: 'Після кожного завдання родина залишає відгук. Рейтинг помічника видно всім.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: GraduationCap,
    title: 'Навчання безпеки',
    desc: 'Помічники проходять короткий курс безпеки та етики роботи з літніми людьми.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: LifeBuoy,
    title: 'Служба підтримки',
    desc: 'Наша команда доступна щодня з 8:00 до 22:00 для допомоги в будь-якій ситуації.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: History,
    title: 'Прозора історія',
    desc: 'Ви бачите повну історію завдань, відгуків та активність помічника.',
    color: 'bg-indigo-50 text-indigo-600',
  },
];

export function TrustSafetyScreen() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Безпека та довіра" />
      <div className="px-5 max-w-md mx-auto pt-4 space-y-5">
        {/* Hero */}
        <Card className="p-6 bg-gradient-to-br from-sage-50 to-cream-50 text-center">
          <div className="w-20 h-20 rounded-3xl bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-sage-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-900">Кожен помічник перевірений</h1>
          <p className="text-ink-600 mt-2 leading-relaxed">
            Безпека ваших рідних — наш пріоритет. Ми створили систему перевірки, яка гарантує надійність кожного помічника на платформі Beside.
          </p>
        </Card>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className="p-4 animate-slide-up" >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-ink-900">{feature.title}</h3>
                    <p className="text-sm text-ink-600 mt-1 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Support contact */}
        <Card className="p-5 bg-coral-50 border border-coral-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-coral-500 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-ink-900">Потрібна допомога?</h3>
              <p className="text-sm text-ink-600">Ми поруч 24/7</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button variant="primary" fullWidth onClick={() => navigate('messages')}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Написати в чат підтримки
            </Button>
            <Button variant="outline" fullWidth>
              <Phone className="w-5 h-5 mr-2" />
              0 800 501 234
            </Button>
          </div>
        </Card>

        {/* Promise */}
        <Card className="p-5 text-center">
          <Heart className="w-8 h-8 text-coral-500 fill-coral-500 mx-auto mb-2" />
          <p className="text-ink-700 font-bold leading-relaxed">
            «Beside — це не просто сервіс. Це спільнота людей, які піклуються одне про одного.»
          </p>
        </Card>
      </div>
    </div>
  );
}
