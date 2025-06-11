import { create } from 'zustand';
import { Application, ApplicationStatus } from '../types';
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../services/applicationsService';

interface ApplicationsState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
}

interface ApplicationsStore extends ApplicationsState {
  getAllApplications: () => Promise<void>;
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => Promise<void>;
  updateApplicationData: (id: string, data: Partial<Application>) => Promise<void>;
  removeApplication: (id: string) => Promise<void>;
}

export const useApplicationsStore = create<ApplicationsStore>((set) => ({
  applications: [],
  isLoading: false,
  error: null,

  getAllApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const applications = await fetchApplications();
      set({ applications, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  addApplication: async (applicationData) => {
    set({ isLoading: true, error: null });
    try {
      const newApplication = await createApplication(applicationData);
      set((state) => ({
        applications: [...state.applications, newApplication],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
        isLoading: false,
      });
    }
  },

  updateApplicationStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      await updateApplication(id, { status });
      set((state) => ({
        applications: state.applications.map((application) =>
          application.id === id ? { ...application, status } : application
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

  updateApplicationData: async (id, applicationData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedApplication = await updateApplication(id, applicationData);
      set((state) => ({
        applications: state.applications.map((application) =>
          application.id === id ? { ...application, ...updatedApplication } : application
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

  removeApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteApplication(id);
      set((state) => ({
        applications: state.applications.filter((application) => application.id !== id),
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