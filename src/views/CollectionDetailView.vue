<!-- src/views/CollectionDetailView.vue -->
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
        
        <!-- Botón para mostrar/ocultar metadatos -->
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
        <v-card v-if="collection" class="pa-4">
          <v-card-title class="text-h4 mb-4">
            {{ collection.title || collection.name }}
          </v-card-title>
          
          <v-card-subtitle v-if="collection.description" class="text-h6 mb-4">
            {{ collection.description }}
          </v-card-subtitle>

          <v-card-text>
            <!-- Imagen de la colección -->
            <div v-if="collection.thumbnail" class="mb-6">
              <v-img 
                :src="collection.thumbnail" 
                :alt="collection.title || collection.name"
                max-height="400"
                contain
              ></v-img>
            </div>


            <!-- Mostrar metadatos detallados solo si showMetadata es true -->
            <div v-if="showMetadata" class="mb-4">
              <h3 class="text-h6">Metadatos detallados</h3>
              <v-table density="compact">
                <tbody>
                  <!-- Mostrar metadata_fields -->
                  <tr v-if="collection.institution">
                    <td><strong>Institución</strong></td>
                    <td>{{ collection.institution }}</td>
                  </tr>
                  <tr v-if="collection.date">
                    <td><strong>Fecha</strong></td>
                    <td>{{ collection.date }}</td>
                  </tr>
                  <!-- Mostrar el conteo correcto de items usando el array children -->
                  <tr v-if="recordsTotal > 0">
                        <td><strong>Total de ítems</strong></td>
                        <td>{{ recordsTotal }}</td>
                    </tr>
                  <tr v-if="collection.published !== undefined">
                    <td><strong>Publicada</strong></td>
                    <td>{{ collection.published ? 'Sí' : 'No' }}</td>
                  </tr>
                  <tr v-for="[key, value] in getValidMetadataFields" :key="key">
                    <td><strong>{{ formatMetadataKey(key) }}</strong></td>
                    <td>{{ formatMetadataValue(value) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <!-- Registros de la colección -->
            <div class="mb-4">
            <h3 class="text-h6">Registros en esta colección ({{ recordsTotal || collectionRecords.length }})</h3>
              
              <v-row v-if="collectionRecords.length > 0">
                <v-col
                  v-for="record in collectionRecords"
                  :key="record.id"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card>
                    <v-img
                      v-if="record.thumbnail || record.imageUrl"
                      :src="record.thumbnail || record.imageUrl"
                      height="150px"
                      cover
                    ></v-img>
                    <v-card-title class="text-h6 py-2">{{ record.title }}</v-card-title>
                    <v-card-actions>
                      <v-btn 
                        :to="{ name: 'record-detail', params: { id: record.id.toString() } }"
                        variant="text"
                        color="primary"
                      >
                        Ver detalles
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              
              <v-alert v-else-if="loadingRecords" type="info" variant="tonal">
                Cargando registros de la colección...
              </v-alert>
              
              <v-alert v-else type="info" variant="tonal">
                No hay registros en esta colección.
              </v-alert>
            </div>
          </v-card-text>

          <v-card-actions>
            <!-- Puedes usar el thumbnail como enlace si es apropiado -->
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
import { computed, onMounted, ref } from 'vue'
import { getCollectionById, getRecords, getRecordById } from '@/services/glam-api'
import type { GLAMCollection, GLAMRecord, GLAMFilter } from '@/types/glam'

const route = useRoute()
const collectionId = computed(() => route.params.id as string)
const collection = ref<GLAMCollection | null>(null)
const collectionRecords = ref<GLAMRecord[]>([])
const loading = ref(true)
const loadingRecords = ref(true)
const showMetadata = ref(false)
const recordsTotal = ref(0) // Variable para almacenar el total real de registros

onMounted(async () => {
  try {
    loading.value = true
    
    // Cargar la colección
    const collectionData = await getCollectionById(collectionId.value)
    collection.value = collectionData
    
    // Cargar los registros de la colección
    loadingRecords.value = true
    
    // Intentar diferentes posibles campos para filtrar por colección
    const possibleFilters: GLAMFilter[] = [
      { field: 'collection_id', operator: '=', value: Number(collectionId.value) },
      { field: 'collectionId', operator: '=', value: Number(collectionId.value) },
      { field: 'collection', operator: '=', value: Number(collectionId.value) },
      { field: 'collections', operator: '=', value: Number(collectionId.value) },
      { field: 'parent', operator: '=', value: Number(collectionId.value) },
      { field: 'parent_id', operator: '=', value: Number(collectionId.value) },
    ]
    
    let recordsResponse = null
    for (const filter of possibleFilters) {
      try {
        recordsResponse = await getRecords({ 
          filters: [filter],
          pageSize: 12
        })
        // Si encontramos resultados, salir del bucle
        if (recordsResponse.items.length > 0) {
          break
        }
      } catch (e) {
        console.log(`Intento con filtro ${filter.field} falló:`, e)
        continue
      }
    }
    
    // Si ningún filtro funcionó, intentar obtener registros cuyo ID esté en el array children
    if (!recordsResponse || recordsResponse.items.length === 0) {
      if (collection.value?.children && collection.value.children.length > 0) {
        // Intentar obtener registros específicos por ID
        const specificRecords = []
        for (const childId of collection.value.children) {
          try {
            const record = await getRecordById(childId.toString())
            specificRecords.push(record)
          } catch (e) {
            console.log(`No se pudo cargar el registro con ID ${childId}:`, e)
          }
        }
        recordsResponse = { items: specificRecords, total: specificRecords.length }
      }
    }
    
    collectionRecords.value = recordsResponse ? recordsResponse.items : []
    recordsTotal.value = recordsResponse ? recordsResponse.total || 0 : 0
    
  } catch (error) {
    console.error('Error loading collection:', error)
    collection.value = null
  } finally {
    loading.value = false
    loadingRecords.value = false
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
  if (!collection.value?.metadata_fields) return []
  
  return Object.entries(collection.value.metadata_fields).filter(([key, value]) => {
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