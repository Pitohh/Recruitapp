import { create } from 'zustand';
import { Candidate } from '../types';
import { fetchCandidates, createCandidate, updateCandidate, deleteCandidate } from '../services/candidatesService';

interface CandidatesState {
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
}

interface CandidatesStore extends CandidatesState {
  getAllCandidates: () => Promise<void>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCandidateData: (id: string, data: Partial<Candidate>) => Promise<void>;
  removeCandidate: (id: string) => Promise<void>;
}

export const useCandidatesStore = create<CandidatesStore>((set, get) => ({
  candidates: [],
  isLoading: false,
  error: null,

  getAllCandidates: async () => {
    set({ isLoading: true, error: null });
    try {
      const candidates = await fetchCandidates();
      set({ candidates, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  addCandidate: async (candidateData) => {
    set({ isLoading: true, error: null });
    try {
      const newCandidate = await createCandidate(candidateData);
      set((state) => ({
        candidates: [...state.candidates, newCandidate],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  updateCandidateData: async (id, candidateData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCandidate = await updateCandidate(id, candidateData);
      set((state) => ({
        candidates: state.candidates.map((candidate) =>
          candidate.id === id ? { ...candidate, ...updatedCandidate } : candidate
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

  removeCandidate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteCandidate(id);
      set((state) => ({
        candidates: state.candidates.filter((candidate) => candidate.id !== id),
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