// src/config/site.ts

/**
 * CONFIGURACIÓN GLOBAL DEL SITIO GLAM
 * 
 * Para usar el tema en diferentes sitios, solo hay que cambiar SITE_IDD
 * 
 * Usaremos:
 * - SITE_ID = 8 → Sitio "granada" (por defecto, más actualizado)
 */
export const SITE_ID = 8

/**
 * Configuración base de las APIs
 */
export const API_CONFIG = {
  site: '/api/site/site',
  glam: '/api/glam',
} as const