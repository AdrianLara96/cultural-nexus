<!-- src/components/search/SearchBar.vue -->
<template>
  <div class="search-section">
    <div class="search-box">
      <v-text-field
        v-model="search"
        placeholder="Buscar registros, colecciones..."
        variant="outlined"
        density="comfortable"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="search-input"
        @keyup.enter="onBasicSearch"
      />
      <v-btn 
        class="search-btn" 
        color="primary"
        @click="onBasicSearch"
      >
        Buscar
      </v-btn>
      <v-btn 
        variant="text" 
        class="advanced-btn" 
        color="primary"
        @click="advancedOpen = true"
      >
        Avanzada
      </v-btn>
    </div>

    <AdvancedSearchDialog
      v-model="advancedOpen"
      :fields="fields"
      :collections="collectionOptions"
      :defaults="defaults"
      @do-advanced-search="onAdvanced"
    />
  </div>
</template>

// En src/components/search/SearchBar.vue
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router' // ✅ Importar useRouter
import AdvancedSearchDialog from './AdvancedSearchDialog.vue'
import type { GLAMCollection } from '@/types/glam'
import type { SearchPayload, CollectionOption } from '@/types/search'

const props = defineProps<{
  fields?: Array<string | { title: string; value: string }>
  collections?: GLAMCollection[]
  defaults?: SearchPayload
}>()

const emit = defineEmits<{
  doBasicSearch: [query: string]
  doAdvancedSearch: [payload: SearchPayload]
}>()

const route = useRoute()
const router = useRouter() // ✅ Instanciar router
const search = ref('')
const advancedOpen = ref(false)

const collectionOptions = computed<CollectionOption[]>(() => {
  if (!props.collections) return []
  return props.collections
    .filter((c): c is GLAMCollection & { title: string } => !!(c.id && c.title))
    .map(c => ({
      id: c.id,
      title: c.title
    }))
})

watch(() => route.query.q, (val) => { 
  search.value = (val as string) || '' 
}, { immediate: true })

// ✅ CORRECCIÓN: Solo navegar, no llamar a la API
function onBasicSearch() {
  if (search.value.trim()) {
    const queryTerm = search.value.trim()
    // Navegar a la vista de resultados con el parámetro en la URL
    router.push({ path: '/search', query: { q: queryTerm, page: 1 } })
  }
}

function onAdvanced(payload: SearchPayload) {
  // Para búsqueda avanzada, navegar con todos los parámetros
  const query: Record<string, any> = {
    q: payload.query?.trim() || undefined,
    scope: payload.scope,
    combine: payload.combine,
    page: 1
  }
  
  if (payload.rules?.length) {
    query.rules = JSON.stringify(payload.rules)
  }
  
  // Limpiar undefined para URL limpia
  Object.keys(query).forEach(k => {
    if (query[k] === undefined || query[k] === null) delete query[k]
  })
  
  router.push({ path: '/search', query })
  advancedOpen.value = false
}
</script>

<style scoped>
.search-section { 
  display: flex; 
  justify-content: center; 
  margin: 32px 0; 
  padding: 0 16px; 
}

.search-box { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  width: 100%; 
  max-width: 880px; 
  flex-wrap: wrap;
}

.search-input { 
  flex-grow: 1; 
  min-width: 200px;
}

.search-input :deep(.v-field) { 
  border-radius: 999px !important; 
  background: #f5f5f0; /* Tu color surface */
  height: 52px; 
  border-color: rgba(69, 82, 69, 0.3) !important;
}

.search-btn { 
  border-radius: 999px !important; 
  height: 52px !important; 
  min-width: 100px;
}

.advanced-btn { 
  height: 52px !important;
  color: #455245 !important; /* Tu color primary */
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .search-box { 
    flex-direction: column; 
    gap: 8px; 
  }
  
  .search-input, .search-btn, .advanced-btn { 
    width: 100%; 
  }
}
</style>