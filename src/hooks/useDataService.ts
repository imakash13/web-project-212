import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseDataServiceOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export function useDataService<T, E = Error>(
  serviceFunction: () => Promise<T>,
  options: UseDataServiceOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);
  
  const execute = async () => {
    try {
      setLoading(true);
      if (options.loadingMessage) {
        toast.loading(options.loadingMessage);
      }
      
      const result = await serviceFunction();
      setData(result);
      setError(null);
      
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err as E;
      setError(error);
      
      if (options.errorMessage) {
        toast.error(options.errorMessage);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('An error occurred');
      }
      
      if (options.onError) {
        options.onError(err as Error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}

export function useDataFetch<T, E = Error>(
  serviceFunction: () => Promise<T>,
  options: UseDataServiceOptions<T> & { fetchOnMount?: boolean } = { fetchOnMount: true }
) {
  const service = useDataService<T, E>(serviceFunction, options);
  
  useEffect(() => {
    if (options.fetchOnMount !== false) {
      service.execute();
    }
  }, []);
  
  return service;
}
