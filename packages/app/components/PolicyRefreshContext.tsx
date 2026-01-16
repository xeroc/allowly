"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface PolicyRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const PolicyRefreshContext = createContext<
  PolicyRefreshContextType | undefined
>(undefined);

export function PolicyRefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const triggerRefresh = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setTimeoutId(null);
    }, 1500);
    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  return (
    <PolicyRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </PolicyRefreshContext.Provider>
  );
}

export function usePolicyRefresh() {
  const context = useContext(PolicyRefreshContext);
  if (!context) {
    throw new Error(
      "usePolicyRefresh must be used within PolicyRefreshProvider",
    );
  }
  return context;
}
