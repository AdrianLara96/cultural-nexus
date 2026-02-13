// src/types/glam.ts

/**
 * Interfaz para un ítem/record GLAM
 */
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
}

/**
 * Interfaz para una colección GLAM
 */
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
}

/**
 * Interfaz para la respuesta paginada de la API
 */
export interface GLAMApiResponse<T> {
  items: T[]
  total?: number
  page?: number
  pageSize?: number
  hasNext?: boolean
  hasPrevious?: boolean
}

/**
 * Opciones de búsqueda/filtros
 */
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
}

/**
 * Filtro para la API GLAM
 */
export interface GLAMFilter {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'like'
  value: string | number | boolean
}

/**
 * Estados de carga
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'