<!-- src/views/CollectionsView.vue -->
<script setup lang="ts">
import { useGlam } from '@/composables/useGlam'
import CollectionCard from '@/components/glam/CollectionCard.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(12)

const { 
  collections, 
  totalCollections, 
  loadCollections,
  isLoading 
} = useGlam()

async function loadPage(newPage: number) {
  page.value = newPage
  await loadCollections({ page: newPage, pageSize: pageSize.value })
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
        <h1 class="text-h3 mb-4">Todas las colecciones</h1>
      </v-col>
    </v-row>

    <v-row v-if="isLoading" justify="center">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
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

    <v-row v-if="!isLoading && totalCollections > 0" justify="center" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="page"
          :length="Math.ceil(totalCollections / pageSize)"
          :total-visible="7"
          @update:model-value="loadPage"
        ></v-pagination>
      </v-col>
    </v-row>

    <v-row v-if="!isLoading && collections.length === 0" justify="center">
      <v-col cols="12" class="text-center">
        <v-alert type="info" variant="tonal">
          No se encontraron colecciones.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>