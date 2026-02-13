<!-- src/views/RecordsView.vue -->
<script setup lang="ts">
import { useGlam } from '@/composables/useGlam'
import RecordCard from '@/components/glam/RecordCard.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(20)

const { 
  records, 
  totalRecords, 
  loadRecords,
  isLoading 
} = useGlam()

async function loadPage(newPage: number) {
  page.value = newPage
  await loadRecords({ page: newPage, pageSize: pageSize.value })
  router.push({ query: { ...route.query, page: newPage } })
}

onMounted(() => {
  loadPage(page.value)
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <v-btn 
          color="secondary" 
          @click="$router.go(-2)" 
          class="mb-4 mr-4"
          variant="flat"
        >
          ← Volver a la lista
        </v-btn>
        <h1 class="text-h3 mb-4">Todos los ítems</h1>
      </v-col>
    </v-row>

    <v-row v-if="isLoading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="record in records"
        :key="record.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <RecordCard :record="record" />
      </v-col>
    </v-row>

    <v-row v-if="!isLoading && totalRecords > 0" justify="center" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="page"
          :length="Math.ceil(totalRecords / pageSize)"
          :total-visible="7"
          @update:model-value="loadPage"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-row v-if="!isLoading && records.length === 0" justify="center">
      <v-col cols="12" class="text-center">
        <v-alert type="info" variant="tonal">
          No se encontraron ítems.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>