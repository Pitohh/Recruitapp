import React from 'react';
import { Card } from '../ui/Card';
import { Candidate } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Mail, Phone, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface CandidateCardProps {
  candidate: Candidate;
  className?: string;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, className }) => {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar 
          size="lg" 
          alt={`${candidate.firstName} ${candidate.lastName}`}
        />
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {candidate.firstName} {candidate.lastName}
          </h3>
          <p className="text-sm text-gray-500">{candidate.experience}</p>
        </div>
      </div>
      
      <div className="mb-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2 text-gray-400" />
          <span>{candidate.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2 text-gray-400" />
          <span>{candidate.phone}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Compétences</p>
        <div className="flex flex-wrap gap-1">
          {candidate.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-auto flex flex-col space-y-2">
        {candidate.cvPath && (
          <a
            href={candidate.cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-sm text-primary-600 hover:text-primary-700"
          >
            <FileText className="h-4 w-4 mr-1" />
            Voir le CV
          </a>
        )}
        <Link to={`/candidates/${candidate.id}`}>
          <Button variant="outline" fullWidth>
            Voir le profil
          </Button>
        </Link>
      </div>
    </Card>
  );
};