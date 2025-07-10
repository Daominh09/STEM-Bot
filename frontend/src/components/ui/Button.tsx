import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const base = 'p-2 rounded-full';
  const styles =
    variant === 'primary'
      ? 'bg-green-600 hover:bg-green-700 text-white'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};
