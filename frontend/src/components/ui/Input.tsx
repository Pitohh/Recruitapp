import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = false, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col space-y-1.5', fullWidth ? 'w-full' : '')}>
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && <div className="absolute left-3 flex items-center pointer-events-none">{leftIcon}</div>}
          <input
            ref={ref}
            className={cn(
              'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-error-300 focus:border-error-500 focus:ring-error-500',
              className
            )}
            {...props}
          />
          {rightIcon && <div className="absolute right-3 flex items-center">{rightIcon}</div>}
        </div>
        {error && <p className="text-sm text-error-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';