import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { FilterIcon, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { SearchFilters, ApplicationStatus } from '../../types';
import { Select, SelectOption } from '../ui/Select';
import { Input } from '../ui/Input';

interface FiltersPanelProps {
  onApplyFilters: (filters: SearchFilters) => void;
  className?: string;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onApplyFilters, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const statusOptions: SelectOption[] = [
    { label: 'En attente', value: 'pending' },
    { label: 'En cours', value: 'in_progress' },
    { label: 'Accepté', value: 'accepted' },
    { label: 'Refusé', value: 'rejected' },
  ];
  
  const experienceOptions: SelectOption[] = [
    { label: 'Débutant', value: 'junior' },
    { label: 'Intermédiaire', value: 'mid' },
    { label: 'Sénior', value: 'senior' },
    { label: 'Expert', value: 'expert' },
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (statusValue: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(statusValue as ApplicationStatus)
      ? currentStatuses.filter((s) => s !== statusValue)
      : [...currentStatuses, statusValue as ApplicationStatus];
    
    handleFilterChange('status', newStatuses);
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onApplyFilters({});
  };

  return (
    <div className={className}>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          leftIcon={<FilterIcon className="h-4 w-4" />}
          onClick={() => setIsOpen(!isOpen)}
        >
          Filtres
        </Button>
      </div>

      {isOpen && (
        <Card className="mb-6 animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtres</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Lieu"
              placeholder="Paris, Lyon, etc."
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
              <Input
                placeholder="React, Java, etc."
                value={filters.skills?.join(', ') || ''}
                onChange={(e) => handleFilterChange('skills', e.target.value.split(',').map(s => s.trim()))}
              />
            </div>
            
            <Select
              label="Expérience"
              placeholder="Sélectionner le niveau"
              options={experienceOptions}
              value={filters.experience || ''}
              onChange={(value) => handleFilterChange('experience', value)}
            />
            
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.status?.includes(option.value as ApplicationStatus)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={clearFilters}>
              Réinitialiser
            </Button>
            <Button onClick={applyFilters}>
              Appliquer les filtres
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};