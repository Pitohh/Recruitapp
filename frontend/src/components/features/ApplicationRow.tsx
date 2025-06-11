import React, { useState } from 'react';
import { Application } from '../../types';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../ui/StatusBadge';
import { useApplicationsStore } from '../../store/applicationsStore';
import { Link } from 'react-router-dom';
import { TableRow, TableCell } from '../ui/Table';
import { ApplicationStatusSelect } from './ApplicationStatusSelect';
import { FileText, ExternalLink } from 'lucide-react';

interface ApplicationRowProps {
  application: Application;
}

export const ApplicationRow: React.FC<ApplicationRowProps> = ({ application }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateApplicationStatus } = useApplicationsStore();
  
  const handleStatusChange = async (newStatus: Application['status']) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Link
          to={`/candidates/${application.candidateId}`}
          className="font-medium text-primary-600 hover:text-primary-800"
        >
          {application.candidate?.firstName} {application.candidate?.lastName}
        </Link>
      </TableCell>
      <TableCell>
        <Link
          to={`/offers/${application.offerId}`}
          className="font-medium text-gray-900 hover:text-primary-600"
        >
          {application.offer?.title}
        </Link>
        <p className="text-xs text-gray-500">{application.offer?.company}</p>
      </TableCell>
      <TableCell>{formatDate(application.createdAt)}</TableCell>
      <TableCell>
        <ApplicationStatusSelect
          value={application.status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="min-w-[140px]"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          {application.candidate?.cvPath && (
            <a
              href={application.candidate.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600"
              title="Voir le CV"
            >
              <FileText className="h-5 w-5" />
            </a>
          )}
          <Link
            to={`/applications/${application.id}`}
            className="text-gray-500 hover:text-primary-600"
            title="Voir les détails"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};