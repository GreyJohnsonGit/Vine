import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLibrary } from './LibraryContext.js';

export interface SchemasProps {
  setPage: (page: string) => void;
}

export function Schemas({ setPage }: SchemasProps) {
  const { database } = useLibrary();
  const [remoteChanges, setRemoteChanges] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    if (remoteChanges === true) {
      axios.post(
        'http://localhost:5052/save/', 
        database.toJson()
      );
    }
    setRemoteChanges(false);
  }, [remoteChanges, database]);

  const readFormSchemas = database.read('formSchema', () => true);
  if (readFormSchemas.isErr()) {
    console.error(readFormSchemas.error);
    throw new Error(readFormSchemas.error);
  }
  const formSchemas = readFormSchemas.value;

  return (
    <div>
      <h4>Schema</h4>
      <button onClick={() => setShowDrafts(!showDrafts)}>
        {showDrafts ? 'Hide Drafts' : 'Show Drafts'}
      </button>
      <br/>
      <button onClick={() => setPage('createNewSchema')}>
        Create New Schemas
      </button>
      {formSchemas
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(schema => showDrafts || !schema.isDraft)
        .map(schema => <div key={`${schema.seriesId}-${schema.revision}`}>
          <table>
            <thead>
              <tr>
                <th>
                  {schema.name} 
                  {' / '}
                  {schema.seriesId} 
                  {' / '}
                  {schema.revision}
                  {schema.isDraft && ' / Draft'}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{schema.description}</td>
              </tr>
            </tbody>
          </table>
          {schema.isDraft ? <>
            <button>Update</button>
            <button
              onClick={() => {
                database.publish('formSchema', row => 
                  row.seriesId === schema.seriesId &&
                row.revision === schema.revision
                );
                setRemoteChanges(true);
              }}
            >
              Publish
            </button>
            <button 
              onClick={() => {
                database.delete('formSchema', row => 
                  row.seriesId === schema.seriesId &&
                row.revision === schema.revision
                );
                setRemoteChanges(true);
              }}
            >
              Delete
            </button>
          </> : <>
            <button>Revise</button>
          </>
          }
          <hr/>
        </div>)}
    </div>
  );
}

