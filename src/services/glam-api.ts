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
 * Transforma un objeto raw de la API GLAM a GLAMRecord con campos mapeados
 */
function mapRawRecordToGLAMRecord(rawRecord: any): GLAMRecord {
  return {
    id: rawRecord.id,
    title: rawRecord.title,
    description: rawRecord.description,
    date: rawRecord.date,
    creator: rawRecord.author,
    imageUrl: rawRecord.thumbnail,
    collection_title: rawRecord.collection_title,
    author: rawRecord.author,
    children: rawRecord.children,
    collection_id: rawRecord.collection_id,
    collections: rawRecord.collections,
    collections_titles: rawRecord.collections_titles,
    commit_message: rawRecord.commit_message,
    groups: rawRecord.groups,
    is_archived: rawRecord.is_archived,
    last_commit_message: rawRecord.last_commit_message,
    last_version_number: rawRecord.last_version_number,
    media_items: rawRecord.media_items,
    messages: rawRecord.messages,
    metadata_fields: rawRecord.metadata_fields,
    metadata_fields_order: rawRecord.metadata_fields_order,
    ocr_data: rawRecord.ocr_data,
    ontology_versions: rawRecord.ontology_versions,
    owner_user_id: rawRecord.owner_user_id,
    parent: rawRecord.parent,
    parents: rawRecord.parents,
    published: rawRecord.published,
    resource_class: rawRecord.resource_class,
    resource_class_id: rawRecord.resource_class_id,
    sites: rawRecord.sites,
    template: rawRecord.template,
    template_id: rawRecord.template_id,
    thumbnail: rawRecord.thumbnail,
    thumbnail_attachment: rawRecord.thumbnail_attachment,
    thumbnail_attachment_id: rawRecord.thumbnail_attachment_id,
    thumbnail_media: rawRecord.thumbnail_media,
    thumbnail_media_id: rawRecord.thumbnail_media_id,
    type: rawRecord.type,
    versions: rawRecord.versions,
  }
}

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
        // ✅ Añadido: value !== '' para filtrar strings vacíos
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
          if (key === 'filters') {
            return `${key}=${encodeURIComponent(JSON.stringify(value))}`
          }
          return `${key}=${encodeURIComponent(String(value))}`
        })
        .join('&')
      
      // ✅ Solo añadir ? si hay queryString
      if (queryString) {
        url = `${baseUrl}?${queryString}`
      }
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
  // En GLAMApiClient.getRecords() - Reemplaza TODO el método con esto:

async getRecords(
  options?: GLAMSearchOptions
  ): Promise<GLAMApiResponse<GLAMRecord>> {
    // Filtro por sitio (SITE_ID)
    const siteFilter: GLAMFilter = {
      field: 'sites',
      operator: '=',
      value: SITE_ID,
    }

    // ✅ NUEVO: Si hay query, convertirlo en filtro por título
    const searchFilters: GLAMFilter[] = []
    if (options?.query?.trim()) {
      searchFilters.push({
        field: 'title',
        operator: 'contains',
        value: options.query.trim()
      })
    }

    // Combina todos los filtros: site + search + user filters
    const combinedFilters = [
      siteFilter,
      ...searchFilters,
      ...(options?.filters || []),
    ]

    const params: Record<string, any> = {
      page: options?.page || 1,
      page_size: options?.pageSize || 20,
      filters: combinedFilters,  // ✅ Ya incluye todo
      with_labels: 1,
      // ✅ NO añadir params.q - usamos filtros en su lugar
    }

    // Limpiar undefined/null/empty antes de enviar
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key]
      }
    })

    const response = await this.request<any>('/api/glam/record', params)
    
    return {
      items: response.items?.map(mapRawRecordToGLAMRecord) || [],
      total: response.total || 0,
      page: response.page,
      pageSize: response.pageSize,
      hasNext: response.hasNext,
      hasPrevious: response.hasPrevious,
    }
  }

  /**
   * Obtiene un record específico por ID
   */
  async getRecordById(id: string): Promise<GLAMRecord> {
    const rawRecord = await this.request<any>(`/api/glam/record/${id}`, { with_labels: 1 })
    return mapRawRecordToGLAMRecord(rawRecord)
  }

  /**
   * Obtiene una lista de colecciones
   * Incluye automáticamente el filtro por SITE_ID
   */
  // En GLAMApiClient.getCollections() - Reemplaza TODO el método con esto:

