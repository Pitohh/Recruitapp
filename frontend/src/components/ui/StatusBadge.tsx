import React from 'react';
import { Badge } from './Badge';
import { getStatusColor, getStatusLabel } from '../../utils/formatters';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const colorClass = getStatusColor(status);
  const label = getStatusLabel(status);

  return <Badge className={colorClass}>{label}</Badge>;
};