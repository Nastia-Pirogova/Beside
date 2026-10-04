import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<string, string> = {
  primary:
    'bg-coral-500 text-white hover:bg-coral-600 active:bg-coral-700 shadow-sm hover:shadow-floating',
  secondary:
    'bg-cream-200 text-ink-800 hover:bg-cream-300 active:bg-cream-300',
  ghost:
    'text-ink-700 hover:bg-cream-200 active:bg-cream-300',
  outline:
    'border-2 border-ink-200 text-ink-800 hover:border-coral-400 hover:text-coral-600 bg-transparent',
  danger:
    'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200',
};

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-5 py-3 text-base rounded-2xl',
  lg: 'px-6 py-4 text-lg rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-bold transition-all duration-200 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none ${
        variants[variant]
      } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
