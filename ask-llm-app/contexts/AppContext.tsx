import React, { createContext, useContext, useState } from 'react';

interface AppState {
  isModelSelected: boolean;
  isFileUploaded: boolean;
  isIndexed: boolean;
  setModelSelected: (selected: boolean) => void;
  setFileUploaded: (uploaded: boolean) => void;
  setIndexed: (indexed: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isModelSelected, setModelSelected] = useState<boolean>(false);
  const [isFileUploaded, setFileUploaded] = useState<boolean>(false);
  const [isIndexed, setIndexed] = useState<boolean>(false);

  const value = {
    isModelSelected,
    isFileUploaded,
    isIndexed,
    setModelSelected,
    setFileUploaded,
    setIndexed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };
