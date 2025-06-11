import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useJobOffersStore } from '../../store/jobOffersStore';
import { JobOffer, Application } from '../../types';
import { fetchJobOffer } from '../../services/jobOffersService';
import { fetchApplicationsByJobOffer } from '../../services/applicationsService';
import { 
  ArrowLeft, MapPin, Briefcase, Clock, Edit, 
  Trash, UserPlus, Calendar, DollarSign, Building
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

export const JobOfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobOffers } = useJobOffersStore();
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobOffer = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // First try to find the job offer in the store
        const foundJobOffer = jobOffers.find((o) => o.id === id);
        
        if (foundJobOffer) {
          setJobOffer(foundJobOffer);
        } else {
          // If not found, fetch from API
          const fetchedJobOffer = await fetchJobOffer(id);
          setJobOffer(fetchedJobOffer);
        }
        
        // Fetch applications for this job offer
        const offerApplications = await fetchApplicationsByJobOffer(id);
        setApplications(offerApplications);
      } catch (error) {
        console.error('Failed to load job offer:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobOffer();
  }, [id, jobOffers]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!jobOffer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Offre non trouvée</h2>
        <p className="mt-2 text-gray-600">L'offre que vous recherchez n'existe pas ou a été supprimée.</p>
        <Button
          className="mt-6"
          onClick={() => navigate('/offers')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={jobOffer.title}
        description={jobOffer.company}
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/offers')}
            >
              Retour
            </Button>
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => navigate(`/offers/${id}/edit`)}
            >
              Modifier
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {jobOffer.title}
                </h3>
                <StatusBadge status={jobOffer.status} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{jobOffer.company}</span>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{jobOffer.location}</span>
                </div>
                
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{jobOffer.contract}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{jobOffer.experienceRequired}</span>
                </div>
                
                {jobOffer.salary && (
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{jobOffer.salary}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Publié le {formatDate(jobOffer.createdAt)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Compétences requises</h4>
                <div className="flex flex-wrap gap-2">
                  {jobOffer.requirements.map((requirement, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button
                  variant="outline"
                  className="text-error-600 border-error-200 hover:bg-error-50"
                  leftIcon={<Trash className="h-4 w-4" />}
                >
                  Supprimer
                </Button>
                
                <Link to={`/applications/new?offerId=${jobOffer.id}`}>
                  <Button leftIcon={<UserPlus className="h-4 w-4" />}>
                    Ajouter candidat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description du poste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{jobOffer.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidatures ({applications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Aucune candidature enregistrée pour cette offre.</p>
                  <Link to={`/applications/new?offerId=${jobOffer.id}`} className="mt-4 inline-block">
                    <Button size="sm">Ajouter une candidature</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">
                            {application.candidate?.firstName} {application.candidate?.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(application.createdAt)}</TableCell>
                        <TableCell>
                          <StatusBadge status={application.status} />
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/applications/${application.id}`}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            Voir détails
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};