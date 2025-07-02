import { useState, useEffect } from "react";

type Invoice = {
  id: string;
  receiverName: string;
  amount: number;
  currency: "CLP" | "USD";
  injected?: boolean;
};

export interface ApiState {
  data: Invoice[] | null;
  loading: boolean;
  error: string | null;
}

// Global token management
let globalToken: string | null = null;

function getAuthToken(): string {
  // First check if we already have a token
  if (globalToken) {
    return globalToken;
  }

  // Check environment variable first
  const envToken = import.meta.env.VITE_AUTH_TOKEN;
  if (envToken) {
    globalToken = envToken;
    return envToken;
  }

  // If no env var, prompt the user
  const userToken = prompt("Please enter your authentication token:");
  if (!userToken) {
    throw new Error("Authentication token is required");
  }

  const trimmedToken = userToken.trim();
  if (trimmedToken === "") {
    throw new Error("Authentication token is required");
  }

  globalToken = trimmedToken;
  return trimmedToken;
}

// url should start with a slash
export function useApi(
  url: string,
): [ApiState, (invoiceIds: string[]) => void] {
  const [state, setState] = useState<ApiState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    const baseUrl =
      import.meta.env.VITE_BASE_URL || "https://recruiting.data.bemmbo.com";

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const token = getAuthToken();

        const response = await fetch(`${baseUrl}${url}`, {
          headers: {
            Authorization: token ? `${token}` : "",
            "Content-Type": "application/json",
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
            error: error instanceof Error ? error.message : "Unknown error",
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

  function setInjected(recentlyInjected: string[]) {
    if (!state.data) {
      return;
    }
    const copy = state.data.map((invoice) => ({
      ...invoice,
      injected: recentlyInjected.includes(invoice.id),
    }));
    setState((prev) => ({ ...prev, data: copy }));
  }

  return [state, setInjected];
}

// Process a batch of invoices
export async function processInvoiceBatch(
  invoiceIds: string[],
): Promise<void | "server_error"> {
  const token = getAuthToken();
  const baseUrl =
    import.meta.env.VITE_BASE_URL || "https://recruiting.data.bemmbo.com";

  const response = await fetch(`${baseUrl}/invoices/inject`, {
    method: "POST",
    headers: {
      Authorization: token ? `${token}` : "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ invoiceIds }),
  });

  if (!response.ok) {
    if (response.status === 500) {
      return "server_error";
    }
    if (response.status === 400) {
      // TODO: ignore "already injected" errors
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
