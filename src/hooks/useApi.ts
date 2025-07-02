import { useState, useEffect } from 'react';

type Invoice = {
  id: string
  receiverName: string
  amount: number
  currency: "CLP" | "USD"
  injected?: boolean
}

interface ApiState<T> {
  data: Invoice[] | null;
  loading: boolean;
  error: string | null;
}

// url should start with a slash
export function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const token = import.meta.env.VITE_AUTH_TOKEN;
    const baseUrl = import.meta.env.VITE_BASE_URL || 'https://recruiting.data.bemmbo.com';

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch(`${baseUrl}${url}`, {
          headers: {
            'Authorization': token ? `${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ 
            data: null, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
} 