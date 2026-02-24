<!-- src/components/glam/RecordCard.vue -->
<script setup lang="ts">
import type { GLAMRecord } from '@/types/glam'

defineProps<{
  record: GLAMRecord
  color?: string
}>()
</script>

<template>
  <v-card
    class="record-card h-100"
    hover
    :to="`/records/${record.id}`"
    color="color || 'secondary'"
  >
    <v-img
      v-if="record.imageUrl || record.thumbnailUrl"
      :src="record.imageUrl || record.thumbnailUrl"
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
      {{ record.title }}
    </v-card-title>

    <v-card-text class="d-flex flex-column flex-grow-1">
      <div class="mb-2">
        <v-chip
          v-if="record.type"
          size="small"
          color="primary"
          variant="outlined"
          class="text-primary"
        >
          {{ record.type }}
        </v-chip>
      </div>

      <p v-if="record.description" class="mb-4">
        {{ record.description.substring(0, 200) }}{{ record.description.length > 200 ? '...' : '' }}
      </p>

      <div class="flex-grow-1"></div>

      <div v-if="record.creator || record.date" class="text-caption opacity-75 mb-2">
        <span v-if="record.creator">
          {{ Array.isArray(record.creator) ? record.creator.join(', ') : record.creator }}
        </span> 
        <p v-if="record.date" class="mb-1">
          ({{ record.date }})
        </p>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        size="small"
        variant="text"
        append-icon="mdi-open-in-new"
        class="text-primary font-weight-bold"
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
  transition: all 0.3s ease;
  border: 1px solid rgba(69, 82, 69, 0.2);
}

.record-card:hover {
  transform: translateY(-4px);
  border-color: #a35657; /* Tu color accent */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.record-card :deep(.v-img) {
  flex-shrink: 0;
}

.record-card :deep(.v-card-text) {
  display: flex;
  flex-direction: column;
}
</style>