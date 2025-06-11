import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
}) => {
  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        {icon && <div className="p-2 bg-primary-50 rounded-md text-primary-600">{icon}</div>}
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span
            className={cn(
              'text-sm font-medium',
              change.isPositive ? 'text-success-600' : 'text-error-600'
            )}
          >
            {change.isPositive ? '+' : '-'}{Math.abs(change.value)}%
          </span>
          <span className="ml-2 text-xs text-gray-500">depuis le mois dernier</span>
        </div>
      )}
    </Card>
  );
};