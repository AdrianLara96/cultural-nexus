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
    class="collection-card h-100"
    hover
    :to="`/collections/${collection.id}`"
    color="color || 'secondary'"
  >
    <v-img
      v-if="collection.imageUrl || collection.thumbnailUrl"
      :src="collection.imageUrl || collection.thumbnailUrl"
      height="300"
      max-height="300"
      cover
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-h6 text-primary px-4 pt-4 pb-2">
      {{ collection.title || collection.name }}
    </v-card-title>

    <v-card-text class="d-flex flex-column flex-grow-1">
      <div class="mb-2">
        <v-chip
          v-if="collection.type"
          size="small"
          color="primary"
          variant="outlined"
          class="text-primary"
        >
          {{ collection.type }}
        </v-chip>
      </div>

      <p v-if="collection.description" class="mb-4">
        {{ collection.description.substring(0, 120) }}{{ collection.description.length > 120 ? '...' : '' }}
      </p>

      <div class="flex-grow-1"></div>

      <div v-if="collection.itemCount" class="text-caption opacity-75 mb-2">
        <v-icon size="small" class="mr-1">mdi-file-multiple</v-icon>
        {{ collection.itemCount }} ítems
      </div>
    </v-card-text>

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