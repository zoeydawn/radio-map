// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, AppContextProps, RadioStation } from './AppContext.types';

// Define the initial state
const initialState: AppState = {
  theme: 'dark', // Default theme
  radioStations: [], // Default empty array for radio stations
};

// Create the context with a default value (can be undefined or a mock, but we'll handle it in the provider)
// We assert the type here, knowing the Provider will supply the actual value.
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Export the Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setTheme = (theme: 'light' | 'dark') => {
    setState(prevState => ({ ...prevState, theme }));
  };

  const setRadioStations = (stations: RadioStation[]) => {
    setState(prevState => ({ ...prevState, radioStations: stations }));
  };

  // You can add more complex logic here for updating stations if needed

  return (
    <AppContext.Provider value={{ state, setTheme, setRadioStations }}>
      {children}
    </AppContext.Provider>
  );
};

// Export a custom hook to use the context
export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
