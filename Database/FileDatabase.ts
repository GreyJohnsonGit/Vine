import FileSystemSync from 'fs';
import {
  Err,
  Ok,
  Result
} from './Result.ts';
import {
  Form,
  FormField,
  FormSchema,
  FormSchemaField
} from './Schema.ts';

export interface IFileDatabase {
  toFileSync(path: string): Result<void, FileSaveError>;
  toJson(): Tables;

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

  delete(
    tableId: 'formSchema',
    query: (row: FormSchema) => boolean
  ): Result<void, NotFoundError>;
  delete(
    tableId: TableId,
    query: (row: unknown) => boolean
  ): Result<void, NotFoundError>;

  publish<T extends TableId>(
    tableId: T,
    query: (row: Tables[T][0]) => boolean
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
      formField: [],
    });
  }
  
  static fromJson(data: Tables): FileDatabase {
    return new FileDatabase(data);
  }

  static fromFileSync(path: string): Result<
    FileDatabase, 
    FileNotFoundError | FileParseError | FileValidationError
  > {
    let fileData: string;
    try {
      fileData = FileSystemSync.readFileSync(path, 'utf-8');
    } catch (_error) {
      return Err.of({ type: 'FileNotFoundError', path });
    }
    
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(fileData);
    } catch (error) {
      const message = (error as Error)?.message ?? 'Unknown error';
      return Err.of({ type: 'FileParseError', message });
    }

    let data: Tables;
    try {
      // TODO: Validate data
      data = parsedData as Tables;
    } catch (error) {
      const message = (error as Error)?.message ?? 'Unknown error';
      return Err.of({ type: 'FileValidationError', message });
    }

    return Ok.of(new FileDatabase(data));
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
      return Err.of({ type: 'FileSaveError', message });
    }

    return Ok.void();
  }

  toJson(): Tables {
    return this.#table;
  }

  read(
    tableId: 'formSchema',
    query: (row: FormSchema) => boolean
  ): Result<FormSchema[], never>;
  read<T extends TableId>(
    tableId: T,
    query: (row: Tables[T][0]) => boolean
  ): Result<unknown[], never> {
    if (tableId === 'formSchema') {
      return Ok.of(this.#table.formSchema.filter(query));
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
          return Err.of({
            type: 'PrimaryKeyError',
            message: `${tableId}: ${formSchema.seriesId}/${formSchema.revision}`
          });
        }
      }

      this.#table.formSchema.push(formSchema);
      return Ok.void();
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
        return Err.of({
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
      return Ok.void();
    }

    throw new Error('Not implemented');
  }

  delete(
    tableId: 'formSchema',
    query: (row: FormSchema) => boolean
  ): Result<void, NotFoundError>;
  delete<T extends TableId>(
    tableId: T,
    query: (row: Tables[T][0]) => boolean
  ): Result<void, NotFoundError> {
    if (tableId === 'formSchema') {
      const rows = this.#table.formSchema.filter(query);
      if (rows.length === 0) {
        return Err.of({
          type: 'NotFoundError',
          message: 'No rows found'
        });
      }

      this.#table.formSchema = this.#table.formSchema
        .filter(row => !query(row));
      return Ok.void();
    }

    throw new Error('Not implemented');
  }

  publish<T extends TableId>(
    tableId: T,
    query: (row: Tables[T][0]) => boolean
  ): Result<void, NotFoundError> {
    if (tableId === 'formSchema') {
      const rows = this.#table.formSchema.filter(query);
      if (rows.length === 0) {
        return Err.of({
          type: 'NotFoundError',
          message: 'No rows found'
        });
      }

      for (const row of rows) {
        row.isDraft = false;
      }

      return Ok.void();
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