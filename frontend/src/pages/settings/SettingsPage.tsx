import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { UserPlus, Edit, Trash, User, Shield } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import { Select, SelectOption } from '../../components/ui/Select';
import { useAuthStore } from '../../store/authStore';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'recruiter';
  avatar?: string;
  lastLogin: string;
}

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: 'admin',
      lastLogin: '2023-04-15T10:30:00',
    },
    {
      id: '2',
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@example.com',
      role: 'recruiter',
      lastLogin: '2023-04-14T14:15:00',
    },
    {
      id: '3',
      firstName: 'Jean',
      lastName: 'Dubois',
      email: 'jean.dubois@example.com',
      role: 'recruiter',
      lastLogin: '2023-04-13T09:45:00',
    },
  ]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'recruiter' as 'admin' | 'recruiter',
  });

  // Check if the current user is an admin
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900">Accès restreint</h2>
        <p className="mt-2 text-gray-600">
          Vous n'avez pas les droits d'accès nécessaires pour voir cette page.
          <br />
          Seuls les administrateurs peuvent accéder aux paramètres.
        </p>
      </div>
    );
  }

  const handleAddUser = () => {
    setIsAddingUser(true);
  };

  const handleCancelAddUser = () => {
    setIsAddingUser(false);
    setNewUserData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'recruiter',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: string) => {
    setNewUserData((prev) => ({ ...prev, role: role as 'admin' | 'recruiter' }));
  };

  const handleSaveUser = () => {
    // In a real app, this would make an API call
    const newUser: UserData = {
      id: Date.now().toString(),
      ...newUserData,
      lastLogin: '',
    };
    
    setUsers((prev) => [...prev, newUser]);
    setIsAddingUser(false);
    setNewUserData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'recruiter',
    });
  };

  const roleOptions: SelectOption[] = [
    { label: 'Administrateur', value: 'admin' },
    { label: 'Recruteur', value: 'recruiter' },
  ];

  return (
    <>
      <PageHeader
        title="Paramètres"
        description="Gérez les utilisateurs et les paramètres du système"
      />

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Utilisateurs</CardTitle>
            <Button
              onClick={handleAddUser}
              leftIcon={<UserPlus className="h-4 w-4" />}
              disabled={isAddingUser}
            >
              Ajouter un utilisateur
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAddingUser && (
            <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Nouvel utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Prénom"
                  name="firstName"
                  value={newUserData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Nom"
                  name="lastName"
                  value={newUserData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={newUserData.email}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Rôle"
                  options={roleOptions}
                  value={newUserData.role}
                  onChange={handleRoleChange}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCancelAddUser}>
                  Annuler
                </Button>
                <Button onClick={handleSaveUser}>Enregistrer</Button>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar src={user.avatar} alt={`${user.firstName} ${user.lastName}`} size="sm" />
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Administrateur
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <User className="h-3 w-3 mr-1" />
                          Recruteur
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-gray-500 hover:text-primary-600"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-500 hover:text-error-600"
                        title="Supprimer"
                        disabled={user.id === '1'} // Prevent deleting the main admin
                      >
                        <Trash className={`h-5 w-5 ${user.id === '1' ? 'opacity-50 cursor-not-allowed' : ''}`} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise
                </label>
                <Input defaultValue="RecruitApp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de l'entreprise
                </label>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <Button variant="outline" size="sm">
                    Changer le logo
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuseau horaire
                </label>
                <select className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  <option>Europe/Paris</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <Button>Enregistrer les modifications</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Email pour les nouvelles candidatures
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="notification-new-application" 
                    defaultChecked
                    className="sr-only"
                  />
                  <label 
                    htmlFor="notification-new-application"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  >
                    <span className="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out"></span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Email pour les changements de statut
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="notification-status-change" 
                    defaultChecked
                    className="sr-only"
                  />
                  <label 
                    htmlFor="notification-status-change"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  >
                    <span className="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out"></span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Email pour les nouvelles offres d'emploi
                </span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="notification-new-job" 
                    className="sr-only"
                  />
                  <label 
                    htmlFor="notification-new-job"
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  >
                    <span className="toggle-dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button>Enregistrer les préférences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};