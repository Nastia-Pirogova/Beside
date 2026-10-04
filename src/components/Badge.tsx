import { Star, CheckCircle2, ShieldCheck, GraduationCap, Award } from 'lucide-react';

interface BadgeProps {
  icon?: 'verified' | 'trained' | 'rating' | 'qualification';
  children: string;
  className?: string;
}

const iconMap = {
  verified: ShieldCheck,
  trained: GraduationCap,
  rating: Star,
  qualification: Award,
};

const iconColors: Record<string, string> = {
  verified: 'text-sage-600',
  trained: 'text-sage-600',
  rating: 'text-amber-500',
  qualification: 'text-coral-500',
};

export function Badge({ icon, children, className = '' }: BadgeProps) {
  const Icon = icon ? iconMap[icon] : CheckCircle2;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${className}`}
    >
      <Icon className={`w-4 h-4 ${icon ? iconColors[icon] : ''}`} />
      {children}
    </span>
  );
}

export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-sage-50 text-sage-600 ${className}`}
    >
      <ShieldCheck className="w-4 h-4" />
      Перевірений помічник
    </span>
  );
}
