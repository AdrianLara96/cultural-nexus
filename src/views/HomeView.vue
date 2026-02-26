<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { useSite } from '@/composables/useSite'
import { useGlam } from '@/composables/useGlam'
import RecordCard from '@/components/glam/RecordCard.vue'
import CollectionCard from '@/components/glam/CollectionCard.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { siteTitle, loading: siteLoading } = useSite()
const { 
  records, 
  collections, 
  loadRecords, 
  loadCollections,
  isLoading 
} = useGlam()

const display = useDisplay()

// Configuración de ítems por fila según breakpoint
const itemsPerRow = computed(() => {
  switch (display.name.value) {
    case 'xs': return 1 
    case 'sm': return 2  
    case 'md': return 3 
    case 'lg': return 4  
    case 'xl': return 4  
    default: return 4
  }
})

// Paginación records
const currentPageRecords = ref(1)

const paginatedRecords = computed(() => {
  if (!records.value || records.value.length === 0) return []

  const start = (currentPageRecords.value -1) * itemsPerRow.value
  const end = start + itemsPerRow.value
  return records.value.slice(start, end)
})

const totalPagesRecords = computed(() => {
  if (!records.value || records.value.length === 0) return 0

  return Math.ceil(records.value.length/ itemsPerRow.value)
})

// Paginación collections
const currentPageCollections = ref(1)

const paginatedCollections = computed(() => {
  if (!collections.value || collections.value.length === 0) return []
  
  const start = (currentPageCollections.value - 1) * itemsPerRow.value
  const end = start + itemsPerRow.value
  return collections.value.slice(start, end)
})

const totalPagesCollections = computed(() => {
  if (!collections.value || collections.value.length === 0) return 0
  return Math.ceil(collections.value.length / itemsPerRow.value)
})

// Resetear a página 1 cuando cambian los datos o el breakpoint
watch([records, collections, () => display.name.value], () => {
  currentPageRecords.value = 1
  currentPageCollections.value = 1
}, { immediate: true })

onMounted(async () => {
  await Promise.all([
    loadRecords({ page: 1, pageSize: 20 }),
    loadCollections({ page: 1, pageSize: 20 })
  ])
})
</script>

<template>
  <v-container>

    <!-- Loading State -->
    <v-row v-if="siteLoading || isLoading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Pasa del loading state -->
    <v-row v-else class="justify-center">

      <!-- Sección de Records -->
      <v-col cols="10" class="mt-4">
        <v-card elevation="0" color="secondary" class="h-100">

          <!-- Título y botón -->
          <v-card-title class="text-h4 text-body1 font-weight-bold pa-4">
            Registros
            <v-spacer></v-spacer>
            <v-btn
              to="/records"
              variant="flat"
              end-icon="mdi-chevron-right"
              color="primary"
              class="mb-4 mr-4 text-white"
            >
              Ver todos
            </v-btn>
          </v-card-title>

          <!-- Tarjetas de records -->
          <v-card-text class="pa-4">
            <v-row fill-height>
              <v-col
                v-for="record in paginatedRecords"
                :key="record.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                xl="3"
                class="d-flex"
              >
                <RecordCard :record="record" color="surface" class="h-100 w-100"/>
              </v-col>
            </v-row>

            <!-- Paginación records -->
            <v-row v-if="totalPagesRecords > 1" justify="center" class="mt-4">
              <v-col cols="12" class="d-flex justify-center">
                <v-pagination
                  v-model="currentPageRecords"
                  :length="totalPagesRecords"
                  :total-visible="5"
                  color="primary"
                  class="justify-center"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección collections -->
      <v-col cols="10" class="mt-4">
        <v-card elevation="0" color="secondary" class="h-100">

          <!-- Título y botón -->
          <v-card-title class="text-h4 text-body1 font-weight-bold pa-4">
            Colecciones
            <v-spacer></v-spacer>
            <v-btn
              to="/collections"
              variant="flat"
              end-icon="mdi-chevron-right"
              color="primary"
              class="text-white"
            >
              Ver todas
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row fill-height>
              <v-col
                v-for="collection in paginatedCollections"
                :key="collection.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                xl="3"
                class="d-flex"
              >
                <CollectionCard :collection="collection" color="surface" class="h-100 w-100"/>
              </v-col>
            </v-row>

            <!-- Pagiación collections -->
            <v-row v-if="totalPagesCollections > 1" justify="center" class="mt-4">
              <v-col cols="12">
                <v-pagination
                  v-model="currentPageCollections"
                  :length="totalPagesCollections"
                  :total-visible="5"
                  color="primary"
                  class="justify-center"
                />
              </v-col>
            </v-row> 
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>