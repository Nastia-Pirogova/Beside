import {
  ShoppingCart,
  Pill,
  Home,
  Footprints,
  Heart,
  FileText,
  Car,
  ChefHat,
  Package,
  MoreHorizontal,
  Stethoscope,
  Syringe,
  Activity,
} from 'lucide-react';
import type { Category } from '../types';

const categoryIcons: Record<Category, typeof ShoppingCart> = {
  grocery: ShoppingCart,
  pharmacy: Pill,
  household: Home,
  walk: Footprints,
  companionship: Heart,
  documents: FileText,
  transport: Car,
  cooking: ChefHat,
  delivery: Package,
  other: MoreHorizontal,
  care: Stethoscope,
  medical: Syringe,
  rehab: Activity,
};

const categoryColors: Record<Category, { bg: string; icon: string }> = {
  grocery: { bg: 'bg-coral-50', icon: 'text-coral-500' },
  pharmacy: { bg: 'bg-sage-50', icon: 'text-sage-500' },
  household: { bg: 'bg-amber-50', icon: 'text-amber-600' },
  walk: { bg: 'bg-sky-50', icon: 'text-sky-500' },
  companionship: { bg: 'bg-rose-50', icon: 'text-rose-500' },
  documents: { bg: 'bg-indigo-50', icon: 'text-indigo-500' },
  transport: { bg: 'bg-blue-50', icon: 'text-blue-500' },
  cooking: { bg: 'bg-orange-50', icon: 'text-orange-500' },
  delivery: { bg: 'bg-teal-50', icon: 'text-teal-500' },
  other: { bg: 'bg-cream-200', icon: 'text-ink-600' },
  care: { bg: 'bg-purple-50', icon: 'text-purple-500' },
  medical: { bg: 'bg-red-50', icon: 'text-red-500' },
  rehab: { bg: 'bg-green-50', icon: 'text-green-600' },
};

interface CategoryIconProps {
  category: Category;
  size?: number;
  className?: string;
}

export function CategoryIcon({ category, size = 28, className = '' }: CategoryIconProps) {
  const Icon = categoryIcons[category];
  const colors = categoryColors[category];
  return (
    <div
      className={`${colors.bg} ${colors.icon} rounded-2xl flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      <Icon style={{ width: size, height: size }} strokeWidth={2} />
    </div>
  );
}

export function getCategoryIcon(category: Category) {
  return categoryIcons[category];
}

export function getCategoryColor(category: Category) {
  return categoryColors[category];
}
