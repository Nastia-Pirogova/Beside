import { useApp } from '../store';
import { Button } from '../components/Button';
import { Logo } from '../components/ScreenHeader';
import { WelcomeIllustration } from '../components/WelcomeIllustration';
import { ShieldCheck, Heart, MapPin } from 'lucide-react';

export function WelcomeScreen() {
  const { navigate, setRole } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 to-cream-50 flex flex-col">
      <div className="flex-1 px-6 pt-12 pb-8 flex flex-col max-w-md mx-auto w-full">
        <div className="mb-8 animate-fade-in">
          <Logo size="lg" />
        </div>

        <div className="flex-1 flex flex-col justify-center -mt-4">
          <div className="animate-slide-up">
            <WelcomeIllustration className="w-full max-w-sm mx-auto" />
          </div>

          <h1 className="text-3xl font-extrabold text-ink-900 text-center mt-2 animate-slide-up">
            Допомога завжди поруч
          </h1>
          <p className="text-lg text-ink-600 text-center mt-3 leading-relaxed animate-slide-up">
            Створіть замовлення — і перевірені помічники поруч самі запропонують свою допомогу для ваших рідних.
          </p>

          <div className="flex items-center justify-center gap-5 mt-5 text-sm font-semibold text-ink-600 animate-fade-in">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-sage-500" />
              Перевірено
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="w-5 h-5 text-coral-500" />
              з турботою
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-coral-400" />
              поруч
            </span>
          </div>
        </div>

        <div className="space-y-3 mt-8 animate-slide-up">
          <Button size="lg" fullWidth onClick={() => { setRole('family'); navigate('familyRegister'); }}>
            Знайти допомогу
          </Button>
          <Button size="lg" fullWidth variant="outline" onClick={() => { setRole('helper'); navigate('helperOnboarding'); }}>
            Стати помічником
          </Button>
          <Button size="lg" fullWidth variant="ghost" onClick={() => { setRole('family'); navigate('familyHome'); }}>
            Увійти
          </Button>
        </div>

        <p className="text-center text-sm text-ink-400 mt-6">
          Продовжуючи, ви погоджуєтесь з умовами використання
        </p>
      </div>
    </div>
  );
}
