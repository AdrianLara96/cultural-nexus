<!-- src/components/glam/CollectionCard.vue -->
<script setup lang="ts">
import type { GLAMCollection } from '@/types/glam'

defineProps<{
  collection: GLAMCollection
  color?: string
}>()
</script>

<template>
  <v-card
    class="collection-card h-100 w-100"
    hover
    :to="`/collections/${collection.id}`"
    :color="color || 'secondary'"
  >
    
    <!-- Titulo de la collection-->
    <v-card-title class="text-h6 text-primary px-4 pt-4 pb-2">
      {{ collection.title || collection.name }}
    </v-card-title>

    <!-- Imagen de la collection -->
    <v-img
      v-if="collection.thumbnail"
      :src="collection.thumbnail"
      height="200"
      max-height="200"
      cover
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <!-- Fallback si no hay thumbnail -->
    <div 
      v-else 
      class="collection-placeholder d-flex align-center justify-center"
      style="height: 200px; background: rgba(69, 82, 69, 0.1);"
    >    
      <v-icon size="64" color="primary" icon="mdi-folder-multiple" />
    </div>

    <v-card-actions>
      <v-btn
        size="small"
        variant="text"
        append-icon="mdi-open-in-new"
        class="text-primary font-weight-bold"
      >
        Explorar colección
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.collection-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border: 1px solid rgba(69, 82, 69, 0.2);
}

.collection-card:hover {
  transform: translateY(-4px);
  border-color: #a35657; /* Tu color accent */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}


.collection-card :deep(.v-card-text) {
  display: flex;
  flex-direction: column;
}
</style>