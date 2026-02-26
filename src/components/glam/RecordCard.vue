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
    <!-- Título del record -->
    <v-card-title class="text-h6 text-primary px-4 pt-4 pb-2">
      {{ record.title }}
    </v-card-title>

    <!-- Imagen del record -->
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

    <v-card-actions>
      <v-btn
        size="small"
        variant="text"
        append-icon="mdi-open-in-new"
        class="text-primary font-weight-bold"
      >
        Detalles
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