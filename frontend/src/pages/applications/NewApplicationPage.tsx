import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Select, SelectOption } from '../../components/ui/Select';
import { useApplicationsStore } from '../../store/applicationsStore';
import { useCandidatesStore } from '../../store/candidatesStore';
import { useJobOffersStore } from '../../store/jobOffersStore';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { ApplicationStatus } from '../../types';

interface ApplicationFormData {
  candidateId: string;
  offerId: string;
  status: ApplicationStatus;
  notes: string;
}

export const NewApplicationPage: React.FC = () => {
  const { addApplication } = useApplicationsStore();
  const { candidates, getAllCandidates } = useCandidatesStore();
  const { jobOffers, getAllJobOffers } = useJobOffersStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [initialCandidateId, setInitialCandidateId] = useState<string>('');
  const [initialOfferId, setInitialOfferId] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ApplicationFormData>();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllCandidates(), getAllJobOffers()]);
      
      // Check for query parameters (e.g., from a candidate or job offer detail page)
      const params = new URLSearchParams(location.search);
      const candidateId = params.get('candidateId');
      const offerId = params.get('offerId');
      
      if (candidateId) {
        setInitialCandidateId(candidateId);
        setValue('candidateId', candidateId);
      }
      
      if (offerId) {
        setInitialOfferId(offerId);
        setValue('offerId', offerId);
      }
      
      // Set default status
      setValue('status', 'pending');
    };
    
    fetchData();
  }, [getAllCandidates, getAllJobOffers, location.search, setValue]);

  const candidateOptions: SelectOption[] = candidates.map((candidate) => ({
    label: `${candidate.firstName} ${candidate.lastName}`,
    value: candidate.id,
  }));

  const jobOfferOptions: SelectOption[] = jobOffers.map((offer) => ({
    label: `${offer.title} - ${offer.company}`,
    value: offer.id,
  }));

  const statusOptions: SelectOption[] = [
    { label: 'En attente', value: 'pending' },
    { label: 'En cours', value: 'in_progress' },
    { label: 'Accepté', value: 'accepted' },
    { label: 'Refusé', value: 'rejected' },
  ];

  const selectedCandidate = watch('candidateId');
  const selectedOffer = watch('offerId');
  const selectedStatus = watch('status');

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      await addApplication(data);
      navigate('/applications');
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  return (
    <>
      <PageHeader
        title="Nouvelle candidature"
        description="Associer un candidat à une offre d'emploi"
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/applications')}
          >
            Retour
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Select
                  label="Candidat"
                  options={candidateOptions}
                  value={selectedCandidate || ''}
                  onChange={(value) => setValue('candidateId', value)}
                  error={errors.candidateId?.message}
                  placeholder="Sélectionner un candidat"
                  fullWidth
                />
                <input
                  type="hidden"
                  {...register('candidateId', { required: 'Le candidat est requis' })}
                />
              </div>
              
              <div>
                <Select
                  label="Offre d'emploi"
                  options={jobOfferOptions}
                  value={selectedOffer || ''}
                  onChange={(value) => setValue('offerId', value)}
                  error={errors.offerId?.message}
                  placeholder="Sélectionner une offre"
                  fullWidth
                />
                <input
                  type="hidden"
                  {...register('offerId', { required: 'L\'offre est requise' })}
                />
              </div>
              
              <div>
                <Select
                  label="Statut"
                  options={statusOptions}
                  value={selectedStatus || 'pending'}
                  onChange={(value) => setValue('status', value as ApplicationStatus)}
                  fullWidth
                />
                <input
                  type="hidden"
                  {...register('status', { required: 'Le statut est requis' })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                  placeholder="Notes sur cette candidature..."
                  {...register('notes')}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/applications')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};