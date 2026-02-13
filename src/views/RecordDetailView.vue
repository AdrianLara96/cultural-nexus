<!-- src/views/RecordDetailView.vue -->
<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-btn 
          color="secondary" 
          @click="$router.go(-1)" 
          class="mb-4 mr-4"
          variant="flat"
        >
          ← Volver a la lista
        </v-btn>
        
        <v-btn 
          color="secondary" 
          @click="showMetadata = !showMetadata"
          class="mb-4"
          variant="flat"
        >
          {{ showMetadata ? 'Ocultar' : 'Mostrar' }} metadatos
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card v-if="record" class="pa-4">
          <v-card-title class="text-h4 mb-4">
            {{ record.title }}
          </v-card-title>
          
          <v-card-subtitle v-if="record.description" class="text-h6 mb-4">
            {{ record.description }}
          </v-card-subtitle>

          <v-card-text>
            <!-- Imagen del registro -->
            <div v-if="record.thumbnail" class="mb-6">
              <v-img 
                :src="record.thumbnail" 
                :alt="record.title"
                max-height="400"
                contain
              ></v-img>
            </div>

            <!-- Mostrar metadatos básicos siempre -->
            <div class="mb-4">
              <h3 class="text-h6">Información básica</h3>
              <v-table density="compact">
                <tbody>
                  <tr v-if="hasValidValue(record.author)">
                    <td><strong>Autor</strong></td>
                    <td>{{ formatMetadataValue(record.author) }}</td>
                  </tr>
                  <tr v-if="hasValidValue(record.date)">
                    <td><strong>Fecha</strong></td>
                    <td>{{ record.date }}</td>
                  </tr>
                  <tr v-if="hasValidValue(record.type)">
                    <td><strong>Tipo</strong></td>
                    <td>{{ record.type }}</td>
                  </tr>
                  <tr v-if="hasValidValue(record.collection_id)">
                    <td><strong>Colección ID</strong></td>
                    <td>
                      <router-link 
                        v-if="record.collection_id"
                        :to="{ name: 'collection-detail', params: { id: record.collection_id.toString() } }"
                        class="text-primary"
                      >
                        Ver colección ({{ record.collection_id }})
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <!-- Mostrar metadatos detallados solo si showMetadata es true -->
            <div v-if="showMetadata" class="mb-4">
              <h3 class="text-h6">Metadatos detallados</h3>
              <v-table density="compact">
                <tbody>
                  <!-- Mostrar todos los metadatos estructurados solo si están activados -->
                  <tr v-for="[key, value] in getValidMetadataFields" :key="key">
                    <td><strong>{{ formatMetadataKey(key) }}</strong></td>
                    <td>{{ formatMetadataValue(value) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn 
              v-if="record.thumbnail && record.thumbnail.includes('http')" 
              color="primary" 
              :href="record.thumbnail" 
              target="_blank"
              append-icon="mdi-open-in-new"
            >
              Ver imagen original
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
import { computed, onMounted, ref } from 'vue'
import { getRecordById } from '@/services/glam-api'
import type { GLAMRecord } from '@/types/glam'

const route = useRoute()
const recordId = computed(() => route.params.id as string)
const record = ref<GLAMRecord | null>(null)
const loading = ref(true)
const showMetadata = ref(false) // Controla la visibilidad de los metadatos detallados

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

// Función para verificar si un valor es válido (no nulo, no vacío, no array vacío)
const hasValidValue = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string' && value.trim() === '') return false
  if (Array.isArray(value) && value.length === 0) return false
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return false
  return true
}

// Obtener solo los campos de metadata que tienen valor
const getValidMetadataFields = computed<[string, any][]>(() => {
  if (!record.value?.metadata_fields) return []
  
  return Object.entries(record.value.metadata_fields).filter(([key, value]) => {
    return hasValidValue(value)
  }) as [string, any][]
})

// Formatear la clave de metadata para mostrarla de forma legible
const formatMetadataKey = (key: string): string => {
  // Convertir dcterms:title a "Título" o similar
  const replacements: Record<string, string> = {
    'dcterms:title': 'Título',
    'dcterms:description': 'Descripción',
    'dcterms:creator': 'Creador',
    'dcterms:date': 'Fecha',
    'dcterms:language': 'Idioma',
    'dcterms:identifier': 'Identificador',
    'dcterms:type': 'Tipo',
    'dcterms:format': 'Formato',
    'dcterms:subject': 'Asunto',
    'dcterms:publisher': 'Editor',
    'dcterms:rights': 'Derechos',
    'dcterms:contributor': 'Colaborador',
    'dcterms:coverage': 'Cobertura',
    'dcterms:relation': 'Relación',
    'dcterms:source': 'Fuente',
  }
  
  return replacements[key] || key.replace(/dcterms:/g, '').replace(/dc:/g, '').replace(/_/g, ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

// Formatear el valor de metadata para mostrarlo correctamente
const formatMetadataValue = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }
  
  // Si es un objeto RDF/JSON-LD con @value
  if (typeof value === 'object' && value !== null && '@value' in value) {
    return String(value['@value'])
  }
  
  // Si es un array que puede contener objetos RDF
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item !== null && '@value' in item) {
        // Si es un objeto RDF, extraer @value
        return String(item['@value'])
      } else if (typeof item === 'object' && item !== null) {
        // Si es un objeto no RDF, intentar extraer propiedades comunes
        if (item.label) return item.label
        if (item.name) return item.name
        if (item.value) return item.value
        if (item.text) return item.text
        return JSON.stringify(item)
      }
      return String(item)
    }).join(', ')
  }
  
  if (typeof value === 'object') {
    // Manejar otros objetos
    if (value.label) return value.label
    if (value.name) return value.name
    if (value.value) return value.value
    if (value.text) return value.text
    
    try {
      return JSON.stringify(value, null, 2)
    } catch (e) {
      return '[Objeto complejo]'
    }
  }
  
  // Para cualquier otro tipo, convertir a string
  return String(value)
}
</script>