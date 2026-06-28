import { useState, useEffect, useCallback } from 'react';
import { getStatus } from '../services/authService';
import { getErrorMessage } from '../utils/helpers';

/**
 * Custom hook for fetching and tracking the current user's access status.
 */
export function useUserStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStatus();
      setStatus(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return { status, loading, error, refetch: fetchStatus };
}
