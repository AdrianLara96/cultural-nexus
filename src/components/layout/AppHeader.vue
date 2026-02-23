<!-- src/components/layout/AppHeader.vue -->

<template>
  <v-app-bar color="primary" flat>
    <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none text-white">
        Cultural Nexus
      </router-link>
    </v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-magnify"></v-btn>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list nav>
      <v-list-item link to="/" :active="isActive('/')">
        <v-list-item-title>Inicio</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/records" :active="isActive('/records')">
        <v-list-item-title>Ver todos los registros</v-list-item-title>
      </v-list-item>
      <v-list-item link to="/collections" :active="isActive('/collections')">
        <v-list-item-title>Ver todas las colecciones</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['toggleDrawer'])

const route = useRoute()
const drawer = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
  emit('toggleDrawer')
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
/* Aplica variables CSS directamente */
.v-app-bar {
  background-color: var(--palette-accent1) !important;
  color: var(--palette-headings) !important;
}

.v-app-bar-title a {
  color: var(--palette-headings) !important;
}

.v-navigation-drawer {
  background-color: var(--palette-bg) !important;
  color: var(--palette-text) !important;
}

.v-list-item-title {
  color: var(--palette-text) !important;
}

.v-list-item--active {
  background-color: var(--palette-bg-alt) !important;
  color: var(--palette-accent1) !important;
}
</style>