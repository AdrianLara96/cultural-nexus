<!-- src/views/SearchResultsView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <SearchBar @search-results="handleSearchResults" />
      </v-col>
    </v-row>

    <v-row v-if="hasResults">
      <v-col cols="12">
        <v-tabs v-model="resultTab" bg-color="surface" slider-color="primary">
          <v-tab value="records">Registros ({{ records.length }})</v-tab>
          <v-tab value="collections">Colecciones ({{ collections.length }})</v-tab>
        </v-tabs>

        <v-window v-model="resultTab">
          <v-window-item value="records">
            <v-row>
              <v-col 
                v-for="record in records" 
                :key="record.id" 
                cols="12" 
                sm="6" 
                md="4" 
                lg="3"
              >
                <v-card>
                  <v-img 
                    v-if="record.imageUrl" 
                    :src="record.imageUrl" 
                    height="200px"
                    cover
                  ></v-img>
                  <v-card-title class="text-wrap">{{ record.title || record.name }}</v-card-title>
                  <v-card-subtitle>{{ record.creator }}</v-card-subtitle>
                  <v-card-text>
                    <div v-if="record.date">{{ record.date }}</div>
                    <div v-if="record.type">{{ record.type_label || record.type }}</div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn 
                      :to="`/records/${record.id}`" 
                      color="primary" 
                      variant="text"
                    >
                      Ver detalles
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <v-window-item value="collections">
            <v-row>
              <v-col 
                v-for="collection in collections" 
                :key="collection.id" 
                cols="12" 
                sm="6" 
                md="4" 
                lg="3"
              >
                <v-card>
                  <v-img 
                    v-if="collection.imageUrl" 
                    :src="collection.imageUrl" 
                    height="200px"
                    cover
                  ></v-img>
                  <v-card-title>{{ collection.title || collection.name }}</v-card-title>
                  <v-card-text>
                    <div v-if="collection.itemCount">
                      {{ collection.itemCount }} ítems
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn 
                      :to="`/collections/${collection.id}`" 
                      color="primary" 
                      variant="text"
                    >
                      Ver colección
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <v-row v-else-if="searchPerformed && !isLoading">
      <v-col cols="12">
        <v-card class="text-center py-8">
          <v-card-title>No se encontraron resultados</v-card-title>
          <v-card-subtitle>Intenta con otros términos de búsqueda</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGlam } from '@/composables/useGlam'
import SearchBar from '@/components/search/SearchBar.vue'
import type { GLAMRecord, GLAMCollection } from '@/types/glam'

const records = ref<GLAMRecord[]>([])
const collections = ref<GLAMCollection[]>([])
const resultTab = ref('records')
const searchPerformed = ref(false)

const { isLoading } = useGlam()

const hasResults = computed(() => {
  return records.value.length > 0 || collections.value.length > 0
})

const handleSearchResults = (results: { records: GLAMRecord[], collections: GLAMCollection[] }) => {
  records.value = results.records
  collections.value = results.collections
  searchPerformed.value = true
}
</script>