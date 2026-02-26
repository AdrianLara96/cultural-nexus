<template>
  <v-container>
    <!-- Botones 'volver' y 'metadatos' -->
    <v-row justify="center">
      <v-col cols="12">
        <v-btn 
          color="secondary" 
          @click="$router.go(-1)" 
          class="mb-4 mr-4"
          variant="flat"
          
        >
          ← Volver
        </v-btn>
        
        
      </v-col>
    </v-row>

    <!-- Tarjeta del ítem -->
    <v-row justify="center">
      <v-col cols="12" md="10" lg="6">
        <v-card v-if="record" class="pa-4">
          
          <!-- Título -->
          <v-card-title class="text-h4 mb-1">
            {{ record.title }}
          </v-card-title>
          
          <!-- Descripción -->
          <v-card-subtitle v-if="record.author" class="text-h6 mb-2">
            <strong>Autor: </strong> {{ record.author }}
          </v-card-subtitle>

          <!-- Imagen del registro -->
          <div v-if="record.thumbnail" class="mb-6">
            <v-img 
              :src="record.thumbnail" 
              :alt="record.title"
              max-height="400"
              contain
            ></v-img>
          </div>
          
          <!-- Tarjeta de detalles -->
          <v-card-text>

            <!-- Metadatos básicos mostrados siempre -->
            <div class="mb-2">
              <h3 class="text-h6 mb-4"><strong>Información básica</strong></h3>
              
              <v-table density="compact">
                <tbody>
                  
                  <!-- Tipo de ítem -->
                  <tr v-if="hasValidValue(getTypeValue)">
                    <td>
                      <v-icon size="small" class="mr-2" icon="mdi-label"/>
                      <strong>Tipo</strong>
                    </td>
                    <td>
                      <v-chip size="small" color="primary" variant="tonal">
                        {{ getTypeValue }}
                      </v-chip>
                    </td>
                  </tr>
                  
                  <!-- Colección(es) a la que(s) pertenece -->
                  <tr v-if="getCollectionsList.length > 0">
                    <td>
                      <v-icon size="small" class="mr-2" icon="mdi-folder-multiple" />
                      <strong>Colección{{ getCollectionsList.length > 1 ? 'es' : '' }}</strong>
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-2">
                        <template v-for="(col, index) in getCollectionsList" :key="`${col.id}-${index}`">
                          
                          <!-- Si es routable: mostrar como enlace -->
                          <RouterLink
                            v-if="col.isRoutable"
                            :to="`/collections/${col.id}`"
                            class="text-decoration-none"
                          >
                            <v-chip 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              class="mr-2 mb-1"
                            >
                              {{ col.name }}
                              <v-icon size="x-small" icon="mdi-open-in-new" class="ml-1" />
                            </v-chip>
                          </RouterLink>
                          
                          <!-- Si no es routable: mostrar como texto con tooltip explicativo -->
                          <v-chip 
                            v-else
                            size="small" 
                            color="secondary" 
                            variant="tonal"
                            class="mr-2 mb-1"
                          >
                            {{ col.name }}
                            <v-tooltip activator="parent" location="top">
                              <span>Detalles de esta colección próximamente</span>
                            </v-tooltip>
                          </v-chip>
                          
                        </template>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </v-table>
            </div>

            <v-btn 
              color="secondary" 
              @click="showMetadata = !showMetadata"
              class="mb-4 mt-4"
              variant="flat"
            >
              {{ showMetadata ? 'Ocultar' : 'Mostrar' }} información detallada
            </v-btn>

            <!-- Metadatos mostrados solo si showMetadata es true -->
            <div v-if="showMetadata" class="mt-2">
              <h3 class="text-h6 mb-4"><strong>Información detallada</strong></h3>
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
import { getRecordById, getCollectionById } from '@/services/glam-api'
import type { GLAMRecord, GLAMCollection } from '@/types/glam'

