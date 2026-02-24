<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { useSite } from '@/composables/useSite'
import { useGlam } from '@/composables/useGlam'
import RecordCard from '@/components/glam/RecordCard.vue'
import CollectionCard from '@/components/glam/CollectionCard.vue'
import { onMounted, ref, computed, watch } from 'vue'

const { siteTitle, loading: siteLoading } = useSite()
const { 
  records, 
  collections, 
  loadRecords, 
  loadCollections,
  isLoading 
} = useGlam()

const recordsPerPage = 4
const currentPage = ref(1)

const paginatedRecords = computed(() => {
  if (!records.value || records.value.length === 0) return []

  const start = (currentPage.value -1) * recordsPerPage
  const end = start + recordsPerPage
  return records.value.slice(start, end)
})

const totalPages = computed(() => {
  if (!records.value || records.value.length === 0) return 0

  return Math.ceil(records.value.length/ recordsPerPage)
})

// Resetear a página 1 cuando cambian los registros
watch(records, () => {
  currentPage.value = 1
}, { immediate: true })

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(async () => {
  await Promise.all([
    loadRecords({ page: 1, pageSize: 20 }),
    loadCollections({ page: 1, pageSize: 4 })
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
    <v-row v-else>

      <!-- Sección de Records destacados -->
      <v-col cols="12" class="mt-4">
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

          <!-- Tarjetas de registros -->
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

            <!-- Paginación (solo si hay más de 4 registros) -->
            <v-row v-if="totalPages > 1" justify="center" class="mt-4">
              <v-col cols="12" class="d-flex justify-center">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="5"
                  color="primary"
                  @input="changePage"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección de Colecciones destacadas -->
      <v-col cols="12" class="mt-4">
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
                v-for="collection in collections"
                :key="collection.id"
                cols="12"
                sm="6"
                md="4"
                lg="4"
                xl="4"
                class="d-flex"
              >
                <CollectionCard :collection="collection" color="surface" class="h-100 w-100"/>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>