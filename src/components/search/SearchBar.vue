<!-- src/components/search/SearchBar.vue -->

<template>
  <v-card class="search-container pa-4" elevation="2" color="secondary">
    <v-tabs v-model="tab" bg-color="primary" dark>
      <v-tab value="simple">Búsqueda Simple</v-tab>
      <v-tab value="advanced">Búsqueda Avanzada</v-tab>
    </v-tabs>

    <v-window v-model="tab" color="secondary">
      <!-- Búsqueda Simple -->
      <v-window-item value="simple">
        <v-form @submit.prevent="performSimpleSearch">
          <v-text-field
            v-model="simpleQuery"
            label="Buscar registros o colecciones..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            single-line
            variant="outlined"
            color=""
          ></v-text-field>
        </v-form>
      </v-window-item>

      <!-- Búsqueda Avanzada -->
      <v-window-item value="advanced">
        <v-form @submit.prevent="performSearch">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="advancedQuery.title"
                label="Título"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="advancedQuery.creator"
                label="Autor/Creador"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="advancedQuery.type"
                :items="availableTypes"
                label="Tipo"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="advancedQuery.collectionId"
                :items="availableCollections"
                item-title="name"
                item-value="id"
                label="Colección"
                variant="outlined"
                hide-details
              ></v-select>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="advancedQuery.dateFrom"
                label="Desde fecha"
                type="date"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="advancedQuery.dateTo"
                label="Hasta fecha"
                type="date"
                variant="outlined"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-window-item>
    </v-window>

    <!-- Botones de acción -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn 
        color="primary" 
        @click="performSearch"
        :disabled="!canSearch"
        :loading="loading"
      >
        {{ tab === 'simple' ? 'Buscar' : 'Buscar Avanzado' }}
      </v-btn>
      <v-btn 
        color="secondary" 
        @click="clearSearch"
        variant="text"
      >
        Limpiar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useGlam } from '@/composables/useGlam'
import type { GLAMCollection, GLAMFilter } from '@/types/glam'

// Props
interface Props {
  onSearchResults?: (results: { records: any[], collections: any[] }) => void
}

const props = withDefaults(defineProps<Props>(), {
  onSearchResults: () => ({ records: [], collections: [] })
})

// Referencias
const tab = ref('simple')
const simpleQuery = ref('')
const loading = ref(false)

// Búsqueda simple
const performSimpleSearch = () => {
  performSearch()
}

// Búsqueda avanzada
const advancedQuery = reactive({
  title: '',
  creator: '',
  type: '',
  collectionId: '',
  dateFrom: '',
  dateTo: '',
  institution: ''
})

// Datos disponibles
const availableTypes = ref<string[]>([])
const availableCollections = ref<{ id: string, name: string }[]>([])

// Calcular si se puede buscar
const canSearch = computed(() => {
  if (tab.value === 'simple') {
    return simpleQuery.value.trim().length > 0
  } else {
    return Object.values(advancedQuery).some(value => value !== '')
  }
})

// Cargar datos disponibles
onMounted(async () => {
  // Aquí puedes cargar tipos y colecciones disponibles
  // Esto es opcional y depende de tu API
  try {
    // Cargar tipos disponibles
    // await loadAvailableTypes()
    
    // Cargar colecciones disponibles
    // await loadAvailableCollections()
  } catch (error) {
    console.error('Error loading search options:', error)
  }
})

// Función para realizar la búsqueda
const performSearch = async () => {
  if (!canSearch.value) return
  
  loading.value = true
  
  try {
    let results: { records: any[], collections: any[] }
    
    if (tab.value === 'simple') {
      // Búsqueda simple
      results = await performSimpleSearchInternal(simpleQuery.value)
    } else {
      // Búsqueda avanzada
      results = await performAdvancedSearchInternal()
    }
    
    // Emitir resultados
    props.onSearchResults(results)
  } catch (error) {
    console.error('Error during search:', error)
  } finally {
    loading.value = false
  }
}

// Función interna de búsqueda simple
const performSimpleSearchInternal = async (query: string) => {
  const { search } = useGlam()
  const results = await search(query, { withLabels: true })
  
  return {
    records: results.records.items || [],
    collections: results.collections.items || []
  }
}

// Función interna de búsqueda avanzada
const performAdvancedSearchInternal = async () => {
  const { loadRecords, loadCollections } = useGlam()
  
  // Construir filtros basados en los campos avanzados
  const filters: GLAMFilter[] = []
  
  if (advancedQuery.title) {
    filters.push({ field: 'title', operator: 'like', value: advancedQuery.title })
  }
  
  if (advancedQuery.creator) {
    filters.push({ field: 'creator', operator: 'like', value: advancedQuery.creator })
  }
  
  if (advancedQuery.type) {
    filters.push({ field: 'type', operator: '=', value: advancedQuery.type })
  }
  
  if (advancedQuery.collectionId) {
    filters.push({ field: 'collectionId', operator: '=', value: advancedQuery.collectionId })
  }
  
  if (advancedQuery.dateFrom) {
    filters.push({ field: 'date', operator: '>=', value: advancedQuery.dateFrom })
  }
  
  if (advancedQuery.dateTo) {
    filters.push({ field: 'date', operator: '<=', value: advancedQuery.dateTo })
  }

  // Realizar búsquedas
  const records = await loadRecords({ 
    filters,
    withLabels: true
  })
  
  const collections = await loadCollections({ 
    filters,
    withLabels: true
  })
  
  const { records: recordsResult, collections: collectionsResult } = useGlam()
  
  return {
    records: recordsResult.value,
    collections: collectionsResult.value
  }
}

// Función para limpiar la búsqueda
const clearSearch = () => {
  simpleQuery.value = ''
  Object.keys(advancedQuery).forEach(key => {
    advancedQuery[key as keyof typeof advancedQuery] = ''
  })
  tab.value = 'simple'
}

// Exponer métodos si se necesitan desde fuera
defineExpose({
  performSearch,
  clearSearch
})
</script>

<style scoped>
.search-container {
  margin-bottom: 24px;
}
</style>