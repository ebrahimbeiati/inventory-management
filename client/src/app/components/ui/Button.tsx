import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-md transition-colors duration-200';
  
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
    outlined: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const muiVariant: 'contained' | 'outlined' =
    variant === 'outlined' || variant === 'ghost' ? 'outlined' : 'contained';
  const muiColor = variant === 'danger' ? 'error' : 'primary';

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 