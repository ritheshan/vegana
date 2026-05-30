import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, leftIcon, rightIcon, disabled, ...props }, ref) => {
    
    // Core structural styles
    const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] outline-none disabled:opacity-50 disabled:pointer-events-none disabled:scale-100 cursor-pointer';
    
    // Size variants
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base',
    };

    // Color/Visual variants
    const variantStyles = {
      primary: 'bg-primary text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-300 shadow-sm border border-slate-900',
      secondary: 'bg-slate-100 text-primary hover:bg-slate-200 focus:ring-2 focus:ring-slate-200 border border-slate-200',
      accent: 'bg-accent text-white hover:bg-teal-600 focus:ring-2 focus:ring-teal-200 shadow-sm',
      outline: 'bg-white text-primary border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-100',
      ghost: 'bg-transparent text-primary hover:bg-slate-50 focus:ring-2 focus:ring-slate-100',
      danger: 'bg-danger text-white hover:bg-red-600 focus:ring-2 focus:ring-red-200 shadow-sm',
    };

    const combinedClass = `${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClass}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
