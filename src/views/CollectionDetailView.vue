<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card v-if="collection" class="pa-4">
          <v-card-title class="text-h4 mb-4">
            {{ collection.title }}
          </v-card-title>
          
          

          <v-card-text>
            <div v-if="collection.description" class="mb-4">
              <h3 class="text-h6">Descripción</h3>
              <p>{{ collection.description }}</p>
            </div>

            <!-- Aquí puedes agregar más campos según la estructura de tu GLAMCollection -->
            <div v-if="collection.institution" class="mb-4">
              <h3 class="text-h6">Institución</h3>
              <p>{{ collection.institution }}</p>
            </div>

            

          </v-card-text>

          <v-card-actions>
            
             
            <v-btn @click="$router.go(-1)">
              Volver
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-else-if="loading" class="pa-4 text-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
          <p>Cargando colección...</p>
        </v-card>

        <v-card v-else class="pa-4 text-center">
          <v-alert type="error" variant="tonal">
            No se encontró la colección con ID: {{ collectionId }}
          </v-alert>
          <v-btn @click="$router.go(-1)">
            Volver
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { getCollectionById } from '@/services/glam-api'
import type { GLAMCollection } from '@/types/glam'
import { ref } from 'vue'

const route = useRoute()
const collectionId = computed(() => route.params.id as string)
const collection = ref<GLAMCollection | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    const collectionData = await getCollectionById(collectionId.value)
    collection.value = collectionData
  } catch (error) {
    console.error('Error loading collection:', error)
    collection.value = null
  } finally {
    loading.value = false
  }
})
</script>