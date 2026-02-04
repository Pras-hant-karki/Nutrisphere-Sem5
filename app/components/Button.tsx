import React, { ButtonHTMLAttributes } from 'react';
import { theme } from '@/lib/theme';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Variant styles
    const variantStyles = {
      primary: `bg-[${theme.colors.primary.gold}] hover:bg-[${theme.colors.primary.goldHover}] text-black`,
      secondary: `bg-transparent border-2 border-[${theme.colors.primary.gold}] text-[${theme.colors.primary.gold}] hover:bg-[${theme.colors.primary.gold}] hover:text-black`,
      success: `bg-[${theme.colors.status.success}] hover:bg-[${theme.colors.status.successHover}] text-white`,
      danger: `bg-[${theme.colors.status.error}] hover:bg-red-600 text-white`,
      info: `bg-[${theme.colors.status.info}] hover:bg-[${theme.colors.status.infoHover}] text-white`,
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-8 py-2.5 text-sm',
      lg: 'px-10 py-3 text-base',
    };

    const baseStyles = 'font-semibold rounded-full transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed';
    const widthStyle = fullWidth ? 'w-full' : '';
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