async getCollections(
  options?: GLAMSearchOptions
  ): Promise<GLAMApiResponse<GLAMCollection>> {
    // Filtro por sitio (SITE_ID)
    const siteFilter: GLAMFilter = {
      field: 'sites',
      operator: '=',
      value: SITE_ID,
    }

    // ✅ NUEVO: Si hay query, convertirlo en filtro por título
    const searchFilters: GLAMFilter[] = []
    if (options?.query?.trim()) {
      searchFilters.push({
        field: 'title',  // o 'name' si tu API usa ese campo para colecciones
        operator: 'contains',
        value: options.query.trim()
      })
    }

    // Combina todos los filtros
    const combinedFilters = [
      siteFilter,
      ...searchFilters,
      ...(options?.filters || []),
    ]

    const params: Record<string, any> = {
      page: options?.page || 1,
      page_size: options?.pageSize || 20,
      filters: combinedFilters,
      with_labels: 1,
    }

    // Limpiar undefined/null/empty
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key]
      }
    })

    return this.request<GLAMApiResponse<GLAMCollection>>('/api/glam/collection', params)
  }

  /**
   * Obtiene una colección específica por ID
   */
  async getCollectionById(id: string): Promise<GLAMCollection> {
    return this.request<GLAMCollection>(`/api/glam/collection/${id}`, { with_labels: 1 })
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

// Añadimos funciones de búsqueda
export async function searchRecordsAndCollections(
  query: string,
  options: GLAMSearchOptions = {}
): Promise<{
  records: GLAMApiResponse<GLAMRecord>,
  collections: GLAMApiResponse<GLAMCollection>
}> {
  const [records, collections] = await Promise.all([
    getRecords({ ...options, query }),
    getCollections({ ...options, query })
  ])
  
  return { records, collections }
}

export async function searchByFilters(
  filters: GLAMFilter[],
  options: Omit<GLAMSearchOptions, 'filters'> = {}
): Promise<{
  records: GLAMApiResponse<GLAMRecord>,
  collections: GLAMApiResponse<GLAMCollection>
}> {
  const recordsOptions = { ...options, filters }
  const collectionsOptions = { ...options, filters }
  
  const [records, collections] = await Promise.all([
    getRecords(recordsOptions),
    getCollections(collectionsOptions)
  ])
  
  return { records, collections }
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

// src/services/glam-api.ts

export const searchAllService = async (
  query: string, 
  options?: Omit<GLAMSearchOptions, 'query'>
) => {
  // ✅ Solo pasar query si tiene contenido real
  const queryParam = query?.trim() || undefined
  
  const [records, collections] = await Promise.all([
    getRecords({ ...options, query: queryParam }),
    getCollections({ ...options, query: queryParam }),
  ])

  return { records, collections }
}

// Cache global de colecciones por nombre
const collectionsCache = new Map<string, GLAMCollection>()
const collectionsByIdCache = new Map<number | string, GLAMCollection>()

// Obtener todas las colecciones (para hacer lookup por nombre)
export async function getAllCollections(): Promise<GLAMCollection[]> {
  try {
    const response = await fetch('/api/glam/collection?page_size=100&with_labels=1')
    const data = await response.json()
    return data.items || data || []
  } catch (error) {
    console.error('Error fetching all collections:', error)
    return []
  }
}

// Buscar colección por nombre exacto
export function findCollectionByName(name: string): GLAMCollection | undefined {
  const normalizedName = name.toLowerCase().trim()
  
  // Buscar en cache
  for (const [key, collection] of collectionsCache.entries()) {
    if (key === normalizedName) {
      return collection
    }
  }
  
  return undefined
}

// Cargar colecciones en cache
export async function loadCollectionsCache(): Promise<void> {
  if (collectionsCache.size > 0) return // Ya cargado
  
  const collections = await getAllCollections()
  collections.forEach(col => {
    const name = (col.name || col.title || '').toLowerCase().trim()
    if (name) {
      collectionsCache.set(name, col)
      collectionsByIdCache.set(col.id, col)
    }
  })
}

// Obtener colección por ID
export async function getCollectionById(id: string | number): Promise<GLAMCollection> {
  // Check cache first
  if (collectionsByIdCache.has(id)) {
    return collectionsByIdCache.get(id)!
  }
  
  const response = await fetch(`/api/glam/collection/${id}?with_labels=1`)
  const data = await response.json()
  
  // Cache it
  collectionsByIdCache.set(id, data)
  const name = (data.name || data.title || '').toLowerCase().trim()
  if (name) {
    collectionsCache.set(name, data)
  }
  
  return data
}