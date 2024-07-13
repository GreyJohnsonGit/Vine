import { useReducer } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { FormSchemaField } from '../Database/Schema.ts';
import { useLibrary } from './LibraryContext.tsx';

export function CreateSchemaField() {
  const { database, save } = useLibrary();
  const [schemaField, updateSchemaField] = useReducer(
    (state: FormSchemaField, updates: Partial<FormSchemaField>) => 
      ({...state, ...updates}), 
    defaultFieldSchema()
  );
  
  return <div>
    <h4>New Schema Field</h4>
    <div>
      <label>Schema Series Id</label>
      <input 
        value={schemaField.schemaSeriesId}
        onChange={e => updateSchemaField({ schemaSeriesId: e.target.value })}
      />

      <label>Schema Revision</label>
      <input 
        type='number'
        value={schemaField.schemaRevision}
        onChange={e => 
          updateSchemaField({ schemaRevision: parseInt(e.target.value) })
        }
      />

      <label>Name</label>
      <input 
        value={schemaField.name}
        onChange={e => updateSchemaField({ name: e.target.value })}
      />

      <label>Description</label>
      <input 
        value={schemaField.description}
        onChange={e => updateSchemaField({ description: e.target.value })}
      />

      <label>Type</label>
      <br/>
      <label>Text</label>
      <input 
        type='radio' 
        name="site_name"
        value={'text'}
        checked={schemaField.type === 'text'}
        onChange={() => updateSchemaField({ type: 'text' })}
      />
      <label>Paragraph</label>
      <input 
        type='radio' 
        name="site_name"
        value={'paragraph'}
        checked={schemaField.type === 'paragraph'}
        onChange={() => updateSchemaField({ type: 'paragraph' })}
      />
      <label>Email</label>
      <input 
        type='radio' 
        name="email"
        value={'email'}
        checked={schemaField.type === 'email'}
        onChange={() => updateSchemaField({ type: 'email' })}
      />
      <br/>

      <label>Page</label>
      <input 
        type='number'
        value={schemaField.page}
        onChange={e => updateSchemaField({ page: parseInt(e.target.value) })}
      />

      <label>Required</label>
      <input 
        type='checkbox'
        checked={schemaField.required}
        onChange={e => updateSchemaField({ required: e.target.checked })}
      />

      <button onClick={() => {
        database.create('formSchemaField', schemaField);
        save();
      }}>
        Save
      </button>
    </div>
  </div>;
}

function defaultFieldSchema(): FormSchemaField {  
  return {
    schemaSeriesId: '',
    schemaRevision: 0,
    id: uuidV4(),
    page: 0,
    weight: 0,
    name: '',
    description: '',
    type: 'text',
    required: false
  };
}