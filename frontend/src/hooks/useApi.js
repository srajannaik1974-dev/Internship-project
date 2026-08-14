import { useState, useCallback, useEffect } from 'react';

/**
 * Custom Hook to handle API request state (data, loading, error)
 * @param {Function} apiFunc - API service function to execute
 * @param {boolean} immediate - Whether to execute immediately on mount
 * @param {Array} params - Arguments for immediate execution
 */
export const useApi = (apiFunc, immediate = false, params = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...(args.length > 0 ? args : params));
      setData(response);
      setLoading(false);
      return response;
    } catch (err) {
      const friendlyMessage = err?.response?.data?.message || 'Something went wrong. Please try again.';
      setError(friendlyMessage);
      setLoading(false);
      throw new Error(friendlyMessage);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
};
