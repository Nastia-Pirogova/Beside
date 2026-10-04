import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-card ${hover ? 'hover:shadow-cardHover transition-shadow duration-200 cursor-pointer' : ''} ${
        onClick && !hover ? 'cursor-pointer transition-shadow hover:shadow-cardHover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
