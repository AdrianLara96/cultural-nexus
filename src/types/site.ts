// src/types/site.ts

/**
 * Representación de un sitio
 */
export interface Site {
    id: number
    slug: string
    title: string
    description?: string | null
    host?: string | null
    themes: string[]
    theme_settings: any
    glam_public_pages?: {
        media?: number
        record?: number
        resource?: number
        collection?: number
    } | null
    nav_items?: [number, string][]
    thumbnail_attachment_id?: [number, string] | null
    [key: string]: any
}

/**
 * Respuesta del endpoint /api/site/site
 */
export interface SitesResponse {
    items: Site[]
    total: number
    groups: any | null
}