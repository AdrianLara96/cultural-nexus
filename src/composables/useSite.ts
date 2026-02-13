// src/composables/useSite.ts

// Usa la Composition API
import { ref, computed, onMounted } from 'vue'
import { getCurrentSite, getGlamConfig, getNavItems, getImageUrl} from '@/services/site'
import type { Site } from '@/types/site'
import { SITE_ID } from '@/config/site'

export function useSite() {
  const site = ref<Site | null>(null)
  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)

  /**
   * Carga la configuración del sitio
   */
  async function loadSite() {
    try {
      loading.value = true
      error.value = null
      
      const siteData = await getCurrentSite()
      site.value = siteData
      
      loading.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading site'
      loading.value = false
      console.error('Error loading site:', err)
    }
  }

  // Cargar automáticamente al montar
  onMounted(() => {
    if (!site.value) {
      loadSite()
    }
  })

  // Configuración GLAM
  const glamConfig = computed(() => {
    if (!site.value) return null
    return getGlamConfig(site.value)
  })

  // Items de navegación
  const navItems = computed(() => {
    if (!site.value) return []
    return getNavItems(site.value)
  })

  // URL del logo/thumbnail
  const thumbnailUrl = computed(() => {
    if (!site.value?.thumbnail_attachment_id) return null
    return getImageUrl(site.value.thumbnail_attachment_id[0])
  })

  // Título del sitio
  const siteTitle = computed(() => site.value?.title || 'Cultural Nexus')

  // Slug del sitio
  const siteSlug = computed(() => site.value?.slug || '')

  return {
    // Datos
    site,
    siteTitle,
    siteSlug,
    glamConfig,
    navItems,
    thumbnailUrl,
    
    // Estado
    loading,
    error,
    
    // Métodos
    loadSite,
    
    // Constantes
    SITE_ID,
  }
}