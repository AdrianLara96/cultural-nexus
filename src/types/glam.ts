// src/types/glam.ts

export interface GLAMRecord {
  id: string
  title: string
  author?: string
  description?: any
  date?: string
  thumbnailUrl?: string
  collection_id?: string | number | null
  collection_ids?: string[]
  collection_title?: string | null
  collection_titles?: string | string [] | null
  collections_titles?: string[]
  type?: string | null
  type_label?: string | null
  resource_class?: [string, string] | null
  metadata_fields?: Record<string, any> | null
  identifier?: string
  institution?: string
  creator?: string | string[]
  format?: string
  language?: string
  rights?: string
  subject?: string[]
  imageUrl?: string
  sourceUrl?: string
  metadata?: Record<string, any>
  institution_label?: string
  collection_label?: string
  format_label?: string
  language_label?: string
  subject_labels?: string[]
  [key: string]: any // Permitir otros campos dinámicos
}

export interface GLAMCollection {
  id: string | number
  title?: string
  name?: string
  parent_id?: [number, string]
  parent?: [number, string]
  description?: string
  thumbnail?: string
  thumbnail_media?: [number, string]
  thumbnail_media_id?: [number, string]
  identifier?: string
  institution?: string
  itemCount?: number
  records?: GLAMRecord[]
  type?: string
  date?: string
  metadata?: Record<string, any>
  
  // Campos adicionales que se incluyen con with_labels=1
  type_label?: string
  institution_label?: string
  [key: string]: any // Permitir otros campos dinámicos
}

export interface GLAMApiResponse<T> {
  items: T[]
  total?: number
  page?: number
  pageSize?: number
  hasNext?: boolean
  hasPrevious?: boolean
  // Puede incluir información adicional con with_labels=1
  labels_info?: Record<string, any>
}

export interface GLAMFilter {
  id?: string
  field: string | null
  operator: 'contains' | 'eq' | '=' | 'startsWith' | 'isEmpty' | 'notEmpty' | 'gt' | 'lt' | '!=' | '>=' | '<=' | 'in' | 'like'
  value: string | number | boolean
}

export interface GLAMSearchOptions {
  query?: string
  page?: number
  pageSize?: number
  filters?: GLAMFilter[]
  scope?: 'records' | 'collections' | 'all'
  combine?: 'AND' | 'OR'
  withLabels?: boolean
  [key: string]: any
  type?: string
  institution?: string
  collection?: string
  dateFrom?: string
  dateTo?: string
}

export interface GLAMSearchResult {
  records: {
    items: GLAMRecord[]
    total?: number
  }
  collections: {
    items: GLAMCollection[]
    total?: number
  }
}
/**
 * Estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'