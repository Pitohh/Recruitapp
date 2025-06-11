export type Role = 'admin' | 'recruiter';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  education: string;
  cvPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  contract: string;
  description: string;
  requirements: string[];
  salary?: string;
  experienceRequired: string;
  status: 'open' | 'closed' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'pending' | 'in_progress' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  candidateId: string;
  offerId: string;
  status: ApplicationStatus;
  candidate?: Candidate;
  offer?: JobOffer;
  notes?: string;
  recruiterNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCandidates: number;
  totalOffers: number;
  totalApplications: number;
  applicationsByStatus: {
    pending: number;
    in_progress: number;
    accepted: number;
    rejected: number;
  };
}

export interface SearchFilters {
  query?: string;
  status?: ApplicationStatus[];
  location?: string;
  skills?: string[];
  experience?: string;
  date?: {
    from?: string;
    to?: string;
  };
}