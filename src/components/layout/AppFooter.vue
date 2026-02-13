<!-- src/components/layout/AppFooter.vue -->
<template>
  <v-footer padless>
    <v-row justify="center" no-gutters>
      <v-col class="py-4 text-center" cols="12">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :href="link.href"
          variant="text"
          class="mx-2 text-white"
          target="_blank"
        >
          {{ link.title }}
        </v-btn>
      </v-col>
      
      <v-col class="py-4 text-center" cols="12">
        <strong class="d-block text-white">
          © {{ new Date().getFullYear() }} Cultural Nexus - Todos los derechos reservados
        </strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
const links = [
  { title: 'Home', href: '/' },
  { title: 'About Us', href: '/about' },
  { title: 'Contact', href: '/contact' },
]
</script>

<style scoped>
.v-footer {
  background-color: var(--palette-accent1) !important;
  color: var(--palette-headings) !important;
}

.v-footer a {
  color: var(--palette-headings) !important;
}

.v-footer a:hover {
  color: var(--palette-accent2) !important;
  text-decoration: underline;
}
</style>