interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
  variant?: 'warm' | 'sage' | 'cream' | 'coral' | 'blue' | 'rose';
}

const variants: Record<string, string> = {
  warm: 'from-coral-300 to-coral-500',
  sage: 'from-sage-300 to-sage-500',
  cream: 'from-cream-200 to-cream-300',
  coral: 'from-coral-400 to-coral-600',
  blue: 'from-sky-300 to-sky-500',
  rose: 'from-rose-300 to-rose-500',
};

const variantColors: Record<string, string> = {
  warm: 'text-white',
  sage: 'text-white',
  cream: 'text-ink-700',
  coral: 'text-white',
  blue: 'text-white',
  rose: 'text-white',
};

export function Avatar({ name, size = 48, className = '', variant = 'warm' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${variants[variant]} ${variantColors[variant]} flex items-center justify-center font-bold shrink-0 shadow-sm ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

export function avatarVariantForName(name: string): AvatarProps['variant'] {
  const hash = name.charCodeAt(0) % 6;
  const keys: AvatarProps['variant'][] = ['warm', 'sage', 'coral', 'blue', 'rose', 'cream'];
  return keys[hash];
}
