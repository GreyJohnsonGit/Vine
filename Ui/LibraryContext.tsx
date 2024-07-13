import { createContext, ReactNode, useContext } from 'react';
import { IFileDatabase } from '../Database/FileDatabase.js';

export interface Library {
  database: IFileDatabase,
  save: () => Promise<void>
}

const LibraryContext = createContext<Library | undefined>(undefined);

export function useLibrary(): Library {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}

export type LibraryProviderProps = {
  library: Library;
  children: ReactNode;
}

export function LibraryProvider({ children, library }: LibraryProviderProps) {
  return (
    <LibraryContext.Provider value={library}>
      {children}
    </LibraryContext.Provider>
  );
}