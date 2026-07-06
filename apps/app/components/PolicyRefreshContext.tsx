"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerRefresh = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setRefreshKey((n) => n + 1), 1500);
  }, []);

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
