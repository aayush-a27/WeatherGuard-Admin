import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, getPendingUsers, approveUser, rejectUser } from '../services/adminService';
import { getErrorMessage } from '../utils/helpers';

/**
 * Custom hook for admin dashboard data fetching and user management.
 */
export function useAdmin() {
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // userId being acted on

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [all, pending] = await Promise.all([getAllUsers(), getPendingUsers()]);
      setAllUsers(all);
      setPendingUsers(pending);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = useCallback(async (userId) => {
    try {
      setActionLoading(userId);
      await approveUser(userId);
      await fetchData(); // Refresh data
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [fetchData]);

  const handleReject = useCallback(async (userId) => {
    try {
      setActionLoading(userId);
      await rejectUser(userId);
      await fetchData(); // Refresh data
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }, [fetchData]);

  return {
    allUsers,
    pendingUsers,
    loading,
    error,
    actionLoading,
    handleApprove,
    handleReject,
    refetch: fetchData,
  };
}
