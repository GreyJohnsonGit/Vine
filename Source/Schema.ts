export type FormSchema = {
  // Form Schema Definition
  seriesId: string; // Series ID
  revision: number; // Series Revision
  name: string; // Schema Name
  description: string; // Schema Description
}

export type FormSchemaField = {
  // Link to Schema
  schemaSeriesId: string; // Schema Series ID
  schemaRevision: number; // Schema Series Revision

  // Field Definition
  id: string; // Field ID
  page: number; // Page Number
  name: string; // Field Name
  description: string; // Field Description
  type: string; // Field Type
  required: boolean; // Field Required
}

export type Form = {
  // Link to Schema
  schemaSeriesId: string; // Schema Series ID
  schemaRevision: number; // Schema Series Revision
  
  // Form Metadata
  seriesId: string; // Series ID
  revision: number; // Series Revision
  name: string; // Form Name
  description: string; // Form Description
}

export type FormField = {
  // Link to Form
  formSeriesId: string; // Form Series ID
  formRevision: number; // Form Series Revision
  
  // Link to Field
  fieldSchemaId: string; // Field ID

  // Field Value
  value: string; // Field Value
}