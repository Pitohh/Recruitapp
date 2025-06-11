import api from './api';
import { Candidate } from '../types';

export const fetchCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get<Candidate[]>('/candidates');
  return response.data;
};

export const fetchCandidate = async (id: string): Promise<Candidate> => {
  const response = await api.get<Candidate>(`/candidates/${id}`);
  return response.data;
};

export const createCandidate = async (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Candidate> => {
  const response = await api.post<Candidate>('/candidates', candidateData);
  return response.data;
};

export const updateCandidate = async (id: string, candidateData: Partial<Candidate>): Promise<Candidate> => {
  const response = await api.put<Candidate>(`/candidates/${id}`, candidateData);
  return response.data;
};

export const deleteCandidate = async (id: string): Promise<void> => {
  await api.delete(`/candidates/${id}`);
};

export const uploadCV = async (id: string, file: File): Promise<{ cvPath: string }> => {
  const formData = new FormData();
  formData.append('cv', file);
  
  const response = await api.post<{ cvPath: string }>(`/candidates/${id}/upload-cv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const searchCandidates = async (query: string): Promise<Candidate[]> => {
  const response = await api.get<Candidate[]>(`/candidates/search?q=${query}`);
  return response.data;
};