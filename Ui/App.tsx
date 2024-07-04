import { useState } from 'react';
import { IFileDatabase } from '../Database/FileDatabase.js';
import { CreateNewSchema } from './CreateNewSchema.js';
import { Schemas } from './Schemas.js';

export interface AppProps {
  library: {
    database: IFileDatabase
  }
}

export function App({ library: { database } }: AppProps) {
  const [page, setPage] = useState('home');

  return (
    <div>
      <div style={{ display: 'flex', gap: '1em'}}>
        <button onClick={() => setPage('home')}>
          Home
        </button>
        <button onClick={() => setPage('schemas')}>
          Schemas
        </button>
      </div>

      {(() => {
        switch (page) {
        case 'createNewSchema':
          return <CreateNewSchema library={{ database }} />;
        case 'schemas':
          return <Schemas library={{ database }} setPage={setPage} />;
        default:
          return <h4>Home</h4>;
        }
      })()}
    </div>
  );
}