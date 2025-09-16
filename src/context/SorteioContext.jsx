import { createContext, useContext } from 'react';
import { useSorteio } from '../hooks/useSorteio';

const SorteioContext = createContext();

export const SorteioProvider = ({ children }) => {
  const sorteioData = useSorteio();

  return (
    <SorteioContext.Provider value={sorteioData}>
      {children}
    </SorteioContext.Provider>
  );
};

export const useSorteioContext = () => {
  const context = useContext(SorteioContext);
  if (!context) {
    throw new Error('useSorteioContext deve ser usado dentro de SorteioProvider');
  }
  return context;
};

