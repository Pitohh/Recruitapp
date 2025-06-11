import api from './api';
import { JobOffer } from '../types';

export const fetchJobOffers = async (): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>('/job-offers');
  return response.data;
};

export const fetchJobOffer = async (id: string): Promise<JobOffer> => {
  const response = await api.get<JobOffer>(`/job-offers/${id}`);
  return response.data;
};

export const createJobOffer = async (jobOfferData: Omit<JobOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobOffer> => {
  const response = await api.post<JobOffer>('/job-offers', jobOfferData);
  return response.data;
};

export const updateJobOffer = async (id: string, jobOfferData: Partial<JobOffer>): Promise<JobOffer> => {
  const response = await api.put<JobOffer>(`/job-offers/${id}`, jobOfferData);
  return response.data;
};

export const deleteJobOffer = async (id: string): Promise<void> => {
  await api.delete(`/job-offers/${id}`);
};

export const searchJobOffers = async (query: string): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>(`/job-offers/search?q=${query}`);
  return response.data;
};