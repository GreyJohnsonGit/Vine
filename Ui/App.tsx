import { useState } from 'react';
import { CreateSchema } from './CreateSchema.js';
import { CreateSchemaField } from './CreateSchemaField.js';
import { SchemaFields } from './SchemaFields.js';
import { Schemas } from './Schemas.js';

export function App() {
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
        <button onClick={() => setPage('schemaFields')}>
          Schema Fields
        </button>
      </div>

      {(() => {
        switch (page) {
        case 'createNewSchema':
          return <CreateSchema/>;
        case 'schemas':
          return <Schemas setPage={setPage} />;
        case 'createNewSchemaField':
          return <CreateSchemaField/>;
        case 'schemaFields':
          return <SchemaFields setPage={setPage} />;
        default:
          return <h4>Home</h4>;
        }
      })()}
    </div>
  );
}