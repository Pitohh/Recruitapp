import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd MMMM yyyy', { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  } catch (error) {
    return 'Date invalide';
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Format phone number for French format (XX XX XX XX XX)
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length !== 10) return phoneNumber;
  
  return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-warning-100 text-warning-800';
    case 'in_progress':
      return 'bg-primary-100 text-primary-800';
    case 'accepted':
      return 'bg-success-100 text-success-800';
    case 'rejected':
      return 'bg-error-100 text-error-800';
    case 'open':
      return 'bg-success-100 text-success-800';
    case 'closed':
      return 'bg-gray-100 text-gray-800';
    case 'draft':
      return 'bg-secondary-100 text-secondary-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'in_progress':
      return 'En cours';
    case 'accepted':
      return 'Accepté';
    case 'rejected':
      return 'Refusé';
    case 'open':
      return 'Ouvert';
    case 'closed':
      return 'Fermé';
    case 'draft':
      return 'Brouillon';
    default:
      return status;
  }
};