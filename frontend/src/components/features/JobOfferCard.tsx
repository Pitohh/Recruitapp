import React from 'react';
import { Card } from '../ui/Card';
import { JobOffer } from '../../types';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { formatDate } from '../../utils/formatters';

interface JobOfferCardProps {
  jobOffer: JobOffer;
  className?: string;
}

export const JobOfferCard: React.FC<JobOfferCardProps> = ({ jobOffer, className }) => {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{jobOffer.title}</h3>
          <StatusBadge status={jobOffer.status} />
        </div>
        <p className="text-sm text-gray-600 mt-1">{jobOffer.company}</p>
      </div>
      
      <div className="mb-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{jobOffer.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
          <span>{jobOffer.contract}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>Ajouté le {formatDate(jobOffer.createdAt)}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Compétences requises</p>
        <div className="flex flex-wrap gap-1">
          {jobOffer.requirements.slice(0, 3).map((requirement, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
            >
              {requirement}
            </span>
          ))}
          {jobOffer.requirements.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              +{jobOffer.requirements.length - 3}
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <Link to={`/offers/${jobOffer.id}`}>
          <Button variant="outline" fullWidth>
            Voir l'offre
          </Button>
        </Link>
      </div>
    </Card>
  );
};