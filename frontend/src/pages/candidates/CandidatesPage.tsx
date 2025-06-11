import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { useCandidatesStore } from '../../store/candidatesStore';
import { CandidateCard } from '../../components/features/CandidateCard';
import { EmptyState } from '../../components/layout/EmptyState';
import { FiltersPanel } from '../../components/features/FiltersPanel';
import { SearchBar } from '../../components/features/SearchBar';
import { Link } from 'react-router-dom';
import { SearchFilters } from '../../types';
import { UserPlus, Users } from 'lucide-react';

export const CandidatesPage: React.FC = () => {
  const { candidates, isLoading, getAllCandidates } = useCandidatesStore();
  const [filteredCandidates, setFilteredCandidates] = useState(candidates);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllCandidates();
  }, [getAllCandidates]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = candidates.filter((candidate) => {
        const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
        const skills = candidate.skills.join(' ').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return (
          fullName.includes(query) ||
          candidate.email.toLowerCase().includes(query) ||
          skills.includes(query)
        );
      });
      setFilteredCandidates(filtered);
    } else {
      setFilteredCandidates(candidates);
    }
  }, [candidates, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: SearchFilters) => {
    let filtered = candidates;

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((candidate) =>
        filters.skills!.some((skill) =>
          candidate.skills.some((candidateSkill) =>
            candidateSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.location) {
      // This would work if we had location data in the candidate model
      // For now, we'll leave it as is
    }

    if (filters.experience) {
      filtered = filtered.filter((candidate) =>
        candidate.experience.toLowerCase().includes(filters.experience!.toLowerCase())
      );
    }

    setFilteredCandidates(filtered);
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
        title="Candidats"
        description="Gérez vos candidats et leurs profils"
        actions={
          <Link to="/candidates/new">
            <Button leftIcon={<UserPlus className="h-4 w-4" />}>
              Ajouter un candidat
            </Button>
          </Link>
        }
      />

      <div className="mb-6">
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher par nom, email ou compétence..."
          />
        </div>

        <FiltersPanel onApplyFilters={handleApplyFilters} />
      </div>

      {filteredCandidates.length === 0 ? (
        <EmptyState
          title="Aucun candidat trouvé"
          description="Commencez par ajouter des candidats à votre base de données."
          icon={<Users className="h-12 w-12" />}
          action={
            <Link to="/candidates/new">
              <Button>Ajouter un candidat</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </>
  );
};