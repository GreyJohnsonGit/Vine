import { useReducer } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { FormSchema } from '../Database/Schema.ts';
import { useLibrary } from './LibraryContext.tsx';

export function CreateSchema() {
  const { database, save } = useLibrary();
  const [newSchema, updateNewSchema] = useReducer((
    state: FormSchema, 
    updates: Partial<FormSchema>
  ) => ({...state, ...updates}), 
  defaultSchema());
  
  const clearNewSchema = () => updateNewSchema(defaultSchema());

  return <div>
    <h4>New Schema</h4>
    <div>
      <u>Name</u><br/>
      <input 
        value={newSchema.name} 
        onChange={event => updateNewSchema({ 
          name: event.target.value,
        })}
      /><br/>

      <u>Description</u><br/>
      <textarea
        value={newSchema.description}
        onChange={event => updateNewSchema({ 
          description: event.target.value 
        })}
      /><br/>
        
      <u>Series Id</u><br/>
      <input
        value={newSchema.seriesId}
        readOnly
        style={{ backgroundColor: 'lightgray' }}
      /><br/>
        
      <u>Revision</u><br/>
      <input
        value={newSchema.revision}
        readOnly
        style={{ backgroundColor: 'lightgray' }}
      /><br/>

      <button onClick={() => {
        database.create('formSchema', newSchema);
        save();
        clearNewSchema();
      }}>
        Create
      </button>
    </div>
  </div>;
}

function defaultSchema(): FormSchema {  
  return {
    seriesId: uuidV4(),
    revision: 0,
    name: 'New Schema',
    description: 'Default Description',
    isDraft: true
  };
}