// src/types/glam.ts

// Asegúrate de que GLAMFilter tenga los operadores correctos
export interface GLAMFilter {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'
  value: string | number | boolean
}

// El resto de tus tipos permanece igual
export interface GLAMRecord {
  id: string
  identifier?: string
  title: string
  description?: string
  type: string
  institution?: string
  collectionId?: string
  date?: string
  creator?: string | string[]
  format?: string
  language?: string
  rights?: string
  subject?: string[]
  imageUrl?: string
  thumbnailUrl?: string
  sourceUrl?: string
  metadata?: Record<string, any>
  
  // Campos adicionales que se incluyen con with_labels=1
  type_label?: string
  institution_label?: string
  collection_label?: string
  format_label?: string
  language_label?: string
  subject_labels?: string[]
  [key: string]: any // Permitir otros campos dinámicos
}

export interface GLAMCollection {
  id: string
  identifier?: string
  name: string
  title: string
  description?: string
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

export interface GLAMSearchOptions {
  query?: string
  type?: string
  institution?: string
  collection?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  filters?: GLAMFilter[]
  withLabels?: boolean
}
/**
 * Estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'