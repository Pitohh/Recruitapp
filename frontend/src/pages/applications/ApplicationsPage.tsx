import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useApplicationsStore } from '../../store/applicationsStore';
import { Table, TableHeader, TableBody, TableRow, TableHead } from '../../components/ui/Table';
import { ApplicationRow } from '../../components/features/ApplicationRow';
import { EmptyState } from '../../components/layout/EmptyState';
import { FiltersPanel } from '../../components/features/FiltersPanel';
import { SearchBar } from '../../components/features/SearchBar';
import { Link } from 'react-router-dom';
import { SearchFilters } from '../../types';
import { FileText, PlusCircle } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, isLoading, getAllApplications } = useApplicationsStore();
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllApplications();
  }, [getAllApplications]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = applications.filter((application) => {
        // In a real app, we would check the nested candidate and offer objects
        const candidateName = application.candidate 
          ? `${application.candidate.firstName} ${application.candidate.lastName}`.toLowerCase()
          : '';
        const offerTitle = application.offer ? application.offer.title.toLowerCase() : '';
        const query = searchQuery.toLowerCase();
        
        return (
          candidateName.includes(query) ||
          offerTitle.includes(query)
        );
      });
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [applications, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: SearchFilters) => {
    let filtered = applications;

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((application) =>
        filters.status!.includes(application.status)
      );
    }

    if (filters.location) {
      filtered = filtered.filter((application) =>
        application.offer?.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((application) =>
        application.candidate?.skills.some((skill) =>
          filters.skills!.some((filterSkill) =>
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        )
      );
    }

    if (filters.date?.from) {
      const fromDate = new Date(filters.date.from);
      filtered = filtered.filter((application) => {
        const appDate = new Date(application.createdAt);
        return appDate >= fromDate;
      });
    }

    if (filters.date?.to) {
      const toDate = new Date(filters.date.to);
      filtered = filtered.filter((application) => {
        const appDate = new Date(application.createdAt);
        return appDate <= toDate;
      });
    }

    setFilteredApplications(filtered);
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
        title="Candidatures"
        description="Gérez toutes les candidatures"
        actions={
          <Link to="/applications/new">
            <Button leftIcon={<PlusCircle className="h-4 w-4" />}>
              Nouvelle candidature
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher par candidat ou offre..."
          />
        </div>

        <FiltersPanel onApplyFilters={handleApplyFilters} />
      </div>

      {filteredApplications.length === 0 ? (
        <EmptyState
          title="Aucune candidature trouvée"
          description="Commencez par ajouter des candidatures."
          icon={<FileText className="h-12 w-12" />}
          action={
            <Link to="/applications/new">
              <Button>Ajouter une candidature</Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
              {filteredApplications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};