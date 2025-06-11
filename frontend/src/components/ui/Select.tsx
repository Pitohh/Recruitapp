import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  id?: string;
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Select = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Sélectionner une option',
  error,
  className,
  fullWidth = false,
  disabled = false,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn('flex flex-col space-y-1.5', fullWidth ? 'w-full' : '', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              className={cn(
                'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-error-300 focus:border-error-500 focus:ring-error-500'
              )}
              onClick={() => setOpen(!open)}
            >
              <span className={cn('block truncate', !selectedOption && 'text-gray-400')}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </Listbox.Button>
            
            <Listbox.Options
              className={cn(
                'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg',
                'ring-1 ring-black ring-opacity-5 focus:outline-none'
              )}
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-pointer select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                    )
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}>
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        )}
      </Listbox>
      {error && <p className="text-sm text-error-500">{error}</p>}
    </div>
  );
};