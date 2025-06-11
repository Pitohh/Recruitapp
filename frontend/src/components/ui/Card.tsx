import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) => {
  const variantClasses = {
    default: 'bg-white shadow-card',
    outline: 'bg-white border border-gray-200',
    ghost: 'bg-transparent',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        variantClasses[variant],
        paddingClasses[padding],
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

export const CardHeader = ({ className, withBorder = false, children, ...props }: CardHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 pb-4',
        withBorder && 'border-b border-gray-200 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)} {...props} />;
};

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cn('text-sm text-gray-500', className)} {...props} />;
};

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('', className)} {...props} />;
};

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('flex items-center pt-4 border-t border-gray-200 mt-4', className)}
      {...props}
    />
  );
};