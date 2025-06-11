import api from './api';
import { useAuthStore } from '../store/authStore';

export async function loginUser(email: string, password: string, role: string) {
  const response = await api.post('/api/token/', {
    email,
    password,
    role,
  });

  const { access, user } = response.data;

  useAuthStore.getState().login(user, access);
}
