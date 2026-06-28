import api from './api';

/**
 * Get the currently authenticated user's profile.
 */
export async function getMe() {
  const response = await api.get('/users/me');
  return response.data;
}

/**
 * Get the current user's access status.
 */
export async function getStatus() {
  const response = await api.get('/users/status');
  return response.data;
}
