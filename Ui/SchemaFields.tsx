import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLibrary } from './LibraryContext.js';

export interface SchemaFieldsProps {
  setPage: (page: string) => void;
}

export function SchemaFields({ setPage }: SchemaFieldsProps) {
  const { database } = useLibrary();
  const [remoteChanges, setRemoteChanges] = useState(false);

  useEffect(() => {
    if (remoteChanges === true) {
      axios.post(
        'http://localhost:5052/save/', 
        database.toJson()
      );
    }
    setRemoteChanges(false);
  }, [remoteChanges, database]);

  const readFormSchemaFields = database.read('formSchemaField', () => true);
  if (readFormSchemaFields.isErr()) {
    console.error(readFormSchemaFields.error);
    throw new Error(readFormSchemaFields.error);
  }
  const formSchemaFields = readFormSchemaFields.value;

  return (
    <div>
      <h4>Schema Fields</h4>
      <button onClick={() => setPage('createNewSchemaField')}>
        Create New Schema Fields
      </button>
      {formSchemaFields
        .sort((a, b) => a.weight - b.weight)
        .map(field => 
          <div key={
            `${field.schemaSeriesId}-` +
            `${field.schemaRevision}-`+
            `${field.id}`
          }>
            <table>
              <thead>
                <tr>
                  <th>
                    {field.name} 
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{field.description}</td>
                </tr>
              </tbody>
            </table>
            <button>Update</button>
            <button>
              Delete
            </button>
            <hr/>
          </div>)}
    </div>
  );
}

