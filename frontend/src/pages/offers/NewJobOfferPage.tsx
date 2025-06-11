import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useJobOffersStore } from '../../store/jobOffersStore';
import { Select, SelectOption } from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft } from 'lucide-react';

interface JobOfferFormData {
  title: string;
  company: string;
  location: string;
  department: string;
  contract: string;
  description: string;
  requirements: string;
  salary: string;
  experienceRequired: string;
}

export const NewJobOfferPage: React.FC = () => {
  const { addJobOffer } = useJobOffersStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<JobOfferFormData>();

  const contractOptions: SelectOption[] = [
    { label: 'CDI', value: 'cdi' },
    { label: 'CDD', value: 'cdd' },
    { label: 'Intérim', value: 'interim' },
    { label: 'Stage', value: 'stage' },
    { label: 'Alternance', value: 'alternance' },
    { label: 'Freelance', value: 'freelance' },
  ];

  const experienceOptions: SelectOption[] = [
    { label: 'Débutant', value: 'Débutant' },
    { label: '1-2 ans', value: '1-2 ans' },
    { label: '3-5 ans', value: '3-5 ans' },
    { label: '5+ ans', value: '5+ ans' },
    { label: '10+ ans', value: '10+ ans' },
  ];

  const selectedContract = watch('contract');

  const onSubmit = async (data: JobOfferFormData) => {
    try {
      const jobOfferData = {
        ...data,
        requirements: data.requirements.split(',').map((req) => req.trim()),
        status: 'open' as const,
      };
      
      await addJobOffer(jobOfferData);
      navigate('/offers');
    } catch (error) {
      console.error('Error creating job offer:', error);
    }
  };

  return (
    <>
      <PageHeader
        title="Nouvelle offre d'emploi"
        description="Créez une nouvelle offre d'emploi"
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/offers')}
          >
            Retour
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Titre du poste"
                placeholder="ex: Développeur React Senior"
                error={errors.title?.message}
                {...register('title', { required: 'Le titre est requis' })}
              />
              
              <Input
                label="Entreprise"
                placeholder="ex: Acme Inc."
                error={errors.company?.message}
                {...register('company', { required: 'L\'entreprise est requise' })}
              />
              
              <Input
                label="Lieu"
                placeholder="ex: Paris, France"
                error={errors.location?.message}
                {...register('location', { required: 'Le lieu est requis' })}
              />
              
              <Input
                label="Département"
                placeholder="ex: Informatique"
                error={errors.department?.message}
                {...register('department', { required: 'Le département est requis' })}
              />
              
              <div>
                <Select
                  label="Type de contrat"
                  options={contractOptions}
                  value={selectedContract || ''}
                  onChange={(value) => setValue('contract', value)}
                  error={errors.contract?.message}
                />
                <input
                  type="hidden"
                  {...register('contract', { required: 'Le type de contrat est requis' })}
                />
              </div>
              
              <div>
                <Select
                  label="Expérience requise"
                  options={experienceOptions}
                  value={watch('experienceRequired') || ''}
                  onChange={(value) => setValue('experienceRequired', value)}
                  error={errors.experienceRequired?.message}
                />
                <input
                  type="hidden"
                  {...register('experienceRequired', { required: 'L\'expérience requise est requise' })}
                />
              </div>
              
              <Input
                label="Salaire (optionnel)"
                placeholder="ex: 45-55k€"
                {...register('salary')}
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Compétences requises (séparées par des virgules)"
                  placeholder="ex: React, JavaScript, TypeScript..."
                  error={errors.requirements?.message}
                  {...register('requirements', { required: 'Les compétences requises sont requises' })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description du poste
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
                  placeholder="Décrivez le poste, les responsabilités, et le contexte de l'entreprise..."
                  {...register('description', { required: 'La description est requise' })}
                ></textarea>
                {errors.description && (
                  <p className="text-sm text-error-500">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/offers')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Publier l'offre
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};