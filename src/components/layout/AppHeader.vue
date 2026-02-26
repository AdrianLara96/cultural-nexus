<!-- src/components/layout/AppHeader.vue -->

<template>
  <div >
    <v-app-bar color="primary" flat>

      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title class="text-center">
        <router-link to="/" class="text-decoration-none text-secondary">
          <strong>Cultural Nexus</strong>
        </router-link>
      </v-app-bar-title>

      <template v-slot:append>
        <v-btn 
          icon="mdi-magnify"
          to="/search"
          class="text-white"
          color="secondary"
        ></v-btn>
      </template>
    </v-app-bar>
  </div>

  <v-navigation-drawer v-model="drawer" temporary>
    <v-list nav>
      <v-list-item link to="/" :active="isActive('/')">
        <v-list-item-title><strong>Inicio</strong></v-list-item-title>
      </v-list-item>
      <v-list-item link to="/records" :active="isActive('/records')">
        <v-list-item-title><strong>Registros</strong></v-list-item-title>
      </v-list-item>
      <v-list-item link to="/collections" :active="isActive('/collections')">
        <v-list-item-title><strong>Colecciones</strong></v-list-item-title>
      </v-list-item>
      <v-list-item link to="/search" :active="isActive('/search')">
        <v-list-item-title><strong>Búsqueda</strong></v-list-item-title>
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