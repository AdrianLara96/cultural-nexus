<!-- src/components/layout/AppHeader.vue -->
<script setup lang="ts">
import { useSite } from '@/composables/useSite'
import { useDisplay } from 'vuetify'

const { siteTitle, navItems, loading, thumbnailUrl } = useSite()
const display = useDisplay()


</script>

<template>
  <v-app-bar
    color="primary"
    dark
    elevate-on-scroll
  >
    <v-app-bar-nav-icon
      v-if="display.mobile.value"
      variant="text"
      @click="$emit('toggleDrawer')"
    ></v-app-bar-nav-icon>

    <v-app-bar-title>
      <div class="d-flex align-center">
        <v-img
          v-if="thumbnailUrl"
          :src="thumbnailUrl"
          max-height="40"
          max-width="40"
          class="mr-2"
          contain
        ></v-img>
        <span>{{ siteTitle }}</span>
      </div>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div v-if="navItems && navItems.length > 0">
      <v-tabs
        v-if="!loading && navItems.length > 0"
        centered
        hide-slider
      >
        <v-tab
          v-for="item in navItems"
          :key="item.id"
        >
          {{ item.label }}
        </v-tab>
      </v-tabs>
    </div>

    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<style scoped>
.v-app-bar-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>