// src/services/glam-api.ts

import { SITE_ID, API_CONFIG } from '@/config/site'
import type {
  GLAMRecord,
  GLAMCollection,
  GLAMApiResponse,
  GLAMSearchOptions,
  GLAMFilter,
} from '@/types/glam'

/**
 * Construye la URL completa para un endpoint
 */
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  // Limpiar espacios en blanco
  const cleanEndpoint = endpoint.trim()
  
  // Si es una URL absoluta, usarla directamente
  if (cleanEndpoint.startsWith('http://') || cleanEndpoint.startsWith('https://')) {
    return cleanEndpoint
  }
  
  // Si es una ruta relativa, devolverla tal cual (el proxy de Vite la manejará)
  return cleanEndpoint
}

/**
 * Cliente HTTP para la API GLAM
 */
class GLAMApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = API_CONFIG.glam
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  private async request<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    // Construir URL base
    const baseUrl = buildUrl(endpoint)
    
    // Construir URL completa con parámetros
    let url = baseUrl
    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => {
          if (key === 'filters') {
            return `${key}=${encodeURIComponent(JSON.stringify(value))}`
          }
          return `${key}=${encodeURIComponent(String(value))}`
        })
        .join('&')
      
      url = `${baseUrl}?${queryString}`
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      console.log('🔍 GLAM API Request:', url)
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        throw new Error(`API Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ GLAM API Response:', data)
      return data
    } catch (error) {
      console.error('❌ GLAM API Error:', error)
      throw error
    }
  }

  /**
   * Obtiene una lista de records/ítems
   * Incluye automáticamente el filtro por SITE_ID
   */
  async getRecords(
    options?: GLAMSearchOptions
  ): Promise<GLAMApiResponse<GLAMRecord>> {
    // Filtro por sitio (SITE_ID)
    const siteFilter: GLAMFilter = {
      field: 'sites',
      operator: '=',
      value: SITE_ID,
    }

    // Combina los filtros del usuario con el filtro del sitio
    const combinedFilters = [
      siteFilter,
      ...(options?.filters || []),
    ]

    const params: Record<string, any> = {
      page: options?.page || 1,
      page_size: options?.pageSize || 20,
      q: options?.query,
      type: options?.type,
      institution: options?.institution,
      collection: options?.collection,
      date_from: options?.dateFrom,
      date_to: options?.dateTo,
      filters: combinedFilters,
    }

    return this.request<GLAMApiResponse<GLAMRecord>>('/api/glam/record', params)
  }

  /**
   * Obtiene un record específico por ID
   */
  async getRecordById(id: string): Promise<GLAMRecord> {
    return this.request<GLAMRecord>(`/api/glam/record/${id}`)
  }

  /**
   * Obtiene una lista de colecciones
   * Incluye automáticamente el filtro por SITE_ID
   */
  async getCollections(
    options?: GLAMSearchOptions
  ): Promise<GLAMApiResponse<GLAMCollection>> {
    // Filtro por sitio (SITE_ID)
    const siteFilter: GLAMFilter = {
      field: 'sites',
      operator: '=',
      value: SITE_ID,
    }

    // Combina los filtros del usuario con el filtro del sitio
    const combinedFilters = [
      siteFilter,
      ...(options?.filters || []),
    ]

    const params: Record<string, any> = {
      page: options?.page || 1,
      page_size: options?.pageSize || 20,
      q: options?.query,
      institution: options?.institution,
      filters: combinedFilters,
    }

    return this.request<GLAMApiResponse<GLAMCollection>>('/api/glam/collection', params)
  }

  /**
   * Obtiene una colección específica por ID
   */
  async getCollectionById(id: string): Promise<GLAMCollection> {
    return this.request<GLAMCollection>(`/api/glam/collection/${id}`)
  }

  /**
   * Busca records y colecciones simultáneamente
   */
  async searchAll(
    query: string,
    options?: Omit<GLAMSearchOptions, 'query'>
  ): Promise<{
    records: GLAMApiResponse<GLAMRecord>
    collections: GLAMApiResponse<GLAMCollection>
  }> {
    const [records, collections] = await Promise.all([
      this.getRecords({ ...options, query }),
      this.getCollections({ ...options, query }),
    ])

    return { records, collections }
  }
}

// Exportamos una instancia singleton del cliente
export const glamApi = new GLAMApiClient()

// Exportamos métodos directamente para uso más sencillo
export const getRecords = (options?: GLAMSearchOptions) => 
  glamApi.getRecords(options)

export const getRecordById = (id: string) => 
  glamApi.getRecordById(id)

export const getCollections = (options?: GLAMSearchOptions) => 
  glamApi.getCollections(options)

export const getCollectionById = (id: string) => 
  glamApi.getCollectionById(id)

export const searchAll = (
  query: string,
  options?: Omit<GLAMSearchOptions, 'query'>
) => glamApi.searchAll(query, options)