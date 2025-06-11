import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 bg-white rounded-lg border border-gray-200',
        className
      )}
    >
      {icon && <div className="mx-auto mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-md">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};