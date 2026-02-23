// src/composables/useGlam.ts

import { ref, computed } from 'vue'
import {
  getRecords,
  getRecordById,
  getCollections,
  getCollectionById,
  searchAll,
} from '@/services/glam-api'
import type {
  GLAMRecord,
  GLAMCollection,
  GLAMApiResponse,
  GLAMSearchOptions,
  LoadingState,
} from '@/types/glam'

export function useGlam() {
  // Estados de carga
  const recordsState = ref<LoadingState>('idle')
  const collectionsState = ref<LoadingState>('idle')
  const searchState = ref<LoadingState>('idle')

  // Datos
  const records = ref<GLAMRecord[]>([])
  const collections = ref<GLAMCollection[]>([])
  const currentRecord = ref<GLAMRecord | null>(null)
  const currentCollection = ref<GLAMCollection | null>(null)

  // Errores
  const error = ref<string | null>(null)

  // Total de items
  const totalRecords = ref<number>(0)
  const totalCollections = ref<number>(0)

  /**
   * Carga records desde la API
   * Incluye automáticamente el filtro por SITE_ID
   */
  async function loadRecords(options?: GLAMSearchOptions) {
    try {
      recordsState.value = 'loading'
      error.value = null

      const optionsWithLabels = {
        ...options,
        withLabels: true
      }

      const response = await getRecords(options)
      records.value = response.items || []
      totalRecords.value = response.total || response.items?.length || 0

      recordsState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading records'
      recordsState.value = 'error'
      console.error('Error loading records:', err)
    }
  }

  /**
   * Carga colecciones desde la API
   * Incluye automáticamente el filtro por SITE_ID
   */
  async function loadCollections(options?: GLAMSearchOptions) {
    try {
      collectionsState.value = 'loading'
      error.value = null

      const optionsWithLabels = {
        ...options,
        withLabels: true
      }

      const response = await getCollections(options)
      collections.value = response.items || []
      totalCollections.value = response.total || response.items?.length || 0

      collectionsState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading collections'
      collectionsState.value = 'error'
      console.error('Error loading collections:', err)
    }
  }

  /**
   * Carga un record específico por ID
   */
  async function loadRecordById(id: string) {
    try {
      recordsState.value = 'loading'
      error.value = null

      currentRecord.value = await getRecordById(id)
      recordsState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading record'
      recordsState.value = 'error'
      console.error('Error loading record by ID:', err)
    }
  }

  /**
   * Carga una colección específica por ID
   */
  async function loadCollectionById(id: string) {
    try {
      collectionsState.value = 'loading'
      error.value = null

      currentCollection.value = await getCollectionById(id)
      collectionsState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading collection'
      collectionsState.value = 'error'
      console.error('Error loading collection by ID:', err)
    }
  }

  /**
   * Busca records y colecciones simultáneamente
   */
  async function search(query: string, options?: Omit<GLAMSearchOptions, 'query'>) {
    try {
      searchState.value = 'loading'
      error.value = null

      const optionsWithLabels = {
        ...options,
        withLabels: true
      }

      const result = await searchAll(query, options)
      records.value = result.records.items || []
      collections.value = result.collections.items || []
      totalRecords.value = result.records.total || 0
      totalCollections.value = result.collections.total || 0

      searchState.value = 'success'
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error searching'
      searchState.value = 'error'
      console.error('Error searching:', err)
    }
  }

  /**
   * Reset del estado
   */
  function reset() {
    records.value = []
    collections.value = []
    currentRecord.value = null
    currentCollection.value = null
    error.value = null
    recordsState.value = 'idle'
    collectionsState.value = 'idle'
    searchState.value = 'idle'
  }

  // Estados computados
  const isLoading = computed(() => 
    recordsState.value === 'loading' || 
    collectionsState.value === 'loading' ||
    searchState.value === 'loading'
  )

  const hasError = computed(() => error.value !== null)

  return {
    // Datos
    records,
    collections,
    currentRecord,
    currentCollection,
    totalRecords,
    totalCollections,

    // Estados
    recordsState,
    collectionsState,
    searchState,
    isLoading,
    hasError,
    error,

    // Métodos
    loadRecords,
    loadCollections,
    loadRecordById,
    loadCollectionById,
    search,
    reset,
  }
}