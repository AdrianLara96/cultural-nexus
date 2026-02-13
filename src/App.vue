<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const drawer = ref(false)

function toggleDrawer() {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-app>
    <AppHeader @toggleDrawer="toggleDrawer" />

    <v-main>
      <v-container fluid class="pa-0">
        <RouterView />
      </v-container>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<style>
#app {
  font-family: 'Inter', sans-serif;
}

.v-application {
  background-color: var(--palette-bg) !important;
}

.v-app-bar {
  background-color: var(--palette-accent1) !important;
}

.text-primary {
  color: var(--palette-accent1) !important;
}

.text-secondary {
  color: var(--palette-accent2) !important;
}

.border {
  border-color: var(--palette-border) !important;
}

</style>