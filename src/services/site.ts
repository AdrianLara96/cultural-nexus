// src/services/site.ts

import { SITE_ID, API_CONFIG } from '@/config/site'
import type { Site, SitesResponse } from '@/types/site'

/**
 * Obtiene la configuración del sitio actual (filtrado por SITE_ID)
 */
export async function getCurrentSite(): Promise<Site> {
  const response = await fetch('/api/site/site')
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
  }
  
  const data: SitesResponse = await response.json()
  
  // Busca el sitio con el SITE_ID configurado
  const site = data.items?.find((item: Site) => item.id === SITE_ID)
  
  if (!site) {
    throw new Error(`Site with ID ${SITE_ID} not found`)
  }
  
  return site
}

/**
 * Extrae la configuración GLAM del sitio
 */
export function getGlamConfig(site: Site) {
  const granadaSettings = site.theme_settings?.['theme-granada'] || {}
  
  return {
    // Tamaño de página
    pageSize: granadaSettings.granada_page_size || 20,
    
    // Vista por defecto
    defaultView: granadaSettings.granada_records_default_view || 'grid',
    
    // Orden por defecto
    defaultOrder: {
      field: granadaSettings.granada_default_order_field,
      direction: granadaSettings.granada_default_order_direction || 'asc',
    },
    
    // Páginas GLAM
    pages: {
      records: site.glam_public_pages?.record,
      collections: site.glam_public_pages?.collection,
      media: site.glam_public_pages?.media,
      resource: site.glam_public_pages?.resource,
    },
  }
}

/**
 * Extrae los items de navegación del sitio
 * Con protección contra datos inesperados
 */
export function getNavItems(site: Site) {
  // Verificar que nav_items exista, sea un array y contenga elementos iterables
  if (!site.nav_items || !Array.isArray(site.nav_items)) {
    console.warn('nav_items is not an array, returning empty array:', site.nav_items)
    return []
  }
  
  // Verificar cada elemento antes de intentar desestructurarlo
  return site.nav_items
    .filter(item => Array.isArray(item) && item.length >= 2) // Asegurar que cada item sea un array con al menos 2 elementos
    .map(([id, label]) => ({
      id,
      label,
    }))
}

/**
 * Obtiene la URL de una imagen del sitio
 */
export function getImageUrl(attachmentId: number | undefined) {
  if (!attachmentId) return null
  
  return `/api/core/attachment/action_get/thumb?attachment_id=${attachmentId}&size=large`
}