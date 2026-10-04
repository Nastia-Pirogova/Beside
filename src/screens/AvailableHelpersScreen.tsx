import { useState } from 'react';
import { useApp } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar, avatarVariantForName } from '../components/Avatar';
import { RatingDisplay, StarRating } from '../components/Rating';
import { VerifiedBadge } from '../components/Badge';
import { ScreenHeader } from '../components/ScreenHeader';
import type { HelperUser } from '../types';
import { MapPin, Clock, CheckCircle2, GraduationCap, ShieldCheck, Award, SlidersHorizontal, Phone } from 'lucide-react';

type SortBy = 'distance' | 'rating' | 'price';

export function AvailableHelpersScreen() {
  const { helpers, navigate, pendingRequest, chooseHelper, setActiveRequest } = useApp();
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistance, setMaxDistance] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const filtered = helpers
    .filter((h) => (onlyAvailable ? h.available : true))
    .filter((h) => h.distanceKm <= maxDistance)
    .filter((h) => h.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.pricePerTask - b.pricePerTask;
    });

  const handleChoose = (helper: HelperUser) => {
    const reqId = pendingRequest?.id ?? 'r1';
    chooseHelper(helper.id, reqId);
    setActiveRequest(reqId);
    navigate('tracking');
  };

  return (
    <div className="min-h-screen bg-cream-100 pb-24">
      <ScreenHeader
        title="Доступні помічники"
        rightAction={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-200 active:scale-90 transition-all"
          >
            <SlidersHorizontal className="w-5 h-5 text-ink-700" />
          </button>
        }
      />

      <div className="px-5 max-w-md mx-auto pt-4 space-y-4">
        {/* Sort tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {([
            { key: 'distance', label: 'Поруч' },
            { key: 'rating', label: 'За рейтингом' },
            { key: 'price', label: 'За ціною' },
          ] as { key: SortBy; label: string }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                sortBy === tab.key
                  ? 'bg-coral-500 text-white'
                  : 'bg-white text-ink-600 shadow-card'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <Card className="p-5 space-y-4 animate-slide-down">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-ink-700">Відстань</label>
                <span className="text-sm font-bold text-coral-500">до {maxDistance} км</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full accent-coral-500"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-ink-700">Мінімальний рейтинг</label>
                <span className="text-sm font-bold text-coral-500">{minRating > 0 ? `${minRating}+` : 'Будь-який'}</span>
              </div>
              <div className="flex gap-2">
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      minRating === r ? 'bg-coral-500 text-white' : 'bg-cream-100 text-ink-600'
                    }`}
                  >
                    {r === 0 ? 'Будь-який' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className="flex items-center justify-between w-full"
            >
              <span className="text-sm font-bold text-ink-700">Тільки доступні зараз</span>
              <div className={`w-12 h-7 rounded-full transition-colors relative ${onlyAvailable ? 'bg-coral-500' : 'bg-ink-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${onlyAvailable ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
          </Card>
        )}

        <p className="text-sm text-ink-500 font-semibold">{filtered.length} помічників знайдено</p>

        {/* Helper cards */}
        <div className="space-y-4">
          {filtered.map((helper) => (
            <HelperCard key={helper.id} helper={helper} onChoose={() => handleChoose(helper)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HelperCard({ helper, onChoose }: { helper: HelperUser; onChoose: () => void }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <Avatar name={helper.name} size={64} variant={avatarVariantForName(helper.name)} />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold text-ink-900">{helper.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <RatingDisplay rating={helper.rating} size={16} />
            <span className="text-sm text-ink-500 font-semibold">{helper.completedTasks} завдань</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin className="w-4 h-4 text-ink-400" />
            <span className="text-sm text-ink-600 font-semibold">{helper.distanceKm} км від вас</span>
          </div>
        </div>
      </div>

      <p className="text-ink-600 mt-3 text-sm leading-relaxed">{helper.bio}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-sage-50 text-sage-600">
          <ShieldCheck className="w-4 h-4" />
          Перевірений
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-cream-100 text-ink-700">
          <GraduationCap className="w-4 h-4 text-sage-600" />
          Навчання пройдено
        </span>
        {helper.qualifications.map((q) => (
          <span key={q} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-coral-50 text-coral-600">
            <Award className="w-4 h-4" />
            {q}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100">
        <div>
          <p className="text-sm text-ink-500">Вартість</p>
          <p className="text-xl font-extrabold text-ink-900">{helper.pricePerTask} грн</p>
        </div>
        <Button onClick={onChoose} size="md">
          Обрати помічника
        </Button>
      </div>
    </Card>
  );
}
