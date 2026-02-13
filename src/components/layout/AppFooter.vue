<!-- src/components/layout/AppFooter.vue -->
<script setup lang="ts">
import { useSite } from '@/composables/useSite'

const { siteTitle } = useSite()
</script>

<template>
  <v-footer color="grey-darken-3" app>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <span>&copy; {{ new Date().getFullYear() }} - {{ siteTitle }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>