const route = useRoute()
const recordId = computed(() => route.params.id as string)
const record = ref<GLAMRecord | null>(null)
const collection = ref<GLAMCollection | null>(null)
const loading = ref(true)
const showMetadata = ref(false) 

onMounted(async () => {
  try {
    loading.value = true
    const recordData = await getRecordById(recordId.value)
    record.value = recordData

    // Cargar colección principal, si existe
    if (record.value?.collection_id) {
      try {
        const collectionData = await getCollectionById(String(record.value.collection_id))
        collection.value = collectionData
      } catch (error) {
        console.error('Error loading primary collection:', error)
      }
    }
  } catch (error) {
    console.error('Error loading record:', error)
    record.value = null
  } finally {
    loading.value = false
  }
})

const getCollectionsList = computed(() => {
  if (!record.value) return []
  
  const collections: Array<{ 
    id: string | number | null; 
    name: string; 
    isRoutable: boolean 
  }> = []

  const rawTitles = record.value.collections_titles as string | undefined

  if (rawTitles && typeof rawTitles === 'string') {
    const titles = rawTitles
      .split(/[;,]/)
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)

    titles.forEach((title: string, index: number) => {
      const collId = record.value!.collection_id ?? null  // ! para afirmar que no es null
      const isRoutable = (index === 0 && collId !== null)
      
      collections.push({
        id: isRoutable ? collId : null,
        name: title,
        isRoutable
      })
    })
    
    if (collections.length > 0) return collections
  }   
  
  const primaryCollection = collection.value
  if (primaryCollection) {
    const collName: string = primaryCollection.title || primaryCollection.name || String(primaryCollection.id)
    return [{
      id: primaryCollection.id,
      name: collName,
      isRoutable: true
    }]
  }

  const collectionTitle = record.value.collection_title
  if (collectionTitle && typeof collectionTitle === 'string') {
    const collId = record.value.collection_id ?? null
    const hasValidId: boolean = collId !== null && collId !== undefined
    return [{
      id: hasValidId ? collId : null,
      name: collectionTitle,
      isRoutable: hasValidId
    }]
  }

    const fallbackId = record.value.collection_id
  if (fallbackId !== null && fallbackId !== undefined) {
    return [{
      id: fallbackId,
      name: `Colección ${fallbackId}`,
      isRoutable: true
    }]
  }

  return []
})

// Computado para tipo de ítem
const getTypeValue = computed(() => {
  if (!record.value) return ''
  
  if (record.value.resource_class && Array.isArray(record.value.resource_class) && record.value.resource_class.length >= 2) {
    return record.value.resource_class[1]
  }
  
  return record.value.type_label || record.value.type || ''
})

// Función para verificar si un valor es válido
const hasValidValue = (value: any): boolean => {
  if (value === null || value === undefined || value === '') return false
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

// Formatear la clave de metadata
const formatMetadataKey = (key: string): string => {
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
  }
  
  return replacements[key] || key.replace(/dcterms:/g, '').replace(/dc:/g, '').replace(/_/g, ' ')
    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

// Formatear el valor de metadata
const formatMetadataValue = (value: any): string => {
  if (value === null || value === undefined) return ''
  
  if (typeof value === 'object' && value !== null && '@value' in value) {
    return String(value['@value'])
  }
  
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item !== null && '@value' in item) {
        return String(item['@value'])
      } else if (typeof item === 'object' && item !== null) {
        if (item.label) return item.label
        if (item.name) return item.name
        if (item.value) return item.value
        return JSON.stringify(item)
      }
      return String(item)
    }).join(', ')
  }
  
  if (typeof value === 'object') {
    if (value.label) return value.label
    if (value.name) return value.name
    if (value.value) return value.value
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return '[Objeto complejo]'
    }
  }
  
  return String(value)
}

console.log('Tipos verificados:', {
  hasCollectionsTitles: 'collections_titles' in (record.value || {}),
  sampleValue: record.value?.collections_titles,
  typeOf: typeof record.value?.collections_titles
})
</script>