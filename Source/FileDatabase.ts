import { 
  Err, 
  Ok, 
  Result 
} from './Result.ts';
import { 
  FormField, 
  FormSchemaField, 
  FormSchema, 
  Form 
} from './Schema.ts';
import FileSystemSync from 'fs';

export interface IFileDatabase {
  toFileSync(path: string): Result<void, FileSaveError>;

  read(
    tableId: 'formSchema',
    query: (row: FormSchema) => boolean
  ): Result<FormSchema[], never>;
  read(
    tableId: TableId,
    query: (row: unknown) => boolean
  ): Result<unknown[], never>;

  create(
    tableId: 'formSchema', 
    data: FormSchema
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: 'formSchemaField', 
    data: FormSchemaField
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: 'form', 
    data: Form
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: 'formField', 
    data: FormField
  ): Result<void, PrimaryKeyError | ForeignKeyError>;

  revise(
    tableId: 'formSchema', 
    data: Partial<Omit<FormSchema, 'revision'>>
  ): Result<void, NotFoundError>;
  revise(
    tableId: TableId,
    data: unknown
  ): Result<void, NotFoundError>;
}

export class FileDatabase implements IFileDatabase {
  #table: Tables;

  private constructor(table: Tables) {
    this.#table = table;
  }

  static new(): FileDatabase {
    return new FileDatabase({
      formSchema: [],
      formSchemaField: [],
      form: [],
      formField: []
    });
  }
  
  static fromFileSync(path: string): Result<
    FileDatabase, 
    FileNotFoundError | FileParseError | FileValidationError
  > {
    let fileData: string;
    try {
      fileData = FileSystemSync.readFileSync(path, 'utf-8');
    } catch (error) {
      return Err({ type: 'FileNotFoundError', path });
    }
    
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(fileData);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Unknown error';
      return Err({ type: 'FileParseError', message });
    }

    let data: Tables;
    try {
      // TODO: Validate data
      data = parsedData as Tables;
    } catch (error) {
      const message = (error as Error)?.message ?? 'Unknown error';
      return Err({ type: 'FileValidationError', message });
    }

    return Ok(new FileDatabase(data));
  }

  toFileSync(path: string): Result<void, FileSaveError> {
    try {
      FileSystemSync.writeFileSync(
        path, 
        JSON.stringify(this.#table, null, 2),
        { }
      );
    } catch (error) {
      const message = (error as Error)?.message ?? 'Unknown error';
      return Err({ type: 'FileSaveError', message });
    }

    return Ok(undefined);
  }

  read(
    tableId: 'formSchema',
    query: (row: FormSchema) => boolean
  ): Result<FormSchema[], never>;
  read(
    tableId: TableId,
    query: unknown
  ): Result<unknown[], never> {
    if (tableId === 'formSchema') {
      const rows = this.#table.formSchema
        .filter(query as ((row: FormSchema) => boolean));
      return Ok(rows);
    }

    throw new Error('Not implemented');
  }

  create(
    tableId: 'formSchema', 
    data: FormSchema
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: 'formSchemaField', 
    data: FormSchemaField
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: 'form', 
    data: Form
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: 'formField', 
    data: FormField
  ): Result<void, PrimaryKeyError | ForeignKeyError>;
  create(
    tableId: TableId, 
    data: unknown
  ): Result<void, PrimaryKeyError | ForeignKeyError> {
    switch (tableId) {
    case 'formSchema': {
      const formSchema = data as FormSchema;
      for (const row of this.#table.formSchema) {
        const sameSeriesId = row.seriesId === formSchema.seriesId;
        const sameRevision = row.revision === formSchema.revision;
        const primaryKeyViolation = sameSeriesId && sameRevision;
        if (primaryKeyViolation) {
          return Err({
            type: 'PrimaryKeyError',
            message: `${tableId}: ${formSchema.seriesId}/${formSchema.revision}`
          });
        }
      }

      this.#table.formSchema.push(formSchema);
      return Ok(undefined);
    }

    case 'formSchemaField': {
      throw new Error('Not implemented');
    }

    case 'form': {
      throw new Error('Not implemented');
    }

    case 'formField': {
      throw new Error('Not implemented');
    }

    default: throw new Error(`Unknown tableId: ${tableId}`);
    }
  }

  revise(
    tableId: 'formSchema', 
    data: Partial<Omit<FormSchema, 'revision'>>
  ): Result<void, NotFoundError>;
  revise(
    tableId: TableId, 
    data: unknown
  ): Result<void, NotFoundError> {
    if (tableId === 'formSchema') {
      const revision = data as Partial<Omit<FormSchema, 'revision'>>;
      const { seriesId } = revision;
      const previousRevision = this.#table.formSchema
        .filter(row => row.seriesId === seriesId)
        .sort((a, b) => a.revision - b.revision)
        .at(-1);

      if (previousRevision === undefined) {
        return Err({
          type: 'NotFoundError',
          message: `Form Schema, '${seriesId}', Not found`
        });
      }

      const nextRevision = { 
        ...previousRevision, 
        ...revision, 
        revision: previousRevision.revision + 1 
      };

      this.#table.formSchema.push(nextRevision);
      return Ok(undefined);
    }

    throw new Error('Not implemented');
  }
}

export type Tables = {
  formSchema: FormSchema[];
  formSchemaField: FormSchemaField[];
  form: Form[];
  formField: FormField[];
};

export type TableId = keyof Tables;

export type FileNotFoundError = {
  type: 'FileNotFoundError';
  path: string;
};

export type FileParseError = {
  type: 'FileParseError';
  message: string;
};

export type FileValidationError = {
  type: 'FileValidationError';
  message: string;
};

export type FileSaveError = {
  type: 'FileSaveError';
  message: string;
};

export type PrimaryKeyError = {
  type: 'PrimaryKeyError';
  message: string;
};

export type ForeignKeyError = {
  type: 'ForeignKeyError';
  message: string;
};

export type NotFoundError = {
  type: 'NotFoundError';
  message: string;
};