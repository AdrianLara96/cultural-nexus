<!-- src/components/glam/RecordCard.vue -->
<script setup lang="ts">
import type { GLAMRecord } from '@/types/glam'

defineProps<{
  record: GLAMRecord
}>()
</script>

<template>
  <v-card
    class="record-card"
    hover
    :to="`/records/${record.id}`"
  >
    <v-img
      v-if="record.imageUrl || record.thumbnailUrl"
      :src="record.imageUrl || record.thumbnailUrl"
      height="200"
      cover
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-h6">
      {{ record.title }}
    </v-card-title>

    <v-card-text>
      <div class="text-subtitle-1 mb-2">
        <v-chip
          v-if="record.type"
          size="small"
          color="primary"
          variant="outlined"
        >
          {{ record.type }}
        </v-chip>
      </div>

      <p v-if="record.description" class="text-body-2 text-grey-darken-1">
        {{ record.description.substring(0, 100) }}{{ record.description.length > 100 ? '...' : '' }}
      </p>

      <div v-if="record.creator || record.date" class="text-caption text-grey">
        <span v-if="record.creator">
          {{ Array.isArray(record.creator) ? record.creator.join(', ') : record.creator }}
        </span>
        <span v-if="record.date" class="ml-2">
          ({{ record.date }})
        </span>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        size="small"
        variant="text"
        append-icon="mdi-open-in-new"
      >
        Ver más
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.record-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--palette-border);
  background-color: var(--palette-bg);
  color: var(--palette-text);
}

.record-card :hover {
  border-color: var(--palette-accent1);
}

.record-card :deep(.v-card-text) {
  flex-grow: 1;
}
</style>