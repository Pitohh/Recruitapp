import React from 'react';
import { Select, SelectOption } from '../ui/Select';
import { ApplicationStatus } from '../../types';

interface ApplicationStatusSelectProps {
  value: ApplicationStatus;
  onChange: (value: ApplicationStatus) => void;
  disabled?: boolean;
  className?: string;
}

export const ApplicationStatusSelect: React.FC<ApplicationStatusSelectProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const statusOptions: SelectOption[] = [
    { label: 'En attente', value: 'pending' },
    { label: 'En cours', value: 'in_progress' },
    { label: 'Accepté', value: 'accepted' },
    { label: 'Refusé', value: 'rejected' },
  ];

  return (
    <Select
      options={statusOptions}
      value={value}
      onChange={(newValue) => onChange(newValue as ApplicationStatus)}
      disabled={disabled}
      className={className}
      label="Statut"
    />
  );
};