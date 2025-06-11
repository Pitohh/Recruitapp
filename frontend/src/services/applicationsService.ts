import api from './api';
import { Application } from '../types';

export const fetchApplications = async (): Promise<Application[]> => {
  const response = await api.get<Application[]>('/applications');
  return response.data;
};

export const fetchApplication = async (id: string): Promise<Application> => {
  const response = await api.get<Application>(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (
  applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Application> => {
  const response = await api.post<Application>('/applications', applicationData);
  return response.data;
};

export const updateApplication = async (id: string, applicationData: Partial<Application>): Promise<Application> => {
  const response = await api.put<Application>(`/applications/${id}`, applicationData);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

export const fetchApplicationsByCandidate = async (candidateId: string): Promise<Application[]> => {
  const response = await api.get<Application[]>(`/applications/candidate/${candidateId}`);
  return response.data;
};

export const fetchApplicationsByJobOffer = async (offerId: string): Promise<Application[]> => {
  const response = await api.get<Application[]>(`/applications/job-offer/${offerId}`);
  return response.data;
};