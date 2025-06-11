import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useCandidatesStore } from '../../store/candidatesStore';
import { useForm } from 'react-hook-form';
import { X, Upload, Save, ArrowLeft } from 'lucide-react';
import { uploadCV } from '../../services/candidatesService';

interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  education: string;
}

export const NewCandidatePage: React.FC = () => {
  const { addCandidate } = useCandidatesStore();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormData>();

  const onSubmit = async (data: CandidateFormData) => {
    try {
      const candidateData = {
        ...data,
        skills: data.skills.split(',').map((skill) => skill.trim()),
      };
      
      // Create candidate
      await addCandidate(candidateData);
      
      // Upload CV if file is selected
      if (selectedFile) {
        // In a real app, we would get the candidate ID from the response
        // and upload the CV for that candidate
        setIsUploading(true);
        const candidateId = 'new-candidate-id';
        await uploadCV(candidateId, selectedFile);
      }
      
      navigate('/candidates');
    } catch (error) {
      console.error('Error creating candidate:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <>
      <PageHeader
        title="Ajouter un candidat"
        description="Créez un nouveau profil candidat"
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate('/candidates')}
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
                label="Prénom"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Le prénom est requis' })}
              />
              
              <Input
                label="Nom"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Le nom est requis' })}
              />
              
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide',
                  },
                })}
              />
              
              <Input
                label="Téléphone"
                error={errors.phone?.message}
                {...register('phone', { required: 'Le téléphone est requis' })}
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Compétences (séparées par des virgules)"
                  placeholder="React, JavaScript, UI/UX..."
                  error={errors.skills?.message}
                  {...register('skills', { required: 'Les compétences sont requises' })}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expérience professionnelle
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="Décrivez l'expérience professionnelle du candidat..."
                  {...register('experience', { required: 'L\'expérience est requise' })}
                ></textarea>
                {errors.experience && (
                  <p className="text-sm text-error-500">{errors.experience.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formation
                </label>
                <textarea
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                            disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="Décrivez la formation du candidat..."
                  {...register('education', { required: 'La formation est requise' })}
                ></textarea>
                {errors.education && (
                  <p className="text-sm text-error-500">{errors.education.message}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CV (PDF)
                </label>
                
                {!selectedFile ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                        >
                          <span>Importer un fichier</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF jusqu'à 10MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-between p-4 border border-gray-300 rounded-md">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3 truncate">
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="ml-2 flex-shrink-0 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/candidates')}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting || isUploading}
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