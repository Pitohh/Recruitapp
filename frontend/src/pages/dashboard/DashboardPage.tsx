import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { useApplicationsStore } from '../../store/applicationsStore';
import { useJobOffersStore } from '../../store/jobOffersStore';
import { useCandidatesStore } from '../../store/candidatesStore';
import { fetchDashboardStats } from '../../services/dashboardService';
import { DashboardStats } from '../../types';
import { StatCard } from '../../components/features/StatCard';
import { ApplicationRow } from '../../components/features/ApplicationRow';
import { 
  Users, Briefcase, FileText, PieChart,
  Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { SearchBar } from '../../components/features/SearchBar';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { applications, getAllApplications } = useApplicationsStore();
  const { getAllJobOffers } = useJobOffersStore();
  const { getAllCandidates } = useCandidatesStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [statsData] = await Promise.all([
          fetchDashboardStats(),
          getAllApplications(),
          getAllJobOffers(),
          getAllCandidates(),
        ]);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getAllApplications, getAllJobOffers, getAllCandidates]);

  const recentApplications = applications.slice(0, 5);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search functionality
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de recrutement"
      />
      
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Rechercher un candidat, une offre ou une compétence..."
          className="max-w-2xl mx-auto"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Candidats"
          value={stats?.totalCandidates || 0}
          icon={<Users className="h-6 w-6" />}
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Offres d'emploi"
          value={stats?.totalOffers || 0}
          icon={<Briefcase className="h-6 w-6" />}
          change={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Candidatures"
          value={stats?.totalApplications || 0}
          icon={<FileText className="h-6 w-6" />}
          change={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Taux de conversion"
          value="24%"
          icon={<PieChart className="h-6 w-6" />}
          change={{ value: 3, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Candidatures récentes</CardTitle>
              <Link to="/applications">
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidat</TableHead>
                  <TableHead>Offre</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statuts des candidatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-warning-500 mr-2" />
                  <span className="font-medium">En attente</span>
                </div>
                <span className="text-lg font-semibold">
                  {stats?.applicationsByStatus.pending || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-primary-500 mr-2" />
                  <span className="font-medium">En cours</span>
                </div>
                <span className="text-lg font-semibold">
                  {stats?.applicationsByStatus.in_progress || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                  <span className="font-medium">Acceptées</span>
                </div>
                <span className="text-lg font-semibold">
                  {stats?.applicationsByStatus.accepted || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-error-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-error-500 mr-2" />
                  <span className="font-medium">Refusées</span>
                </div>
                <span className="text-lg font-semibold">
                  {stats?.applicationsByStatus.rejected || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Actions rapides</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/candidates/new">
              <Button variant="outline" fullWidth leftIcon={<Users className="h-4 w-4" />}>
                Ajouter un candidat
              </Button>
            </Link>
            <Link to="/offers/new">
              <Button variant="outline" fullWidth leftIcon={<Briefcase className="h-4 w-4" />}>
                Créer une offre d'emploi
              </Button>
            </Link>
            <Link to="/applications/new">
              <Button variant="outline" fullWidth leftIcon={<FileText className="h-4 w-4" />}>
                Enregistrer une candidature
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouvelle candidature pour Développeur React
                  </p>
                  <p className="text-sm text-gray-500">
                    Il y a 2 heures
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Entretien programmé avec Martin Dupont
                  </p>
                  <p className="text-sm text-gray-500">
                    Il y a 5 heures
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nouvelle offre publiée : Chef de Projet IT
                  </p>
                  <p className="text-sm text-gray-500">
                    Hier
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Candidature acceptée pour Sophie Martin
                  </p>
                  <p className="text-sm text-gray-500">
                    Hier
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};