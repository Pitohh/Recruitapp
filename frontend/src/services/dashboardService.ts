import api from './api';
import { DashboardStats } from '../types';

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
};