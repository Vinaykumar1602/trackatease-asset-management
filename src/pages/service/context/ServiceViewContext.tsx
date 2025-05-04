
import { createContext, useState, useContext, ReactNode } from 'react';

interface ServiceViewContextProps {
  viewMode: "table" | "calendar";
  setViewMode: (mode: "table" | "calendar") => void;
}

const ServiceViewContext = createContext<ServiceViewContextProps | undefined>(undefined);

export function ServiceViewProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  return (
    <ServiceViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </ServiceViewContext.Provider>
  );
}

export function useServiceView() {
  const context = useContext(ServiceViewContext);
  if (context === undefined) {
    throw new Error('useServiceView must be used within a ServiceViewProvider');
  }
  return context;
}
