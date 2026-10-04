import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { TextField, SelectField } from '../components/TextField';
import { ScreenHeader } from '../components/ScreenHeader';
import { RELATIONSHIP_LABELS } from '../data';
import type { Relationship } from '../types';

export function AddRelativeScreen() {
  const { navigate, registerFamily, familyUser } = useApp();
  const [name, setName] = useState(familyUser?.relative.name ?? '');
  const [age, setAge] = useState(familyUser?.relative.age ? String(familyUser.relative.age) : '');
  const [city, setCity] = useState(familyUser?.relative.city ?? '');
  const [address, setAddress] = useState(familyUser?.relative.address ?? '');
  const [phone, setPhone] = useState(familyUser?.relative.phone ?? '');
  const [relationship, setRelationship] = useState<Relationship>(familyUser?.relative.relationship ?? 'mother');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Введіть ім\'я';
    if (!age.trim()) errs.age = 'Введіть вік';
    if (!city.trim()) errs.city = 'Введіть місто';
    if (!address.trim()) errs.address = 'Введіть адресу';
    if (!phone.trim()) errs.phone = 'Введіть телефон';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (familyUser) {
      registerFamily({
        ...familyUser,
        relative: {
          id: familyUser.relative.id,
          name,
          age: parseInt(age),
          city,
          address,
          phone,
          relationship,
        },
      });
    }
    navigate('familyHome');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <ScreenHeader title="Кому потрібна допомога?" />
      <div className="px-6 pb-8 max-w-md mx-auto w-full pt-4">
        <p className="text-ink-600 mb-6">
          Розкажіть про вашу літню родину. Це допоможе нам знайти найкращого помічника поруч.
        </p>

        <div className="space-y-4">
          <TextField
            label="Ім'я літньої людини"
            placeholder="Марія"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <TextField
            label="Вік"
            placeholder="74"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            error={errors.age}
          />
          <TextField
            label="Місто"
            placeholder="Суми"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={errors.city}
          />
          <TextField
            label="Адреса / орієнтир"
            placeholder="вул. Троїцька, 15, кв. 23"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={errors.address}
          />
          <TextField
            label="Телефон літньої людини"
            placeholder="+380 50 987 65 43"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <SelectField
            label="Ступінь спорідненості"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value as Relationship)}
            options={[
              { value: 'mother', label: RELATIONSHIP_LABELS.mother },
              { value: 'father', label: RELATIONSHIP_LABELS.father },
              { value: 'grandmother', label: RELATIONSHIP_LABELS.grandmother },
              { value: 'grandfather', label: RELATIONSHIP_LABELS.grandfather },
              { value: 'other', label: RELATIONSHIP_LABELS.other },
            ]}
          />
        </div>

        <Button size="lg" fullWidth className="mt-8" onClick={handleSubmit}>
          Продовжити
        </Button>
      </div>
    </div>
  );
}
