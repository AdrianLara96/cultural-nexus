<!-- src/views/SearchView.vue -->
<template>
  <v-container :key="$route.fullPath">
    <!-- Barra de búsqueda -->
    <SearchBar
      :fields="searchFields"
      :collections="collections"
      @do-basic-search="handleBasicSearch"
      @do-advanced-search="handleAdvancedSearch"
    />

    <!-- Loading -->
    <v-row v-if="isLoading" justify="center">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- Sin resultados -->
    <v-row v-else-if="!hasSearched" justify="center" class="mt-8">
      <v-col cols="12" class="text-center text-grey">
        <v-icon size="64" class="mb-4">mdi-magnify</v-icon>
        <p class="text-h6">Realiza una búsqueda para ver resultados</p>
      </v-col>
    </v-row>


    <!-- Resultados -->
    <v-row v-else>
      <!-- Records -->
      <v-col cols="12" v-if="hasSearched && searchScope !== 'collections' && records.length > 0">
        <h2 class="text-h6 text-primary mb-4">
          Registros ({{ totalRecords }})
        </h2>
        <v-row>
          <v-col 
            v-for="record in records" 
            :key="`record-${record.id}`" 
            cols="12" sm="6" md="4" lg="3"
            class="d-flex"
          >
            <RecordCard :record="record" color="surface" class="h-100 w-100"/>
          </v-col>
        </v-row>
      </v-col>

      <!-- Collections -->
      <v-col cols="12" v-if="hasSearched && searchScope !== 'records' && collections.length > 0">
        <h2 class="text-h6 text-primary mb-4">
          Colecciones ({{ totalCollections }})
        </h2>
        <v-row>
          <v-col 
            v-for="collection in collections" 
            :key="`collection-${collection.id}`" 
            cols="12" sm="6" md="4" lg="3"
            class="d-flex"
          >
            <CollectionCard :collection="collection" color="surface" class="h-100 w-100" />
          </v-col>
        </v-row>
      </v-col>

      <!-- Sin resultados encontrados -->
      <v-col v-if="records.length === 0 && collections.length === 0" cols="12" class="text-center">
        <v-alert type="info" variant="tonal" class="mt-4">
          No se encontraron resultados para tu búsqueda
        </v-alert>
      </v-col>

    </v-row>
  </v-container>
</template>

// En src/views/SearchResultsView.vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGlam } from '@/composables/useGlam'
import SearchBar from '@/components/search/SearchBar.vue'
import RecordCard from '@/components/glam/RecordCard.vue'
import CollectionCard from '@/components/glam/CollectionCard.vue'
import type { SearchPayload, CollectionOption } from '@/types/search'
import type { GLAMFilter } from '@/types/glam'

const route = useRoute()
const { records, collections, search: searchApi, isLoading } = useGlam()

const searchScope = ref<'records' | 'collections' | 'all'>('all')
const totalRecords = ref<number>(0)
const totalCollections = ref<number>(0)
const hasSearched = ref(false)

const searchFields = [
  { title: 'Título', value: 'title' },
  { title: 'Descripción', value: 'description' },
  { title: 'Creador', value: 'creator' },
  { title: 'Fecha', value: 'date' },
  { title: 'Tipo', value: 'type' }
]

// Función que ejecuta la búsqueda leyendo de la URL
async function executeSearchFromUrl() {
  const query = route.query.q as string
  const scope = (route.query.scope as 'records' | 'collections' | 'all') || 'all'
  const combine = (route.query.combine as 'AND' | 'OR') || 'AND'
  
  let rules: GLAMFilter[] | undefined
  if (route.query.rules) {
    try {
      rules = JSON.parse(route.query.rules as string)
    } catch (e) {
      console.error('Error parsing rules:', e)
      rules = undefined
    }
  }
  
  searchScope.value = scope
  hasSearched.value = true
  
  records.value = []
  collections.value = []
  
  try {
    const result = await searchApi(query || '', {
      scope,
      filters: rules,
      combine
    })
    totalRecords.value = result.records.total || 0
    totalCollections.value = result.collections.total || 0
  } catch (error) {
    console.error('Error en búsqueda:', error)
  }
}

function handleBasicSearch(query: string) {
  console.log('🔍 Búsqueda simple:', query)
}

function handleAdvancedSearch(payload: SearchPayload) {
  console.log('🔍 Búsqueda avanzada:', payload)
}

// Ejecutar búsqueda cuando cambia la URL
watch(
  () => route.fullPath,
  () => {
    if (route.query.q || route.query.rules) {
      executeSearchFromUrl()
    }
  },
  { immediate: true }
)

// También ejecuta al montar el componente
onMounted(() => {
  if (route.query.q || route.query.rules) {
    executeSearchFromUrl()
  }
})
</script>