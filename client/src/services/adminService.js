import api from './api';

/**
 * Get all users with pending access status.
 */
export async function getPendingUsers() {
  const response = await api.get('/admin/pending-users');
  return response.data;
}

/**
 * Get all registered users.
 */
export async function getAllUsers() {
  const response = await api.get('/admin/all-users');
  return response.data;
}

/**
 * Approve a user by ID.
 * @param {string} id
 */
export async function approveUser(id) {
  const response = await api.patch(`/admin/approve/${id}`);
  return response.data;
}

/**
 * Reject a user by ID.
 * @param {string} id
 */
export async function rejectUser(id) {
  const response = await api.patch(`/admin/reject/${id}`);
  return response.data;
}
