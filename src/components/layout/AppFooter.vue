
<template>
  <v-footer padless color="primary" class="text-white py-4">
    <v-row justify="center" no-gutters>
      <v-col class="py-4 text-center" cols="12">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :href="link.href"
          variant="text"
          class="mx-2 text-secondary"
          target="_blank"
        >
          {{ link.title }}
        </v-btn>
      </v-col>
      
      <v-col class="py-4 text-center text-body-2" cols="12">
        <p class="text-secondary mb-0">
          <strong>
            © {{ new Date().getFullYear() }} Cultural Nexus - Todos los derechos reservados
          </strong>
        </p>
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