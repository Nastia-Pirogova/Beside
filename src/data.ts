import type { Category, ServiceType, Relationship } from './types';

export const CATEGORY_LABELS: Record<string, string> = {
  grocery: 'Купити продукти',
  pharmacy: 'Забрати ліки',
  household: 'Допомогти по дому',
  walk: 'Сходити на прогулянку',
  companionship: 'Скласти компанію',
  documents: 'Допомогти з документами',
  transport: 'Супроводити кудись',
  cooking: 'Приготувати їжу',
  delivery: 'Доставка',
  other: 'Інше',
  care: 'Професійний догляд',
  medical: 'Медичні процедури',
  rehab: 'Реабілітаційна допомога',
};

export const CATEGORY_SERVICE_TYPE: Record<Category, ServiceType> = {
  grocery: 'basic',
  pharmacy: 'basic',
  household: 'basic',
  walk: 'basic',
  companionship: 'basic',
  documents: 'basic',
  transport: 'basic',
  cooking: 'basic',
  delivery: 'basic',
  other: 'basic',
  care: 'specialized',
  medical: 'specialized',
  rehab: 'specialized',
};

export const BASIC_CATEGORIES: Category[] = [
  'grocery', 'pharmacy', 'household', 'walk', 'companionship',
  'documents', 'transport', 'cooking', 'delivery', 'other',
];

export const SPECIALIZED_CATEGORIES: Category[] = ['care', 'medical', 'rehab'];

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  mother: 'Мама',
  father: 'Тато',
  grandmother: 'Бабуся',
  grandfather: 'Дідусь',
  other: 'Інший родич',
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  open: 'Шукаємо помічника',
  accepted: 'Помічника знайдено',
  on_the_way: 'Помічник вирушив',
  in_progress: 'Допомога виконується',
  completed: 'Виконано',
  cancelled: 'Скасовано',
};
