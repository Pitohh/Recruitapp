import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { useCandidatesStore } from '../../store/candidatesStore';
import { useApplicationsStore } from '../../store/applicationsStore';
import { Candidate, Application } from '../../types';
import { fetchCandidate } from '../../services/candidatesService';
import { fetchApplicationsByCandidate } from '../../services/applicationsService';
import { 
  ArrowLeft, Mail, Phone, FileText, Edit, 
  Trash, UserPlus, Calendar, BookOpen, Award
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const CandidateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidates } = useCandidatesStore();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCandidate = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // First try to find the candidate in the store
        const foundCandidate = candidates.find((c) => c.id === id);
        
        if (foundCandidate) {
          setCandidate(foundCandidate);
        } else {
          // If not found, fetch from API
          const fetchedCandidate = await fetchCandidate(id);
          setCandidate(fetchedCandidate);
        }
        
        // Fetch candidate applications
        const candidateApplications = await fetchApplicationsByCandidate(id);
        setApplications(candidateApplications);
      } catch (error) {
        console.error('Failed to load candidate:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidate();
  }, [id, candidates]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Candidat non trouvé</h2>
        <p className="mt-2 text-gray-600">Le candidat que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button
          className="mt-6"
          onClick={() => navigate('/candidates')}
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
        title={`${candidate.firstName} ${candidate.lastName}`}
        description="Profil du candidat"
        actions={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate('/candidates')}
            >
              Retour
            </Button>
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => navigate(`/candidates/${id}/edit`)}
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
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar size="xl" alt={`${candidate.firstName} ${candidate.lastName}`} />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p className="text-gray-600">{candidate.experience}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{candidate.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{candidate.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">Ajouté le {formatDate(candidate.createdAt)}</span>
                </div>
                
                {candidate.cvPath && (
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={candidate.cvPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Télécharger le CV
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Compétences</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
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
                
                <Link to={`/applications/new?candidateId=${candidate.id}`}>
                  <Button leftIcon={<UserPlus className="h-4 w-4" />}>
                    Ajouter candidature
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 text-gray-500 mr-2" />
                Expérience professionnelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{candidate.experience}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>{candidate.education}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidatures</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">Aucune candidature enregistrée pour ce candidat.</p>
                  <Link to={`/applications/new?candidateId=${candidate.id}`} className="mt-4 inline-block">
                    <Button size="sm">Ajouter une candidature</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Offre</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="font-medium">{application.offer?.title}</div>
                          <div className="text-sm text-gray-500">{application.offer?.company}</div>
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