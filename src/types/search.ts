// src/types/search.ts
import type { GLAMFilter, GLAMCollection } from './glam'

// Payload de búsqueda avanzado (compartido entre todos los componentes)
export interface SearchPayload {
  scope: 'records' | 'collections' | 'all'
  query?: string
  combine?: 'AND' | 'OR'
  rules?: GLAMFilter[]
}

// Colección simplificada para dropdowns
export interface CollectionOption {
  id: string | number
  title: string
}

// Helper para convertir GLAMCollection a CollectionOption
export function toCollectionOptions(collections: GLAMCollection[]): CollectionOption[] {
  return collections
    .filter(c => c.id && c.title)
    .map(c => ({
      id: c.id,
      title: c.title!
    }))
}