import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';
import { Logo } from '../components/ScreenHeader';
import { ChevronLeft } from 'lucide-react';

export function FamilyRegisterScreen() {
  const { navigate, registerFamily, familyUser } = useApp();
  const [name, setName] = useState(familyUser?.name ?? '');
  const [phone, setPhone] = useState(familyUser?.phone ?? '');
  const [email, setEmail] = useState(familyUser?.email ?? '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Введіть ім\'я';
    if (!phone.trim()) errs.phone = 'Введіть телефон';
    if (!email.trim()) errs.email = 'Введіть email';
    if (password.length < 6) errs.password = 'Пароль має бути від 6 символів';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    registerFamily({
      id: familyUser?.id ?? 'f1',
      name,
      phone,
      email,
      relative: familyUser?.relative ?? {
        id: 'e1',
        name: '',
        age: 0,
        city: '',
        address: '',
        phone: '',
        relationship: 'mother',
      },
    });
    navigate('addRelative');
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate('welcome')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-200 active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-ink-700" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-8 max-w-md mx-auto w-full">
        <div className="mb-6 mt-2">
          <Logo size="md" />
        </div>

        <h1 className="text-2xl font-extrabold text-ink-900 mb-2">
          Створити акаунт
        </h1>
        <p className="text-ink-600 mb-8">
          Заповніть дані, щоб організувати допомогу для вашої родини
        </p>

        <div className="space-y-4">
          <TextField
            label="Ім'я"
            placeholder="Ганна"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <TextField
            label="Телефон"
            placeholder="+380 67 123 45 67"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <TextField
            label="Email"
            placeholder="anna@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <TextField
            label="Пароль"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>

        <Button size="lg" fullWidth className="mt-8" onClick={handleSubmit}>
          Продовжити
        </Button>
      </div>
    </div>
  );
}
