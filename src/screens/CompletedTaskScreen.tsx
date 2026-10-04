import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { RatingDisplay, StarRating } from '../components/Rating';
import { ScreenHeader } from '../components/ScreenHeader';
import { CategoryIcon } from '../components/CategoryIcon';
import { CATEGORY_LABELS } from '../data';
import { TextAreaField } from '../components/TextField';
import { Clock, MapPin, Wallet, Heart } from 'lucide-react';

export function CompletedTaskScreen() {
  const { requests, activeRequestId, helpers, reviews, addReview, navigate, updateRequestStatus } = useApp();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const request = requests.find((r) => r.id === activeRequestId);
  if (!request) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-ink-500">Замовлення не знайдено</p>
      </div>
    );
  }

  const helper = helpers.find((h) => h.id === request.helperId);
  const existingReview = reviews.find((r) => r.requestId === request.id);

  const handleSubmit = () => {
    if (rating === 0 || !helper) return;
    addReview({
      id: `rv${Date.now()}`,
      requestId: request.id,
      rating,
      comment,
      authorName: 'Ганна',
      createdAt: new Date().toISOString().split('T')[0],
    });
    updateRequestStatus(request.id, 'reviewed');
    setSubmitted(true);
  };

  if (submitted || existingReview) {
    return (
      <div className="min-h-screen bg-cream-100 pb-24">
        <ScreenHeader title="Завершено" showBack={false} />
        <div className="px-5 max-w-md mx-auto pt-8">
          <Card className="p-8 text-center animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-sage-600 fill-sage-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-ink-900 mb-2">Дякуємо за відгук!</h2>
            <p className="text-ink-600">Ваш відгук допоможе іншим родинам знайти надійного помічника.</p>
            <Button fullWidth className="mt-6" onClick={() => navigate('familyHome')}>
              На головну
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader title="Завершено" backScreen="familyHome" />
      <div className="px-5 max-w-md mx-auto pt-4 space-y-5">
        {/* Completion banner */}
        <div className="text-center py-4 animate-slide-up">
          <h1 className="text-3xl font-extrabold text-ink-900">Допомогу виконано 💛</h1>
        </div>

        {/* Task summary */}
        <Card className="p-5">
          {helper && (
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={helper.name} size={56} variant={avatarVariantForName(helper.name)} />
              <div>
                <h3 className="font-extrabold text-ink-900">{helper.name}</h3>
                <RatingDisplay rating={helper.rating} size={14} />
              </div>
            </div>
          )}
          <div className="border-t border-ink-100 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <CategoryIcon category={request.category} size={20} />
              <div>
                <p className="text-sm text-ink-500">Завдання</p>
                <span className="font-bold text-ink-800">{CATEGORY_LABELS[request.category]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <Clock className="w-4 h-4 text-ink-400" />
              Тривалість: {request.duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <MapPin className="w-4 h-4 text-ink-400" />
              {request.address}
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-600">
              <Wallet className="w-4 h-4 text-ink-400" />
              Оплата: <span className="font-extrabold text-ink-900">{request.reward} грн</span>
            </div>
          </div>
        </Card>

        {request.helperNote && (
          <Card className="p-4 bg-cream-50">
            <p className="text-sm font-bold text-ink-700 mb-1">Примітка помічника</p>
            <p className="text-sm text-ink-600">{request.helperNote}</p>
          </Card>
        )}

        {/* Review form */}
        <Card className="p-5">
          <h3 className="text-lg font-extrabold text-ink-900 text-center mb-4">
            Як усе пройшло?
          </h3>
          <div className="flex justify-center mb-6">
            <StarRating value={rating} onChange={setRating} size={44} />
          </div>
          <TextAreaField
            label="Залишити відгук"
            placeholder="Розкажіть про ваш досвід роботи з помічником..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button size="lg" fullWidth className="mt-5" onClick={handleSubmit} disabled={rating === 0}>
            Надіслати
          </Button>
        </Card>
      </div>
    </div>
  );
}
