import { create } from 'zustand';
import { JobOffer } from '../types';
import { fetchJobOffers, createJobOffer, updateJobOffer, deleteJobOffer } from '../services/jobOffersService';

interface JobOffersState {
  jobOffers: JobOffer[];
  isLoading: boolean;
  error: string | null;
}

interface JobOffersStore extends JobOffersState {
  getAllJobOffers: () => Promise<void>;
  addJobOffer: (jobOffer: Omit<JobOffer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJobOfferData: (id: string, data: Partial<JobOffer>) => Promise<void>;
  removeJobOffer: (id: string) => Promise<void>;
}

export const useJobOffersStore = create<JobOffersStore>((set) => ({
  jobOffers: [],
  isLoading: false,
  error: null,

  getAllJobOffers: async () => {
    set({ isLoading: true, error: null });
    try {
      const jobOffers = await fetchJobOffers();
      set({ jobOffers, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  addJobOffer: async (jobOfferData) => {
    set({ isLoading: true, error: null });
    try {
      const newJobOffer = await createJobOffer(jobOfferData);
      set((state) => ({
        jobOffers: [...state.jobOffers, newJobOffer],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  updateJobOfferData: async (id, jobOfferData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedJobOffer = await updateJobOffer(id, jobOfferData);
      set((state) => ({
        jobOffers: state.jobOffers.map((jobOffer) =>
          jobOffer.id === id ? { ...jobOffer, ...updatedJobOffer } : jobOffer
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  removeJobOffer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteJobOffer(id);
      set((state) => ({
        jobOffers: state.jobOffers.filter((jobOffer) => jobOffer.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },
}));