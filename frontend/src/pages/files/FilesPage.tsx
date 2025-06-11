import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { SearchBar } from '../../components/features/SearchBar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { FileText, Download, Eye, Trash, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  candidateName: string;
  uploadDate: string;
  path: string;
}

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'cv-martin-dupont.pdf',
      type: 'PDF',
      size: 1240000,
      candidateName: 'Martin Dupont',
      uploadDate: '2023-04-15T10:30:00',
      path: '#',
    },
    {
      id: '2',
      name: 'cv-sophie-martin.pdf',
      type: 'PDF',
      size: 890000,
      candidateName: 'Sophie Martin',
      uploadDate: '2023-04-14T14:15:00',
      path: '#',
    },
    {
      id: '3',
      name: 'lettre-motivation-jean-dubois.pdf',
      type: 'PDF',
      size: 350000,
      candidateName: 'Jean Dubois',
      uploadDate: '2023-04-13T09:45:00',
      path: '#',
    },
  ]);
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query) {
      const filtered = files.filter((file) => {
        const fileData = `${file.name} ${file.candidateName}`.toLowerCase();
        return fileData.includes(query.toLowerCase());
      });
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <>
      <PageHeader
        title="Fichiers"
        description="Gérez les CV et documents des candidats"
        actions={
          <Button leftIcon={<Upload className="h-4 w-4" />}>
            Importer un fichier
          </Button>
        }
      />

      <div className="mb-6">
        <div className="max-w-xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher par nom de fichier ou de candidat..."
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du fichier</TableHead>
                <TableHead>Candidat</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Date d'import</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{file.candidateName}</TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{formatDate(file.uploadDate)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-gray-500 hover:text-primary-600"
                        title="Télécharger"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-500 hover:text-primary-600"
                        title="Voir"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-500 hover:text-error-600"
                        title="Supprimer"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredFiles.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Aucun fichier trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucun fichier ne correspond à votre recherche.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};