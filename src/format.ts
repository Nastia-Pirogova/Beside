const MONTHS_UA = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatWhen(date: string, time: string): string {
  if (date === todayIso()) return `Сьогодні, ${time}`;
  if (date === addDaysIso(1)) return `Завтра, ${time}`;
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return `${date}, ${time}`;
  return `${d} ${MONTHS_UA[m - 1]}, ${time}`;
}

export function formatDuration(duration: string): string {
  const cleaned = duration.replace(/^≈\s*/, '').trim();
  if (/приблизно/i.test(cleaned)) return cleaned;
  return `приблизно ${cleaned}`;
}

export function vocativeFirstName(fullName: string): string {
  const first = fullName.split(' ')[0] ?? fullName;
  const map: Record<string, string> = {
    Анна: 'Анно',
    Ганна: 'Ганно',
    Олена: 'Олено',
    Наталія: 'Наталіє',
    Марія: 'Маріє',
    Галина: 'Галино',
    Андрій: 'Андрію',
  };
  return map[first] ?? first;
}

export function firstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}
