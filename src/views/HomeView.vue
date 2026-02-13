<!-- src/views/HomeView.vue -->
<script setup lang="ts">
import { useSite } from '@/composables/useSite'
import { useGlam } from '@/composables/useGlam'
import RecordCard from '@/components/glam/RecordCard.vue'
import CollectionCard from '@/components/glam/CollectionCard.vue'
import { onMounted } from 'vue'

const { siteTitle, loading: siteLoading } = useSite()
const { 
  records, 
  collections, 
  loadRecords, 
  loadCollections,
  isLoading 
} = useGlam()

onMounted(async () => {
  await Promise.all([
    loadRecords({ page: 1, pageSize: 6 }),
    loadCollections({ page: 1, pageSize: 4 })
  ])
})
</script>

<template>
  <v-container>
    <v-row v-if="siteLoading || isLoading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <!-- Sección de Records destacados -->
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="text-h4">
            Ítems destacados
            <v-spacer></v-spacer>
            <v-btn
              to="/records"
              variant="text"
              end-icon="mdi-chevron-right"
            >
              Ver todos
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                v-for="record in records"
                :key="record.id"
                cols="12"
                sm="6"
                md="4"
                lg="2"
              >
                <RecordCard :record="record" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sección de Colecciones destacadas -->
      <v-col cols="12">
        <v-card elevation="0">
          <v-card-title class="text-h4">
            Colecciones
            <v-spacer></v-spacer>
            <v-btn
              to="/collections"
              variant="text"
              end-icon="mdi-chevron-right"
            >
              Ver todas
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                v-for="collection in collections"
                :key="collection.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <CollectionCard :collection="collection" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>