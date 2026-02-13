<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card v-if="record" class="pa-4">
          <v-card-title class="text-h4 mb-4">
            {{ record.title }}
          </v-card-title>
          
          

          <v-card-text>
            <div v-if="record.description" class="mb-4">
              <h3 class="text-h6">Descripción</h3>
              <p>{{ record.description }}</p>
            </div>

            <!-- Aquí puedes agregar más campos según la estructura de tu GLAMRecord -->
            <div v-if="record.creator" class="mb-4">
              <h3 class="text-h6">Creador</h3>
              <p>{{ record.creator }}</p>
            </div>

            <div v-if="record.date" class="mb-4">
              <h3 class="text-h6">Fecha</h3>
              <p>{{ record.date }}</p>
            </div>

            <div v-if="record.type" class="mb-4">
              <h3 class="text-h6">Tipo</h3>
              <p>{{ record.type }}</p>
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
          <p>Cargando registro...</p>
        </v-card>

        <v-card v-else class="pa-4 text-center">
          <v-alert type="error" variant="tonal">
            No se encontró el registro con ID: {{ recordId }}
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
import { getRecordById } from '@/services/glam-api'
import type { GLAMRecord } from '@/types/glam'
import { ref } from 'vue'

const route = useRoute()
const recordId = computed(() => route.params.id as string)
const record = ref<GLAMRecord | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    const recordData = await getRecordById(recordId.value)
    record.value = recordData
  } catch (error) {
    console.error('Error loading record:', error)
    record.value = null
  } finally {
    loading.value = false
  }
})
</script>