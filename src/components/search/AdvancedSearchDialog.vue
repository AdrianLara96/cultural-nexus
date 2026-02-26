<!-- src/components/search/AdvancedSearchDialog.vue -->
<template>
  <v-dialog v-model="open" max-width="920" persistent>
    <v-card class="pa-6" elevation="10" rounded="xl" color="surface">
      <v-card-title class="text-h5 d-flex align-center pb-4">
        <v-icon icon="mdi-magnify-plus" class="me-3" color="primary" />
        Búsqueda Avanzada
      </v-card-title>

      <v-card-text class="pa-0">
        <!-- Alcance -->
        <div class="mb-6">
          <div class="text-subtitle-2 mb-2 text-primary font-weight-bold">Alcance</div>
          <v-btn-toggle 
            v-model="form.scope" 
            color="primary" 
            variant="outlined" 
            mandatory 
            class="w-100"
          >
            <v-btn value="records" class="flex-grow-1">Registros</v-btn>
            <v-btn value="collections" class="flex-grow-1">Colecciones</v-btn>
            <v-btn value="all" class="flex-grow-1">Todo</v-btn>
          </v-btn-toggle>
        </div>

        <!-- Término general -->
        <v-text-field 
          v-model="form.query" 
          label="Término general" 
          variant="outlined" 
          class="mb-6" 
          clearable 
          prepend-inner-icon="mdi-text-search"
          @keyup.enter="emitSearch"
        />

        <!-- Filtros específicos -->
        <v-card variant="flat" border class="pa-4 mb-6" color="secondary">
          <div class="d-flex align-center mb-4 flex-wrap">
            <span class="text-subtitle-1 font-weight-bold me-4">Filtros específicos</span>
            <v-btn-toggle 
              v-model="form.combine" 
              density="compact" 
              mandatory 
              color="primary"
            >
              <v-btn value="AND">Y</v-btn>
              <v-btn value="OR">O</v-btn>
            </v-btn-toggle>
          </div>
          
          <div class="d-flex flex-column ga-4">
            <div 
              v-for="(rule, idx) in form.rules" 
              :key="rule.id" 
              class="d-flex align-center ga-2 flex-wrap"
            >
              <v-select 
                v-model="rule.field" 
                :items="fieldOptions" 
                label="Campo" 
                variant="outlined" 
                density="compact" 
                hide-details 
                class="flex-grow-1"
                min-width="150px"
              />
              <v-select 
                v-model="rule.operator" 
                :items="operatorOptions" 
                label="Op." 
                variant="outlined" 
                density="compact" 
                style="max-width: 120px" 
                hide-details 
              />
              <v-text-field 
                v-if="!['isEmpty', 'notEmpty'].includes(rule.operator)" 
                v-model="rule.value" 
                label="Valor" 
                variant="outlined" 
                density="compact" 
                hide-details 
                class="flex-grow-1"
                min-width="200px"
                @keyup.enter="emitSearch" 
              />
              <v-btn 
                icon="mdi-delete" 
                variant="text" 
                color="error" 
                @click="removeRule(idx)" 
                :disabled="form.rules.length <= 1" 
              />
            </div>
            <v-btn variant="text" color="primary" @click="addRule" class="align-self-start">
              + Añadir filtro
            </v-btn>
          </div>
        </v-card>
      </v-card-text>

      <v-card-actions class="px-0 pt-4">
        <v-btn variant="text" color="primary" @click="open = false">Cancelar</v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="emitSearch">
          <v-icon start>mdi-magnify</v-icon>
          Buscar ahora
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'
import type { SearchPayload, CollectionOption } from '@/types/search'
import type { GLAMFilter } from '@/types/glam'

const props = defineProps<{
  modelValue: boolean
  fields?: Array<string | { title: string; value: string }>
  collections?: CollectionOption[]
  defaults?: SearchPayload
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'doAdvancedSearch': [payload: SearchPayload]
}>()

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// ✅ Usa GLAMFilter directamente en lugar de FilterRule
const form = reactive<SearchPayload & { rules: GLAMFilter[] }>({
  scope: 'records',
  query: '',
  combine: 'AND',
  rules: []
})

const generateId = () => Math.random().toString(36).substr(2, 9)

// ✅ CORRECCIÓN: Ahora usa GLAMFilter directamente
const resetForm = () => {
  form.scope = props.defaults?.scope || 'records'
  form.query = props.defaults?.query || ''
  form.combine = props.defaults?.combine || 'AND'
  
  if (props.defaults?.rules?.length) {
    form.rules = props.defaults.rules.map(r => ({ 
      id: generateId(), 
      field: r.field,
      operator: r.operator, 
      value: String(r.value) 
    }))
  } else {
    form.rules = [{ 
      id: generateId(), 
      field: null, 
      operator: 'contains', 
      value: '' 
    }]
  }
}

watch(() => props.modelValue, (val) => { 
  if (val) resetForm() 
}, { immediate: true })

const fieldOptions = computed(() => {
  const defaultFields = [
    { title: 'Título', value: 'title' },
    { title: 'Descripción', value: 'description' },
    { title: 'Creador', value: 'creator' },
    { title: 'Fecha', value: 'date' },
    { title: 'Tipo', value: 'type' },
    { title: 'Colección', value: 'collection' }
  ]
  
  if (props.fields?.length) {
    return props.fields.map(f => typeof f === 'string' ? { title: f, value: f } : f)
  }
  
  return defaultFields
})

const operatorOptions = [
  { title: 'Contiene', value: 'contains' },
  { title: 'Es igual a', value: 'eq' },
  { title: 'Empieza con', value: 'startsWith' },
  { title: 'Vacío', value: 'isEmpty' },
  { title: 'No vacío', value: 'notEmpty' },
  { title: 'Mayor que', value: 'gt' },
  { title: 'Menor que', value: 'lt' }
]

function addRule() { 
  form.rules.push({ 
    id: generateId(), 
    field: null, 
    operator: 'contains', 
    value: '' 
  }) 
}

function removeRule(idx: number) { 
  form.rules.splice(idx, 1)
  if (!form.rules.length) addRule()
}

function emitSearch() {
  // Type guard explícito que verifica field no es null y value es string
  const validRules = form.rules.filter((r): r is GLAMFilter => {
    // Si el campo es null, no es válido
    if (!r.field) return false
    
    // Si el operador es isEmpty/notEmpty, no necesita value
    if (['isEmpty', 'notEmpty'].includes(r.operator)) return true
    
    // Para otros operadores, value debe ser string no vacío
    if (typeof r.value === 'string') {
      return r.value.trim() !== ''
    }
    
    // Si value es number o boolean, también es válido
    return r.value !== null && r.value !== undefined
  })
  
  emit('doAdvancedSearch', { 
    scope: form.scope,
    query: form.query,
    combine: form.combine,
    rules: validRules
  })
  open.value = false
}
</script>

<style scoped>
/* Ajustes para mobile */
@media (max-width: 600px) {
  .v-card {
    margin: 16px;
  }
  
  .d-flex.align-center.ga-2 {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .v-select, .v-text-field {
    width: 100%;
  }
}
</style>