import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Role } from '../../types';
import { UserIcon, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('recruiter');
  const [localError, setLocalError] = useState<string | null>(null);

  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setError = useAuthStore((state) => state.setError);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null);
    setLoading(true);
    setError(null);

    try {
      await loginUser(data.email, data.password, selectedRole);
      navigate('/dashboard');
    } catch (err: any) {
      setLocalError("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <UserIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">RecruitApp</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    selectedRole === 'recruiter'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  onClick={() => setSelectedRole('recruiter')}
                >
                  Recruteur
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    selectedRole === 'admin'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  onClick={() => setSelectedRole('admin')}
                >
                  Administrateur
                </button>
              </div>
            </div>

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Adresse email"
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={errors.email?.message}
              fullWidth
              {...register('email', {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              })}
            />

            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Mot de passe"
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.password?.message}
              fullWidth
              {...register('password', {
                required: "Le mot de passe est requis",
                minLength: {
                  value: 6,
                  message: "Le mot de passe doit contenir au moins 6 caractères",
                },
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{localError}</span>
            </div>
          )}

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              Se connecter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
