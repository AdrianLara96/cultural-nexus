<!-- src/components/glam/CollectionCard.vue -->
<script setup lang="ts">
import type { GLAMCollection } from '@/types/glam'

defineProps<{
  collection: GLAMCollection
}>()
</script>

<template>
  <v-card
    class="collection-card"
    hover
    :to="`/collections/${collection.id}`"
  >
    <v-card-title class="text-h6">
      {{ collection.title || collection.name }}
    </v-card-title>

    <v-card-text>
      <div class="text-subtitle-1 mb-2">
        <v-chip
          v-if="collection.type"
          size="small"
          color="secondary"
          variant="outlined"
        >
          {{ collection.type }}
        </v-chip>
      </div>

      <p v-if="collection.description" class="text-body-2 text-grey-darken-1">
        {{ collection.description.substring(0, 120) }}{{ collection.description.length > 120 ? '...' : '' }}
      </p>

      <div v-if="collection.itemCount" class="text-caption text-grey mt-2">
        <v-icon size="small" class="mr-1">mdi-file-multiple</v-icon>
        {{ collection.itemCount }} ítems
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        size="small"
        variant="text"
        append-icon="mdi-open-in-new"
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
  border: 1px solid var(--palette-border);
  background-color: var(--palette-bg);
  color: var(--palette-text);
}

.collection-card :hover {
  border-color: var(--palette-accent1);
}


.collection-card :deep(.v-card-text) {
  flex-grow: 1;
}
</style>