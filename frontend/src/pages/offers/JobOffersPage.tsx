import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useJobOffersStore } from '../../store/jobOffersStore';
import { JobOfferCard } from '../../components/features/JobOfferCard';
import { EmptyState } from '../../components/layout/EmptyState';
import { FiltersPanel } from '../../components/features/FiltersPanel';
import { SearchBar } from '../../components/features/SearchBar';
import { Link } from 'react-router-dom';
import { SearchFilters } from '../../types';
import { PlusCircle, Briefcase } from 'lucide-react';

export const JobOffersPage: React.FC = () => {
  const { jobOffers, isLoading, getAllJobOffers } = useJobOffersStore();
  const [filteredOffers, setFilteredOffers] = useState(jobOffers);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllJobOffers();
  }, [getAllJobOffers]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = jobOffers.filter((offer) => {
        const titleAndCompany = `${offer.title} ${offer.company}`.toLowerCase();
        const requirements = offer.requirements.join(' ').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return (
          titleAndCompany.includes(query) ||
          offer.location.toLowerCase().includes(query) ||
          requirements.includes(query) ||
          offer.description.toLowerCase().includes(query)
        );
      });
      setFilteredOffers(filtered);
    } else {
      setFilteredOffers(jobOffers);
    }
  }, [jobOffers, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: SearchFilters) => {
    let filtered = jobOffers;

    if (filters.location) {
      filtered = filtered.filter((offer) =>
        offer.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((offer) =>
        filters.skills!.some((skill) =>
          offer.requirements.some((requirement) =>
            requirement.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.experience) {
      filtered = filtered.filter((offer) =>
        offer.experienceRequired.toLowerCase().includes(filters.experience!.toLowerCase())
      );
    }

    if (filters.status && filters.status.length > 0) {
      // For job offers, we'd need to adapt this since offer status is different
      // Let's assume we can convert between application status and offer status
      const statusMap: Record<string, string> = {
        pending: 'draft',
        in_progress: 'open',
        accepted: 'open',
        rejected: 'closed',
      };
      
      const offerStatuses = filters.status.map((status) => statusMap[status] || status);
      
      filtered = filtered.filter((offer) =>
        offerStatuses.includes(offer.status)
      );
    }

    setFilteredOffers(filtered);
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
        title="Offres d'emploi"
        description="Gérez vos offres d'emploi"
        actions={
          <Link to="/offers/new">
            <Button leftIcon={<PlusCircle className="h-4 w-4" />}>
              Nouvelle offre
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher par titre, entreprise ou compétence..."
          />
        </div>

        <FiltersPanel onApplyFilters={handleApplyFilters} />
      </div>

      {filteredOffers.length === 0 ? (
        <EmptyState
          title="Aucune offre trouvée"
          description="Commencez par créer une nouvelle offre d'emploi."
          icon={<Briefcase className="h-12 w-12" />}
          action={
            <Link to="/offers/new">
              <Button>Créer une offre</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <JobOfferCard key={offer.id} jobOffer={offer} />
          ))}
        </div>
      )}
    </>
  );
};